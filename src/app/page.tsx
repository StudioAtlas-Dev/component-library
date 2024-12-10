import { ComponentMeta } from '@/types/component';
import ClientPage from './client-page';
import { loadComponents } from '@/lib/load-components';

/**
 * Extracts unique component types from the loaded components.
 * Used for filtering components in the component browser.
 * 
 * @param components - Array of component metadata
 * @returns Array of unique component types, sorted alphabetically
 */
function getComponentTypes(components: ComponentMeta[]): string[] {
  const types = new Set(components.map(component => component.type));
  return Array.from(types).sort();
}

/**
 * Home Page: Component Library Browser
 * 
 * Loads and displays all available components in a filterable grid.
 * Components are loaded server-side and passed to the client component
 * for interactive filtering and preview.
 * 
 * Any loading warnings are logged to the server console but don't prevent
 * the page from rendering with successfully loaded components.
 */
export default async function Home() {
  const result = await loadComponents();
  const components = result.components;
  const types = getComponentTypes(components);

  // Log any warnings to the server console for debugging
  if (result.warnings?.length) {
    console.warn('Component loading warnings:', result.warnings);
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Component Library</h1>
      <ClientPage initialComponents={components} types={types} />
    </div>
  );
}
