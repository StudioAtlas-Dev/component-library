import { IconType } from 'react-icons';

export interface ServiceCardData {
  icon: IconType;
  title: string;
  description: string;
}

export interface ServiceCardProps {
  icon: IconType;
  title: string;
  description: string;
  className?: string;
  popColor?: string;
  iconAnimation?: string;
  cardAnimation?: string;
  variant?: 'grid' | 'list' | 'compact';
}

export const cardVariants = {
  grid: "relative flex flex-col h-full px-6 sm:px-8 xl:px-12 py-8 border border-neutral-200 dark:border-neutral-800 service-card",
  list: "relative flex flex-row h-full p-6 border border-neutral-200 dark:border-neutral-800 service-card",
  compact: "relative flex flex-col h-full p-4 border border-neutral-200 dark:border-neutral-800 service-card"
}; 