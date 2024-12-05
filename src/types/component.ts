export type ComponentType = 'Hero' | string;

export interface ComponentMeta {
  name: string;
  type: ComponentType;
  dateAdded: string;
  path: string;
  description?: string;
}

export type SortOption = 'Date Added' | 'Name';
