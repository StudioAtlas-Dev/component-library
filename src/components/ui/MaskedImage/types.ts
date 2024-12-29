export type SingleCornerDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type CornerDirection = SingleCornerDirection | '' | `${SingleCornerDirection} ${SingleCornerDirection}` | `${SingleCornerDirection} ${SingleCornerDirection} ${SingleCornerDirection}` | `${SingleCornerDirection} ${SingleCornerDirection} ${SingleCornerDirection} ${SingleCornerDirection}`;

export type MaskedImageVariant = 'circle' | 'oval' | 'porthole-left' | 'porthole-right';

export type RoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

export interface MaskedImageProps {
  variant: MaskedImageVariant;
  cornerDirection?: CornerDirection;
  color: string;
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  width?: number;
  responsive?: boolean;
  rounded?: RoundedSize;
} 