export type MaskedImageVariant = 'circle' | 'oval';
export type CornerDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | '';

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