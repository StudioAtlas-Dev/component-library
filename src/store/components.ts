import { ComponentMeta } from '@/types/component';

export function filterComponents(
  components: ComponentMeta[],
  search: string,
  selectedType: string,
  sortBy: 'Name' | 'Date Added' = 'Name'
): ComponentMeta[] {
  let filtered = [...components];

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
    if (sortBy === 'Name') {
      return a.name.localeCompare(b.name);
    } else {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
  });

  return filtered;
}
