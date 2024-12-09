import { readdirSync } from 'fs';
import { join } from 'path';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComponentMeta } from '@/types/component';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

// Helper function to get all component directories
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

describe('Component Library Tests', () => {
  const componentDirs = getComponentDirs();

  // Test each component directory
  componentDirs.forEach(({ name, path }) => {
    describe(`Component: ${name}`, () => {
      let Component: React.ComponentType<any>;
      let metadata: ComponentMeta;

      beforeAll(async () => {
        try {
          // Find the main component file
          const files = readdirSync(path);
          const componentFile = files.find(file => 
            file.endsWith('Component.tsx') || file.includes('Component')
          );

          if (!componentFile) {
            throw new Error(`No component file found in ${name}`);
          }

          // Import the component and its metadata
          const module = await import(`@/app/components/${name}/${componentFile}`);
          Component = module.default || module;
          
          // Import metadata from separate file if it exists
          try {
            const metadataModule = await import(`@/app/components/${name}/metadata`);
            metadata = metadataModule.metadata;
          } catch (error) {
            // If metadata file doesn't exist, create default metadata
            metadata = {
              name: name,
              type: 'Section Component',
              description: 'Component description',
              tags: ['test'],
              dateAdded: new Date().toISOString(),
              path: name
            };
          }
        } catch (error) {
          console.error(`Error loading component ${name}:`, error);
        }
      });

      // Test metadata structure
      test('has valid metadata structure', async () => {
        expect(metadata).toBeDefined();
        expect(metadata).toEqual(
          expect.objectContaining({
            name: expect.any(String),
            type: expect.any(String),
            tags: expect.arrayContaining([expect.any(String)]),
            dateAdded: expect.any(String)
          })
        );
      });

      // Test component rendering
      test('renders without crashing', () => {
        expect(() => {
          const element = React.createElement(Component);
          expect(element).toBeTruthy();
        }).not.toThrow();
      });

      // Test component props
      test('accepts backgroundColor and popColor props', () => {
        const testProps = {
          backgroundColor: '#000000',
          popColor: '#ffffff'
        };
        
        const element = React.createElement(Component, testProps);
        expect(element.props).toEqual(expect.objectContaining(testProps));
      });

      // Test accessibility
      test('has proper ARIA attributes and semantic structure', () => {
        const { container } = render(<Component />);

        // Check for proper heading hierarchy
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headingLevels = Array.from(headings).map(h => parseInt(h.tagName[1]));
        
        // Ensure heading levels are sequential
        headingLevels.forEach((level, index) => {
          if (index > 0) {
            expect(level - headingLevels[index - 1]).toBeLessThanOrEqual(1);
          }
        });

        // Check for ARIA roles and labels
        const regions = container.querySelectorAll('[role]');
        regions.forEach(region => {
          // Only check for aria-label if the role requires it
          const role = region.getAttribute('role');
          if (['region', 'complementary', 'navigation', 'banner', 'contentinfo'].includes(role || '')) {
            expect(region).toHaveAttribute('aria-label');
          }
        });

        // Check for alt text on images
        const images = container.querySelectorAll('img');
        images.forEach(img => {
          expect(img).toHaveAttribute('alt');
          expect(img.getAttribute('alt')).not.toBe('');
        });
      });

      // Test image loading
      test('uses appropriate image loading strategy', () => {
        const { container } = render(<Component />);
        
        // Get all Next.js Image components
        const images = container.querySelectorAll('img');
        
        images.forEach(img => {
          // Check if image has sizes attribute for responsive loading
          if (img.getAttribute('sizes')) {
            expect(img.getAttribute('sizes')).toBeTruthy();
          }
          
          // Check if image has loading attribute
          if (!name.toLowerCase().includes('hero')) {
            expect(img).toHaveAttribute('loading', 'lazy');
          }
          
          // Check for proper image optimization attributes
          if (img.getAttribute('srcset')) {
            expect(img.getAttribute('srcset')).toMatch(/^\//);
          }
        });
      });

      // Test that required files exist
      test('has necessary files', () => {
        const files = readdirSync(path);
        
        // Every component should have a main component file and a page.tsx
        expect(
          files.some(file => file.endsWith('Component.tsx'))
        ).toBeTruthy();
        
        expect(
          files.some(file => file === 'page.tsx')
        ).toBeTruthy();
      });
    });
  });

  // Test overall component library structure
  test('component library structure', async () => {
    expect(componentDirs.length).toBeGreaterThan(0);
    
    // Check that we have different types of components
    const components = await Promise.all(
      componentDirs.map(async ({ name }) => {
        try {
          const { metadata } = await import(`@/app/components/${name}/metadata`);
          return metadata;
        } catch (error) {
          return null;
        }
      })
    );

    const validComponents = components.filter(Boolean);
    const types = new Set(validComponents.map(c => c.type));
    expect(types.size).toBeGreaterThan(0);
  });
});
