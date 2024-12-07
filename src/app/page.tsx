import { readdirSync } from 'fs';
import { join } from 'path';
import ClientPage from './client-page';
import { ComponentMeta } from '@/types/component';

/**
 * Going to cry if this dynamic loading doesn't work ;-;
 * Component Directory Structure:
 * /src/app/components/[component-name]/
 *   ├── ComponentName.tsx    - Main component file with metadata
 *   └── page.tsx            - Preview page
 * 
 * Expected Metadata Structure in ComponentName.tsx:
 * export const metadata = {
 *   name: 'Component Display Name',
 *   type: 'Section Component | Hero | Card | etc',
 *   description: 'Brief description of the component',
 *   tags: ['tag1', 'tag2', 'tag3'],
 *   dateAdded: '2024-01-17' // ISO date string
 * }
 * 
 * Image Locations:
 * 1. Component Images (placeholders, icons, etc):
 *    - Store in: /public/images/
 *    - Use in components: <Image src="/public/images/image-name.png" />
 * 
 * 2. Preview Images (screenshots of the component):
 *    - Store in: /public/previews/[component-name].extension
 *    - Example: /public/previews/photography-hero-section.png
 */

async function getServerComponents(): Promise<ComponentMeta[]> {
  try {
    const COMPONENTS_DIR = join(process.cwd(), 'src/app/components');
    const components: ComponentMeta[] = [];

    const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true });
    const componentDirs = entries.filter(entry => entry.isDirectory());

    for (const dir of componentDirs) {
      try {
        const componentPath = join(COMPONENTS_DIR, dir.name);
        const files = readdirSync(componentPath);
        
        // First try to find metadata.ts file
        const metadataFile = files.find(file => file === 'metadata.ts');
        
        if (metadataFile) {
          const { metadata } = await import(`@/app/components/${dir.name}/metadata`);
          if (metadata) {
            components.push({
              ...metadata,
              path: dir.name
            });
            continue;
          }
        }
        
        // Fallback to finding metadata in component file
        const componentFile = files.find(file => 
          file.endsWith('.tsx') && 
          !file.includes('page.tsx')
        );

        if (componentFile) {
          const { metadata } = await import(`@/app/components/${dir.name}/${componentFile}`);
          if (metadata) {
            components.push({
              ...metadata,
              path: dir.name
            });
          }
        }
      } catch (error) {
        console.error(`Error loading component from ${dir.name}:`, error);
      }
    }
    return components;
  } catch (error) {
    console.error('Error loading components:', error);
    return [];
  }
}

function getComponentTypes(components: ComponentMeta[]): string[] {
  const types = new Set(components.map(component => component.type));
  return Array.from(types).sort();
}

export default async function Home() {
  const components = await getServerComponents();
  const types = getComponentTypes(components);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Component Library</h1>
      <ClientPage initialComponents={components} types={types} />
    </div>
  );
}
