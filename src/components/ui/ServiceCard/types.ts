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
  darkColor?: string;
  activeDarkColor?: string;
  iconAnimation?: string;
  cardAnimation?: string;
  variant?: 'grid' | 'compact' | 'floating';
  href?: string;
  children?: ReactNode;
}

export const cardVariants = {
  grid: "relative flex flex-col h-full px-6 sm:px-8 xl:px-12 py-8",
  compact: "relative flex flex-col h-full p-4",
  floating: "relative flex flex-col h-full px-8 pt-12 pb-14 bg-[#f7f7f7] dark:bg-neutral-800 rounded-lg min-h-[250px]"
}; 