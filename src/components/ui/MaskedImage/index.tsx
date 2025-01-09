import { MaskedImageProps, SingleCornerDirection } from './types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PathResult {
  path: string;
  transform?: string;
}

type SimplePathResult = string;

type GetBasePathResult = SimplePathResult | PathResult;

export const MaskedImage = ({
  variant,
  cornerDirection = '',
  color,
  src,
  alt,
  className = '',
  imageClassName = '',
  width = 300,
  rounded = 'none'
}: MaskedImageProps) => {
  const corners = cornerDirection ? cornerDirection.split(' ') as SingleCornerDirection[] : [];
  const maskId = `mask-${variant}${corners.length ? '-' + corners.join('-') : ''}`;
  
  // Map rounded size to Tailwind classes
  const roundedClasses = {
    'none': '',
    'sm': 'rounded-sm',
    'md': 'rounded',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    'full': 'rounded-full'
  };

  const containerClasses = cn(
    'relative block',
    corners.length > 0 ? roundedClasses[rounded] : '',
    'overflow-hidden',
    className
  );

  const getBasePath = (): GetBasePathResult => {
    if (variant === 'circle') {
      const radius = width / 2;
      const cx = width / 2;
      const cy = width / 2;
      return `M${cx} ${cy} m-${radius} 0 a${radius} ${radius} 0 1 0 ${radius*2} 0 a${radius} ${radius} 0 1 0 -${radius*2} 0`;
    } else {
      // Oval variant - taller than wide
      const containerHeight = Math.round(width * 1.5);
      const radius = width / 2;
      return `
        M0 ${radius}
        A${radius} ${radius} 0 0 1 ${radius} 0
        H${width - radius}
        A${radius} ${radius} 0 0 1 ${width} ${radius}
        V${containerHeight - radius}
        A${radius} ${radius} 0 0 1 ${width - radius} ${containerHeight}
        H${radius}
        A${radius} ${radius} 0 0 1 0 ${containerHeight - radius}
        Z
      `.trim().replace(/\s+/g, ' ');
    }
  };

  const getCornerPath = (corner: SingleCornerDirection): string => {
    const quadrantWidth = width / 2;
    const containerHeight = variant === 'oval' ? Math.round(width * 1.5) : width;
    const quadrantHeight = containerHeight / 2;
    
    switch (corner) {
      case 'top-left':
        return `M0 0h${quadrantWidth}v${quadrantHeight}H0z`;
      case 'top-right':
        return `M${quadrantWidth} 0h${quadrantWidth}v${quadrantHeight}h-${quadrantWidth}z`;
      case 'bottom-left':
        return `M0 ${quadrantHeight}h${quadrantWidth}v${quadrantHeight}H0z`;
      case 'bottom-right':
        return `M${quadrantWidth} ${quadrantHeight}h${quadrantWidth}v${quadrantHeight}h-${quadrantWidth}z`;
      default:
        return '';
    }
  };

  const getAllCornerPaths = (): string => {
    if (corners.length === 0) return '';
    return corners.map(corner => getCornerPath(corner)).join(' ');
  };

  const basePath = getBasePath();
  const isComplexPath = (path: GetBasePathResult): path is PathResult => {
    return typeof path !== 'string';
  };

  return (
    <div 
      className={containerClasses}
      style={{ 
        width: `${width}px`,
        height: variant === 'oval' ? `${Math.round(width * 1.5)}px` : `${width}px`
      }}
    >
      <svg
        width={width}
        height={variant === 'oval' ? Math.round(width * 1.5) : width}
        viewBox={`0 0 ${width} ${variant === 'oval' ? Math.round(width * 1.5) : width}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <mask id={maskId}>
            <rect 
              width={width} 
              height={variant === 'oval' ? Math.round(width * 1.5) : width} 
              fill="black" 
            />
            <path d={isComplexPath(basePath) ? basePath.path : basePath} fill="white" />
            {corners.length > 0 && <path d={getAllCornerPaths()} fill="white" />}
          </mask>
        </defs>
        <rect 
          width={width} 
          height={variant === 'oval' ? Math.round(width * 1.5) : width} 
          fill={color} 
          mask={`url(#${maskId})`}
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          width: `${width}px`,
          height: variant === 'oval' ? `${Math.round(width * 1.5)}px` : `${width}px`,
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`
        }}
        className="flex justify-center"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={cn('object-cover', imageClassName)}
          priority
        />
      </div>
    </div>
  );
}; 