'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { twMerge } from 'tailwind-merge';

interface SvgTraceBackgroundProps {
  /** The SVG path to trace. If not provided, uses a default wavy path */
  path?: string;
  /** Array of colors to use for the gradient. If only one color provided, uses solid color */
  colors?: string[];
  /** Class name for additional styling */
  className?: string;
  /** Reference to the element where the animation should complete, referenced via ref={targetRef} */
  targetSectionRef?: React.RefObject<HTMLElement>;
  /** Background color for the component */
  backgroundColor?: string;
  /** Pop color for visual elements */
  popColor?: string;
  children?: React.ReactNode;
}

export function SvgTraceBackgroundComponent({
  path = 'M 1 0 L 1 -36 L 19 -12 L 19 HEIGHT_80 L 1 HEIGHT_80_PLUS L 1 HEIGHT',
  colors = ['#D4BEE4', '#9B7EBD', '#6344F5'],
  className,
  targetSectionRef,
  children
}: SvgTraceBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [svgHeight, setSvgHeight] = React.useState(0);
  const [isReady, setIsReady] = React.useState(false);
  const animation = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      // If we have a target section, use its position to determine height
      if (targetSectionRef?.current) {
        const targetTop = targetSectionRef.current.offsetTop;
        const currentTop = contentRef.current.offsetTop;
        const height = targetTop - currentTop + targetSectionRef.current.offsetHeight;
        setSvgHeight(height);
        //console.log('SVG Height set to target section:', height);
      } else {
        // Otherwise use the content height as before
        const height = contentRef.current.offsetHeight;
        setSvgHeight(height);
        //console.log('SVG Height set to content:', height);
      }
    }
  }, [targetSectionRef]);

  useEffect(() => {
    if (!pathRef.current || !svgHeight) {
      //console.log('No path ref available or no height');
      return;
    }

    //console.log('Setting up animation...');
    
    // Calculate actual path with real height values
    const actualPath = path
      .replace('HEIGHT_80', String(svgHeight * 0.8))
      .replace('HEIGHT_80_PLUS', String(svgHeight * 0.8 + 24))
      .replace('HEIGHT', String(svgHeight));
      
    // Update the path with actual values
    pathRef.current.setAttribute('d', actualPath);
    
    // Get the total length of the path for the animation
    const pathLength = pathRef.current.getTotalLength();
    //console.log('Path length:', pathLength);

    // Set up initial state - fully hidden
    pathRef.current.style.strokeDasharray = `${pathLength}`;
    pathRef.current.style.strokeDashoffset = `${pathLength}`;

    // Create the animation
    animation.current = anime({
      targets: pathRef.current,
      strokeDashoffset: [pathLength, 0],
      duration: 100,
      easing: 'linear',
      autoplay: false
    });

    const handleScroll = () => {
      if (!ref.current || !animation.current) return;

      // Get the element's offset from the top of the page
      const elementOffset = ref.current.offsetTop;
      
      // Calculate scrollable height based on target section or content
      let scrollableHeight;
      if (targetSectionRef?.current) {
        const targetBottom = targetSectionRef.current.offsetTop + targetSectionRef.current.offsetHeight;
        scrollableHeight = targetBottom - elementOffset - window.innerHeight;
      } else {
        scrollableHeight = ref.current.offsetHeight - window.innerHeight;
      }

      // Get the current scroll position relative to the element
      const relativeScroll = window.scrollY - elementOffset;
      
      // Calculate scroll percentage
      const scrollPercent = Math.max(0, Math.min(100, 
        (relativeScroll / scrollableHeight) * 100
      ));
      
      // Seek the animation based on scroll percentage
      animation.current.seek((scrollPercent / 100) * animation.current.duration);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    // Initial call to set starting position
    handleScroll();

    // Mark as ready after everything is set up
    setIsReady(true);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animation.current) {
        animation.current.pause();
      }
      setIsReady(false);
    };
  }, [path, svgHeight, targetSectionRef]);

  const gradientId = React.useId();

  // Calculate initial path for background (non-animated) path
  const backgroundPath = path
    .replace('HEIGHT_80', String(svgHeight * 0.8))
    .replace('HEIGHT_80_PLUS', String(svgHeight * 0.8 + 24))
    .replace('HEIGHT', String(svgHeight));

  return (
    <div
      ref={ref}
      className={twMerge('relative w-full max-w-4xl mx-auto h-full', className)}
      role="region"
      aria-label="Content with animated trace line"
    >
      <div 
        className={twMerge(
          "absolute -left-4 md:-left-20 top-3 transition-opacity duration-300",
          !isReady && "opacity-0"
        )}
        aria-hidden="true"
      >
        <div className="ml-[27px] h-4 w-4 rounded-full border border-neutral-200 shadow-sm flex items-center justify-center">
          <div className="h-2 w-2 rounded-full border border-neutral-300 bg-white" />
        </div>
        <svg
          viewBox={`0 0 20 ${svgHeight || 100}`}
          width="20"
          height={svgHeight || 100}
          className="ml-4 block"
          aria-hidden="true"
          preserveAspectRatio="none"
          role="presentation"
        >
          {/* Background (grey) path */}
          <path
            d={backgroundPath}
            fill="none"
            stroke="#9091A0"
            strokeOpacity="0.16"
            strokeWidth="1.25"
          />
          {/* Animated (colored) path */}
          <path
            ref={pathRef}
            d={backgroundPath}
            fill="none"
            stroke={colors.length === 1 ? colors[0] : `url(#${gradientId})`}
            strokeWidth="1.25"
            className="motion-reduce:hidden"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            {colors.length > 1 && (
              <linearGradient
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                x1="0"
                x2="0"
                y1="0"
                y2={svgHeight}
              >
                {colors.map((color, index) => (
                  <stop
                    key={color}
                    offset={index / (colors.length - 1)}
                    stopColor={color}
                    stopOpacity={1}
                  />
                ))}
              </linearGradient>
            )}
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </div>
  );
} 