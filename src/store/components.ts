import { ComponentMeta } from '@/types/component';

export async function getComponents(): Promise<ComponentMeta[]> {
  const response = await fetch('/api/components');
  if (!response.ok) {
    throw new Error('Failed to fetch components');
  }
  return response.json();
}

export function filterComponents(
  components: ComponentMeta[],
  search: string,
  selectedType: string,
  sortBy: 'Name' | 'Date Added' = 'Name'
): ComponentMeta[] {
  let filtered = [...components].filter(component => component && component.name);

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      component =>
        component.name.toLowerCase().includes(searchLower) ||
        component.description?.toLowerCase().includes(searchLower) ||
        component.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Filter by type
  if (selectedType !== 'All') {
    filtered = filtered.filter(component => component.type === selectedType);
  }

  // Sort components
  filtered.sort((a, b) => {
    if (!a || !b) return 0;
    if (sortBy === 'Name') {
      return (a.name || '').localeCompare(b.name || '');
    } else {
      const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
      const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
      return dateB - dateA;
    }
  });

  return filtered;
}
