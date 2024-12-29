import { MaskedImageProps, SingleCornerDirection } from './types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PathResult {
  path: string;
  transform?: string;
  topPath?: string;
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
  responsive = true,
  rounded = 'none'
}: MaskedImageProps) => {
  const corners = cornerDirection ? cornerDirection.split(' ') as SingleCornerDirection[] : [];
  const maskId = `mask-${variant}${corners.length ? '-' + corners.join('-') : ''}`;
  
  const isPorthole = variant === 'porthole-left' || variant === 'porthole-right';
  const rotation = variant === 'porthole-right' ? -10 : 10;
  
  // For porthole, adjust container to better fit the oval
  const containerWidth = isPorthole ? width * 1.3 : width;
  const containerHeight = isPorthole ? width : (
    variant === 'oval' ? Math.round(width * 1.5) : width
  );
  
  // The actual oval dimensions
  const shapeWidth = width;
  const shapeHeight = isPorthole
    ? Math.round(width * 0.6) // Flatter oval ratio
    : containerHeight;

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
      const cy = containerHeight / 2;
      return `M${cx} ${cy} m-${radius} 0 a${radius} ${radius} 0 1 0 ${radius*2} 0 a${radius} ${radius} 0 1 0 -${radius*2} 0`;
    } else if (isPorthole) {
      const ovalWidth = shapeWidth * 1.3;
      const cx = ovalWidth / 2;
      const cy = shapeHeight / 2;
      
      // Center the shape horizontally and align to bottom
      const translateX = (containerWidth - ovalWidth) / 2;
      const translateY = containerHeight - shapeHeight - 20;
      
      return {
        transform: `translate(${translateX} ${translateY}) rotate(${rotation} ${cx} ${cy})`,
        path: `
          M${cx} ${shapeHeight}
          C${ovalWidth * 0.15} ${shapeHeight}
          0 ${shapeHeight * 0.7}
          0 ${shapeHeight / 2}
          0 ${shapeHeight * 0.3}
          ${ovalWidth * 0.15} 0
          ${cx} 0
          ${ovalWidth * 0.85} 0
          ${ovalWidth} ${shapeHeight * 0.3}
          ${ovalWidth} ${shapeHeight / 2}
          ${ovalWidth} ${shapeHeight * 0.7}
          ${ovalWidth * 0.85} ${shapeHeight}
          ${cx} ${shapeHeight}
          Z
        `.trim().replace(/\s+/g, ' '),
        topPath: `
          M0 0
          h${containerWidth}
          v${translateY + shapeHeight/2}
          h-${containerWidth}
          Z
        `.trim().replace(/\s+/g, ' ')
      };
    } else {
      const radius = width / 2;
      
      // Original oval path
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
    // Skip corners for porthole variant
    if (isPorthole) return '';
    
    const quadrantWidth = width / 2;
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
    if (corners.length === 0 || isPorthole) return '';
    return corners.map(corner => getCornerPath(corner)).join(' ');
  };

  const isComplexPath = (path: GetBasePathResult): path is PathResult => {
    return typeof path !== 'string';
  };

  const basePath = getBasePath();

  return (
    <div 
      className={containerClasses}
      style={{ 
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        maxWidth: responsive ? '100%' : undefined
      }}
    >
      <svg 
        width={containerWidth}
        height={containerHeight}
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <mask id={maskId}>
            <rect width={containerWidth} height={containerHeight} fill="black" />
            {isPorthole && isComplexPath(basePath) ? (
              <>
                {basePath.topPath && <path d={basePath.topPath} fill="white" />}
                <path d={basePath.path} transform={basePath.transform} fill="white" />
              </>
            ) : (
              <>
                <path d={isComplexPath(basePath) ? basePath.path : basePath} fill="white" />
                {!isPorthole && corners.length > 0 && <path d={getAllCornerPaths()} fill="white" />}
              </>
            )}
          </mask>
        </defs>
        {isPorthole && isComplexPath(basePath) ? (
          <path 
            d={basePath.path} 
            transform={basePath.transform} 
            fill={color} 
          />
        ) : (
          <rect 
            width={containerWidth} 
            height={containerHeight} 
            fill={color} 
            mask={`url(#${maskId})`}
          />
        )}
      </svg>

      <div 
        style={{ 
          position: 'absolute',
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`
        }}
        className="flex justify-center"
      >
        {isPorthole ? (
          <div className="relative" style={{
            width: `${width * 0.75}px`,
            height: '100%'
          }}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes={`(max-width: 640px) 100vw, ${width}px`}
              className={cn('object-cover', imageClassName)}
              priority
            />
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={`(max-width: 640px) 100vw, ${width}px`}
            className={cn('object-cover', imageClassName)}
            priority
          />
        )}
      </div>
    </div>
  );
}; 