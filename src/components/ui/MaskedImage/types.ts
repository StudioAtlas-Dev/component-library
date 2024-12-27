export type MaskedImageVariant = 'circle' | 'oval';
export type CornerDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface MaskedImageProps {
  variant: MaskedImageVariant;
  cornerDirection: CornerDirection;
  color: string;
  src: string;
  alt: string;
  className?: string;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Whether the image should scale responsively. Defaults to true */
  responsive?: boolean;
} 