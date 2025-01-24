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
      // Using a more precise circle definition with cubic Bézier curves
      const radius = width / 2;
      const c = radius * 0.552284749831; // Magic number for perfect circle approximation
      const center = width / 2;
      
      return `
        M${center} 0
        C${center + c} 0 ${width} ${center - c} ${width} ${center}
        C${width} ${center + c} ${center + c} ${width} ${center} ${width}
        C${center - c} ${width} 0 ${center + c} 0 ${center}
        C0 ${center - c} ${center - c} 0 ${center} 0
        Z
      `.trim().replace(/\s+/g, ' ');
    } else {
      // Oval variant with 2:1 aspect ratio
      const containerHeight = width * 2;
      const radiusX = width / 2;
      const radiusY = radiusX;
      const c = radiusX * 0.552284749831;
      const centerX = width / 2;
      
      return `
        M${centerX} 0
        C${centerX + c} 0 ${width} ${radiusY - c} ${width} ${radiusY}
        L${width} ${containerHeight - radiusY}
        C${width} ${containerHeight - radiusY + c} ${centerX + c} ${containerHeight} ${centerX} ${containerHeight}
        C${centerX - c} ${containerHeight} 0 ${containerHeight - radiusY + c} 0 ${containerHeight - radiusY}
        L0 ${radiusY}
        C0 ${radiusY - c} ${centerX - c} 0 ${centerX} 0
        Z
      `.trim().replace(/\s+/g, ' ');
    }
  };

  const getCornerPath = (corner: SingleCornerDirection): string => {
    const quadrantWidth = width / 2;
    const containerHeight = variant === 'oval' ? width * 2 : width;
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
        height: variant === 'oval' ? `${width * 2}px` : `${width}px`
      }}
    >
      <svg
        width={width}
        height={variant === 'oval' ? width * 2 : width}
        viewBox={`0 0 ${width} ${variant === 'oval' ? width * 2 : width}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <mask id={maskId}>
            <rect 
              width={width} 
              height={variant === 'oval' ? width * 2 : width} 
              fill="black" 
            />
            <path d={isComplexPath(basePath) ? basePath.path : basePath} fill="white" />
            {corners.length > 0 && <path d={getAllCornerPaths()} fill="white" />}
          </mask>
        </defs>
        <rect 
          width={width} 
          height={variant === 'oval' ? width * 2 : width} 
          fill={color} 
          mask={`url(#${maskId})`}
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          width: `${width}px`,
          height: variant === 'oval' ? `${width * 2}px` : `${width}px`,
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`
        }}
        className="flex items-end justify-center"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={cn('object-cover object-bottom', imageClassName)}
          priority
        />
      </div>
    </div>
  );
}; 