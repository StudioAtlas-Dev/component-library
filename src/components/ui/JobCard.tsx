'use client';

import React, { useRef, useState } from 'react';
import { MdLocationOn } from 'react-icons/md';
import { BiTimeFive } from 'react-icons/bi';
import { ProgressiveButton } from '@/components/ui/ProgressiveButton';
import anime from 'animejs';

interface JobCardProps {
  title: string;
  location: string;
  type: string;
  description: string;
  popColor: string;
}

export default function JobCard({
  title,
  location,
  type,
  description,
  popColor
}: JobCardProps) {
  const underlineRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  const animateUnderline = () => {
    if (underlineRef.current) {
      // Stop any existing animation
      if (animationRef.current) {
        animationRef.current.pause();
      }

      // Reset the transform origin to center
      const el = underlineRef.current;
      el.style.transformOrigin = 'center';
      el.style.transform = 'scaleX(0)';

      // Create new animation
      animationRef.current = anime({
        targets: underlineRef.current,
        scaleX: [0, 1],
        duration: 500,
        easing: 'easeInOutQuad',
        complete: () => {
          animationRef.current = null;
        }
      });
    }
    setIsHovered(true);
  };

  const resetUnderline = () => {
    if (underlineRef.current) {
      // Stop any existing animation
      if (animationRef.current) {
        animationRef.current.pause();
      }

      // Create new reset animation
      animationRef.current = anime({
        targets: underlineRef.current,
        scaleX: 0,
        duration: 300,
        easing: 'easeInOutQuad',
        complete: () => {
          animationRef.current = null;
        }
      });
    }
    setIsHovered(false);
  };

  return (
    <div 
      className="border rounded-lg p-6 transition-colors duration-200 group bg-white"
      onMouseEnter={animateUnderline}
      onMouseLeave={resetUnderline}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="relative inline-block">
            <h3 
              className="text-xl font-semibold mb-0 transition-colors duration-200"
              style={{ 
                color: isHovered ? popColor : 'inherit'
              }}
            >
              {title}
            </h3>
            <div
              ref={underlineRef}
              className="absolute bottom-0 left-0 w-full h-[2px]"
              style={{ 
                backgroundColor: popColor,
                transform: 'scaleX(0)',
                transformOrigin: 'center'
              }}
            />
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <MdLocationOn style={{ color: popColor }} />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <BiTimeFive style={{ color: popColor }} />
              <span>{type}</span>
            </div>
          </div>
          <p className="mt-3 text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <ProgressiveButton
            className="w-full sm:w-auto"
            size="grid"
            href="#"
            hoverEffect="slide"
            style={{ backgroundColor: popColor }}
          >
            Apply Now
          </ProgressiveButton>
        </div>
      </div>
    </div>
  );
}
