import { ComponentMeta } from '@/types/component';

interface ComponentsResponse {
  components: ComponentMeta[];
  warnings?: string[];
  error?: string;
  details?: string | string[];
}

export async function getComponents(): Promise<ComponentMeta[]> {
  try {
    const response = await fetch('/api/components');
    const data: ComponentsResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch components');
    }

    if (data.warnings?.length) {
      // Log warnings but don't fail
      console.warn('Component loading warnings:', data.warnings);
    }

    return data.components || [];
  } catch (error) {
    console.error('Failed to fetch components:', error);
    throw error;
  }
}

export function filterComponents(
  components: ComponentMeta[],
  search: string,
  selectedType: string,
  sortBy: 'Name' | 'Date Added' = 'Name'
): ComponentMeta[] {
  if (!components?.length) return [];
  
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
      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();
      return dateB - dateA;
    }
  });

  return filtered;
}
