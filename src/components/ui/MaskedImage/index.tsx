'use client';

import { MaskedImageProps } from './types';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export const MaskedImage = ({
  variant,
  cornerDirection,
  color,
  src,
  alt,
  className = '',
  width,
  height,
  responsive = true
}: MaskedImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width, height });
  const maskId = `mask-${variant}-${cornerDirection}`;

  useEffect(() => {
    if (!containerRef.current || !responsive) return;

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [responsive]);

  const getBasePath = () => {
    const { width: w, height: h } = containerSize;
    if (variant === 'circle') {
      const radius = Math.min(w, h) / 2;
      const cx = w / 2;
      const cy = h / 2;
      return `M${cx} ${cy} m-${radius} 0 a${radius} ${radius} 0 1 0 ${radius*2} 0 a${radius} ${radius} 0 1 0 -${radius*2} 0`;
    } else {
      // Oval shape
      const rx = w / 2;
      const ry = h / 2;
      const cx = w / 2;
      const cy = h / 2;
      return `M${cx} ${cy} m-${rx} 0 a${rx} ${ry} 0 1 0 ${rx*2} 0 a${rx} ${ry} 0 1 0 -${rx*2} 0`;
    }
  };

  const getCornerPath = () => {
    const { width: w, height: h } = containerSize;
    const quadrantWidth = w / 2;
    const quadrantHeight = h / 2;
    
    switch (cornerDirection) {
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

  const containerClasses = [
    'relative',
    responsive ? 'w-full max-w-[300px]' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
      >
        <defs>
          <mask id={maskId}>
            <rect width={containerSize.width} height={containerSize.height} fill="black" />
            <path d={getBasePath()} fill="white" />
            <path d={getCornerPath()} fill="white" />
          </mask>
        </defs>
      </svg>

      {/* Background color and image with mask */}
      <div 
        className="absolute inset-0"
        style={{ mask: `url(#${maskId})` }}
      >
        {/* Background color */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: color }}
        />
        {/* Image */}
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, 300px"
          className="object-cover"
        />
      </div>
    </div>
  );
}; 