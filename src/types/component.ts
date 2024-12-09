// Define specific component types for better type safety
export type ComponentType = 
  | 'Section Component'
  | 'Hero'
  | 'Card'
  | 'Navigation'
  | 'Footer'
  | 'Form'
  | 'Feature'
  | 'Testimonial'
  | 'Gallery'
  | 'Contact';

// Define common tag types that can be used across components
export type ComponentTag = 
  | 'layout'
  | 'hero'
  | 'light'
  | 'dark'
  | 'branded'
  | 'features'
  | 'services'
  | 'grid'
  | 'animation'
  | 'testimonials'
  | 'fitness'
  | 'hiring'
  | string; // Allow custom tags while suggesting common ones

export interface ComponentMeta {
  /** Display name of the component */
  name: string;
  /** Type of the component for categorization */
  type: ComponentType;
  /** ISO date string of when the component was added */
  dateAdded: string;
  /** Path to the component directory */
  path: string;
  /** Brief description of the component's purpose and features */
  description?: string;
  /** Array of tags for filtering and categorization */
  tags?: ComponentTag[];
}

export type SortOption = 'Date Added' | 'Name';
