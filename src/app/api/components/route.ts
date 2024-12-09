import { NextResponse } from 'next/server';
import { readdirSync } from 'fs';
import { join } from 'path';
import { ComponentMeta } from '@/types/component';

export async function GET() {
  try {
    const COMPONENTS_DIR = join(process.cwd(), 'src/app/components');
    
    // Verify components directory exists
    try {
      const stats = readdirSync(COMPONENTS_DIR, { withFileTypes: true });
      if (!stats) {
        throw new Error('Components directory not found');
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Components directory not found or inaccessible' },
        { status: 404 }
      );
    }

    const components: ComponentMeta[] = [];
    const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true });
    const componentDirs = entries.filter(entry => entry.isDirectory());

    const loadErrors: string[] = [];

    await Promise.all(componentDirs.map(async (dir) => {
      try {
        const componentPath = join(COMPONENTS_DIR, dir.name);
        const files = readdirSync(componentPath);
        
        // First try to load from metadata.ts
        const metadataFile = files.find(file => file === 'metadata.ts');
        if (metadataFile) {
          const { metadata } = await import(`@/app/components/${dir.name}/metadata`);
          if (metadata) {
            components.push({
              ...metadata,
              path: dir.name
            });
            return;
          }
        }
        
        // Fallback to component file
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
            return;
          }
        }

        loadErrors.push(`No metadata found for component: ${dir.name}`);
      } catch (error) {
        loadErrors.push(`Failed to load component ${dir.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }));

    if (components.length === 0 && loadErrors.length > 0) {
      return NextResponse.json(
        { error: 'Failed to load any components', details: loadErrors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      components,
      ...(loadErrors.length > 0 && { warnings: loadErrors })
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
