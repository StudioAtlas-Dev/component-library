import { readdirSync } from 'fs';
import { join } from 'path';
import { ComponentMeta } from '@/types/component';

/**
 * Represents the result of loading component metadata from the filesystem.
 * Components are expected to be in /src/app/components/[component-name]/metadata.ts
 */
interface LoadComponentsResult {
  /** Array of successfully loaded component metadata */
  components: ComponentMeta[];
  /** Non-fatal issues encountered during loading (e.g., missing metadata files) */
  warnings?: string[];
  /** Fatal error that prevented loading any components */
  error?: string;
}

/**
 * Loads all component metadata from the components directory.
 * 
 * Expected directory structure:
 * /src/app/components/
 * ├── [component-name]/
 * │   ├── metadata.ts        - Component metadata and configuration
 * │   ├── ComponentName.tsx  - Main component implementation
 * │   └── page.tsx          - Preview/demo page
 * 
 * The metadata.ts file should export a 'metadata' object conforming to ComponentMeta type.
 * 
 * Error Handling:
 * - Returns empty components array with error if components directory is inaccessible
 * - Collects warnings for individual component loading failures
 * - Components with missing or invalid metadata are skipped with warnings
 * 
 * @returns Promise<LoadComponentsResult> Object containing loaded components and any errors/warnings
 */
export async function loadComponents(): Promise<LoadComponentsResult> {
  try {
    const COMPONENTS_DIR = join(process.cwd(), 'src/app/components');
    const components: ComponentMeta[] = [];
    const warnings: string[] = [];

    // Verify components directory exists and is accessible
    try {
      const stats = readdirSync(COMPONENTS_DIR, { withFileTypes: true });
      if (!stats) {
        throw new Error('Components directory not found');
      }
    } catch (error) {
      return {
        components: [],
        error: 'Components directory not found or inaccessible'
      };
    }

    const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true });
    const componentDirs = entries.filter(entry => entry.isDirectory());

    // Load metadata from each component directory in parallel
    await Promise.all(componentDirs.map(async (dir) => {
      try {
        const componentPath = join(COMPONENTS_DIR, dir.name);
        const files = readdirSync(componentPath);
        
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

        warnings.push(`No metadata.ts found for component: ${dir.name}`);
      } catch (error) {
        warnings.push(`Failed to load component ${dir.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }));

    return {
      // Sort components alphabetically by name for consistent ordering
      components: components.sort((a, b) => a.name.localeCompare(b.name)),
      warnings: warnings.length > 0 ? warnings : undefined
    };
  } catch (error) {
    return {
      components: [],
      error: `Error loading components: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
} 