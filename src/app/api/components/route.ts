import { NextResponse } from 'next/server';
import { readdirSync } from 'fs';
import { join } from 'path';
import { ComponentMeta } from '@/types/component';

export async function GET() {
  try {
    const COMPONENTS_DIR = join(process.cwd(), 'src/app/components');
    const components: ComponentMeta[] = [];

    // Read all directories in the components folder
    const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true });
    const componentDirs = entries.filter(entry => entry.isDirectory());

    for (const dir of componentDirs) {
      try {
        // Import the metadata from the component
        const componentPath = join(COMPONENTS_DIR, dir.name);
        const files = readdirSync(componentPath);
        
        // Find the main component file (not page.tsx)
        const componentFile = files.find(file => 
          file.endsWith('.tsx') && 
          !file.includes('page.tsx')
        );

        if (componentFile) {
          const { metadata } = await import(`@/app/components/${dir.name}/${componentFile}`);
          if (metadata) {
            components.push({
              ...metadata,
              path: dir.name // Ensure path is set to directory name
            });
          }
        }
      } catch (error) {
        console.error(`Error loading component from ${dir.name}:`, error);
      }
    }

    console.log('API returning components:', components);
    return NextResponse.json(components);
  } catch (error) {
    console.error('Error in GET components:', error);
    return NextResponse.json({ error: 'Failed to load components' }, { status: 500 });
  }
}
