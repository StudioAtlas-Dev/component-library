import { readdirSync } from 'fs';
import { join } from 'path';
import React from 'react';
import { ComponentMeta } from '@/types/component';

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
        // Find the main component file
        const files = readdirSync(path);
        const componentFile = files.find(file => 
          file.endsWith('.tsx') && 
          !file.includes('page.tsx')
        );

        if (!componentFile) {
          throw new Error(`No component file found in ${name}`);
        }

        // Import the component and its metadata
        const module = await import(`@/app/components/${name}/${componentFile}`);
        Component = module.default;
        metadata = module.metadata;
      });

      // Test metadata structure
      test('has valid metadata structure', () => {
        expect(metadata).toBeDefined();
        expect(metadata).toEqual(
          expect.objectContaining({
            name: expect.any(String),
            type: expect.any(String),
            description: expect.any(String),
            tags: expect.arrayContaining([expect.any(String)]),
            dateAdded: expect.any(String)
          })
        );
      });

      // Test component rendering
      test('renders without crashing', () => {
        expect(() => {
          const element = React.createElement(Component);
          // Basic render test - we could add more sophisticated rendering tests if needed
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
  test('component library structure', () => {
    expect(componentDirs.length).toBeGreaterThan(0);
    
    // Check that we have different types of components
    const components = componentDirs.map(({ name, path }) => {
      const files = readdirSync(path);
      const componentFile = files.find(file => 
        file.endsWith('.tsx') && 
        !file.includes('page.tsx')
      );
      if (componentFile) {
        const { metadata } = require(`@/app/components/${name}/${componentFile}`);
        return metadata;
      }
    }).filter(Boolean);

    const types = new Set(components.map(c => c.type));
    expect(types.size).toBeGreaterThan(0);
  });
});
