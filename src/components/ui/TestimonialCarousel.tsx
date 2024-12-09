'use client';

import { useEffect, useRef, useState } from 'react';
import TestimonialCard from './TestimonialCard';
import anime from 'animejs';

interface TestimonialData {
  quote: string;
  author: {
    name: string;
    title: string;
    image: string;
  };
}

interface TestimonialCarouselProps {
  testimonials: TestimonialData[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [nextActiveIndex, setNextActiveIndex] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimatingRef = useRef(false);

  // Determines card width based on container size for responsive design
  const getCardWidth = (containerWidth: number) => {
    if (containerWidth >= 1024) return 600; // Large screens
    if (containerWidth >= 640) return 500;  // Medium screens
    return 300;                             // Small screens
  };

  // Calculates the horizontal position for each card in the carousel
  const getCardPosition = (index: number, containerWidth: number) => {
    const cardWidth = getCardWidth(containerWidth);
    // Gap between cards - larger on desktop for better spacing
    const gap = containerWidth >= 640 ? 32 : 16;
    // Centers the active card by calculating offset from container edge
    const centerPosition = (containerWidth - cardWidth) / 2;
    // Amount of previous/next cards visible on screen edges
    const visibleAmount = containerWidth >= 640 ? cardWidth / 3 : 8;
    
    // Position logic for different card states:
    if (index === activeIndex) {
      return centerPosition;  // Active card is centered
    }
    if (index === (activeIndex - 1 + testimonials.length) % testimonials.length) {
      // Previous card peeks in from left edge
      return -cardWidth + visibleAmount;
    }
    if (index === (activeIndex + 1) % testimonials.length) {
      // Next card peeks in from right edge
      return containerWidth - visibleAmount;
    }
    
    // Off-screen cards are positioned beyond the viewport
    return index < activeIndex ? -cardWidth - gap : containerWidth + gap;
  };

  // Updates all card positions and opacities without animation
  const positionCards = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      const xPos = getCardPosition(index, containerWidth);
      
      // Active card is fully opaque, others are semi-transparent
      anime.set(card, {
        translateX: xPos,
        opacity: index === activeIndex ? 1 : 0.5
      });
    });
  };

  // Handles the animation sequence when transitioning to the next slide
  const animateToNextSlide = () => {
    if (!containerRef.current || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsMoving(true);

    const containerWidth = containerRef.current.offsetWidth;
    const cardWidth = getCardWidth(containerWidth);
    const gap = containerWidth >= 640 ? 32 : 16;
    const visibleAmount = containerWidth >= 640 ? cardWidth / 3 : 8;
    const nextActiveIndex = (activeIndex + 1) % testimonials.length;
    
    setNextActiveIndex(nextActiveIndex);
    
    // Creates a synchronized animation timeline for all cards
    const timeline = anime.timeline({
      easing: 'easeInOutQuad',
      duration: 1000,
      complete: () => {
        // Reset state after animation completes
        setActiveIndex(nextActiveIndex);
        setNextActiveIndex(null);
        setIsMoving(false);
        isAnimatingRef.current = false;
      }
    });

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      
      // Determine the future state of each card
      const willBeActive = index === nextActiveIndex;
      const willBeNext = index === (nextActiveIndex + 1) % testimonials.length;
      const willBePrevious = index === (nextActiveIndex - 1 + testimonials.length) % testimonials.length;
      
      // Calculate target position based on card's future state
      let targetX;
      if (willBeActive) {
        targetX = (containerWidth - cardWidth) / 2;  // Center
      } else if (willBeNext) {
        targetX = containerWidth - visibleAmount;    // Peek from right
      } else if (willBePrevious) {
        targetX = -cardWidth + visibleAmount;        // Peek from left
      } else {
        targetX = index < nextActiveIndex ? -cardWidth - gap : containerWidth + gap; // Off-screen
      }

      // Add card animation to the timeline
      timeline.add({
        targets: card,
        translateX: targetX,
        opacity: willBeActive ? 1 : 0.5
      }, 0); // 0 means all animations start simultaneously
    });
  };

  useEffect(() => {
    positionCards();
    
    const interval = setInterval(animateToNextSlide, 5000); // Transition every variable seconds
    return () => clearInterval(interval);
  }, [activeIndex, testimonials.length]);

  useEffect(() => {
    const handleResize = () => {
      positionCards();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  return (
    <div className="w-full overflow-hidden">
      <div ref={containerRef} className="relative w-[90%] max-w-[1400px] h-[400px] md:h-[450px] mx-auto">
        {testimonials.map((testimonial, index) => {
          let zIndex = 0;
          if (index === activeIndex) {
            zIndex = nextActiveIndex !== null ? 3 : 2;
          } else if (index === (activeIndex + 1) % testimonials.length) {
            zIndex = 1;
          }
          
          return (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="absolute"
              style={{ zIndex }}
            >
              <TestimonialCard
                quote={testimonial.quote}
                author={testimonial.author}
                isActive={index === activeIndex}
                willBeActive={nextActiveIndex !== null && index === nextActiveIndex}
                isMoving={isMoving}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
