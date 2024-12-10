'use client'

import { useEffect, useRef } from 'react';
import anime from 'animejs';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const CustomInput = ({ className = '', ...props }: CustomInputProps) => {
  const inputRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!inputRef.current) return;
    
    const borderElement = inputRef.current.querySelector('.border-line');
    
    const drawBorder = (direction: 'normal' | 'reverse' = 'normal') => {
      anime({
        targets: borderElement,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1000,
        direction,
        begin: () => {
          if (borderElement instanceof SVGElement) {
            borderElement.style.display = 'block';
          }
        },
        complete: () => {
          if (direction === 'reverse' && borderElement instanceof SVGElement) {
            borderElement.style.display = 'none';
          }
        }
      });
    };

    const input = inputRef.current.querySelector('input');
    
    const handleFocus = () => drawBorder('normal');
    const handleBlur = () => drawBorder('reverse');
    
    input?.addEventListener('focus', handleFocus);
    input?.addEventListener('blur', handleBlur);
    
    return () => {
      input?.removeEventListener('focus', handleFocus);
      input?.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <div ref={inputRef} className="relative">
      <input
        {...props}
        className={`w-full outline-none ${className}`}
      />
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%"
        height="100%"
      >
        <rect
          className="border-line"
          width="100%"
          height="100%"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ display: 'none' }}
        />
      </svg>
    </div>
  );
}; 