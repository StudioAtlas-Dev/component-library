import { IconType } from 'react-icons';
import { ReactNode } from 'react';

export interface ServiceCardData {
  icon: IconType;
  title: string;
  description: string;
  href?: string;
  children?: ReactNode;
}

export interface ServiceCardProps {
  icon: IconType;
  title: string;
  description: string;
  className?: string;
  popColor?: string;
  iconAnimation?: string;
  cardAnimation?: string;
  variant?: 'grid' | 'compact';
  href?: string;
  children?: ReactNode;
}

export const cardVariants = {
  grid: "relative flex flex-col h-full px-6 sm:px-8 xl:px-12 py-8 border border-neutral-200 dark:border-neutral-800 service-card",
  compact: "relative flex flex-col h-full p-4 border border-neutral-200 dark:border-neutral-800 service-card"
}; 