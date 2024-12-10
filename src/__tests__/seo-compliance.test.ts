import { readdirSync } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import * as path from 'path';

describe('SEO Component Compliance Tests', () => {
  // Same logic as components.test.jsx to find component directories
  function getComponentDirs() {
    const COMPONENTS_DIR = join(process.cwd(), 'src/app/components');
    const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(dir => ({
        name: dir.name,
        path: join(COMPONENTS_DIR, dir.name)
      }));
  }

  const componentDirs = getComponentDirs();

  if (!componentDirs || componentDirs.length === 0) {
    test('no components found', () => {
      // If no directories found at all, fail like in components.test.jsx
      expect(componentDirs.length).toBeGreaterThan(0);
    });
    return;
  }

  // Regex for SEO tags and imports
  const seoTagRegex = /<(Meta|Title|Head|Header|Nav|Footer)(\s|>|\/)/;
  const headImportRegex = /import\s+(?:Head|\{[^}]*Head[^}]*\})\s+from\s+['"]next\/head['"]/;

  function isSEOImportant(content: string): boolean {
    return seoTagRegex.test(content) || headImportRegex.test(content);
  }

  // Detect client rendering recursively
  function isClientRendered(filePath: string, checkedPaths: Set<string> = new Set()): boolean {
    if (checkedPaths.has(filePath)) return false;
    if (!fs.existsSync(filePath)) return false;

    checkedPaths.add(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes("'use client'")) return true;

    const importMatches = Array.from(content.matchAll(/from ['"]([^'"]+)['"]/g));
    for (const match of importMatches) {
      const importPath = match[1];
      if (importPath.startsWith('.')) {
        const absoluteImportPath = path.resolve(path.dirname(filePath), importPath);
        const possiblePaths = [
          `${absoluteImportPath}.tsx`,
          `${absoluteImportPath}/index.tsx`,
        ];
        for (const p of possiblePaths) {
          if (fs.existsSync(p) && isClientRendered(p, checkedPaths)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // Detect if a button link is used: Button with href
  const buttonWithHrefRegex = /<Button[^>]*\shref=|Button\(\{[^}]*href\s*:/;

  componentDirs.forEach(({ name, path }) => {
    describe(`Component: ${name}`, () => {
      let componentFile: string | undefined;
      let content: string | null = null;
      let absoluteFilePath: string | null = null;

      beforeAll(() => {
        const files = readdirSync(path);
        componentFile = files.find(file =>
          file.endsWith('Component.tsx') || file.includes('Component')
        );

        if (!componentFile) {
          throw new Error(`No component file found in ${name}`);
        }

        absoluteFilePath = join(path, componentFile);
        if (!fs.existsSync(absoluteFilePath)) {
          throw new Error(`Component file not found at ${absoluteFilePath}`);
        }

        content = fs.readFileSync(absoluteFilePath, 'utf8');
      });

      test('SEO and progressive enhancement compliance', () => {
        if (!content || !absoluteFilePath) {
          // If for some reason content or file isn't loaded, just fail
          expect(content).toBeTruthy();
          return;
        }

        const hasSEOElements = isSEOImportant(content);
        const clientRendered = isClientRendered(absoluteFilePath);

        if (hasSEOElements && clientRendered) {
          // If SEO + client-rendered:
          const usesButtonLink = buttonWithHrefRegex.test(content);
          const hasProgressiveEnhancement = content.includes('ProgressiveButton');

          if (usesButtonLink) {
            // Must have ProgressiveButton if using Button with href
            expect(hasProgressiveEnhancement).toBeTruthy();
            if (!hasProgressiveEnhancement) {
              throw new Error(
                `${componentFile} is client-rendered, has SEO-important elements, and uses Button with href but no ProgressiveButton found.`
              );
            }
          } else {
            // If SEO + client-rendered but no button link:
            // If you require progressive enhancement for all SEO client components:
            expect(hasProgressiveEnhancement).toBeTruthy();
            if (!hasProgressiveEnhancement) {
              throw new Error(
                `${componentFile} is client-rendered and has SEO-important elements but no ProgressiveButton found.`
              );
            }
          }
        } else {
          // If not SEO or not client-rendered, pass without conditions
          expect(true).toBe(true);
        }
      });
    });
  });

  test('component library structure', async () => {
    expect(componentDirs.length).toBeGreaterThan(0);

    const components = await Promise.all(
      componentDirs.map(async ({ name }) => {
        try {
          const { metadata } = await import(`@/app/components/${name}/metadata`);
          return metadata;
        } catch {
          return null;
        }
      })
    );

    const validComponents = components.filter((c): c is { type: string } => c !== null);
    const types = new Set(validComponents.map(c => c.type));
    expect(types.size).toBeGreaterThan(0);
  });
});
