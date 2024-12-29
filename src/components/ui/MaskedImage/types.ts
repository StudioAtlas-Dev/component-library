export type MaskedImageVariant = 'circle' | 'oval' | 'porthole';
export type SingleCornerDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type CornerDirection = SingleCornerDirection | '' | `${SingleCornerDirection} ${SingleCornerDirection}` | `${SingleCornerDirection} ${SingleCornerDirection} ${SingleCornerDirection}` | `${SingleCornerDirection} ${SingleCornerDirection} ${SingleCornerDirection} ${SingleCornerDirection}`;

export interface MaskedImageProps {
  variant: MaskedImageVariant;
  cornerDirection?: CornerDirection;
  color: string;
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  /** Width in pixels */
  width?: number;
  /** Whether the image should scale responsively. Defaults to true */
  responsive?: boolean;
} 