import { MaskedImageProps, SingleCornerDirection } from './types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type PathResult = string | {
  path: string;
  transform: string;
};

export const MaskedImage = ({
  variant,
  cornerDirection = '',
  color,
  src,
  alt,
  className = '',
  imageClassName = '',
  width = 300,
  responsive = true
}: MaskedImageProps) => {
  const corners = cornerDirection ? cornerDirection.split(' ') as SingleCornerDirection[] : [];
  const maskId = `mask-${variant}${corners.length ? '-' + corners.join('-') : ''}`;
  
  // For porthole, we want a square container to allow for rotation
  const containerWidth = width;
  const containerHeight = variant === 'porthole' ? width : (
    variant === 'oval' ? Math.round(width * 1.5) : width
  );
  
  // The actual oval dimensions
  const shapeWidth = width;
  const shapeHeight = variant === 'porthole' 
    ? Math.round(width * 0.6) // Flatter oval ratio
    : containerHeight;

  const getBasePath = (): PathResult => {
    if (variant === 'circle') {
      const radius = width / 2;
      const cx = width / 2;
      const cy = containerHeight / 2;
      return `M${cx} ${cy} m-${radius} 0 a${radius} ${radius} 0 1 0 ${radius*2} 0 a${radius} ${radius} 0 1 0 -${radius*2} 0`;
    } else if (variant === 'porthole') {
      const cx = shapeWidth / 2;
      const cy = shapeHeight / 2;
      
      // Center the shape in the container for rotation
      const translateX = (containerWidth - shapeWidth) / 2;
      const translateY = (containerHeight - shapeHeight) / 2;
      
      return {
        transform: `translate(${translateX} ${translateY}) rotate(-20 ${cx} ${cy})`,
        path: `
          M${cx} ${shapeHeight}
          C${shapeWidth * 0.15} ${shapeHeight}
          0 ${shapeHeight * 0.7}
          0 ${shapeHeight / 2}
          0 ${shapeHeight * 0.3}
          ${shapeWidth * 0.15} 0
          ${cx} 0
          ${shapeWidth * 0.85} 0
          ${shapeWidth} ${shapeHeight * 0.3}
          ${shapeWidth} ${shapeHeight / 2}
          ${shapeWidth} ${shapeHeight * 0.7}
          ${shapeWidth * 0.85} ${shapeHeight}
          ${cx} ${shapeHeight}
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

  const getCornerPath = (corner: SingleCornerDirection) => {
    // Skip corners for porthole variant
    if (variant === 'porthole') return '';
    
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
    }
  };

  const getAllCornerPaths = () => {
    if (corners.length === 0 || variant === 'porthole') return '';
    return corners.map(corner => getCornerPath(corner)).join(' ');
  };

  const containerClasses = cn('relative block', className);
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
            {typeof basePath === 'string' ? (
              <path d={basePath} fill="white" />
            ) : (
              <path d={basePath.path} transform={basePath.transform} fill="white" />
            )}
            {corners.length > 0 && <path d={getAllCornerPaths()} fill="white" />}
          </mask>
        </defs>
        <rect 
          width={containerWidth} 
          height={containerHeight} 
          fill={color} 
          mask={`url(#${maskId})`}
        />
      </svg>

      <div 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`(max-width: 640px) 100vw, ${width}px`}
          className={cn('object-cover', imageClassName)}
          priority
        />
      </div>
    </div>
  );
}; 