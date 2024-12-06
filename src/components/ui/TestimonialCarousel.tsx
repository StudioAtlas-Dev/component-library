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

  const getCardWidth = (containerWidth: number) => {
    if (containerWidth >= 1024) return 600;
    if (containerWidth >= 640) return 500;
    return 300;
  };

  const getCardPosition = (index: number, containerWidth: number) => {
    const cardWidth = getCardWidth(containerWidth);
    const gap = containerWidth >= 640 ? 32 : 16;
    const centerPosition = (containerWidth - cardWidth) / 2;
    const visibleAmount = containerWidth >= 640 ? cardWidth / 3 : 8;
    
    if (index === activeIndex) {
      return centerPosition;
    }
    if (index === (activeIndex - 1 + testimonials.length) % testimonials.length) {
      return -cardWidth + visibleAmount;
    }
    if (index === (activeIndex + 1) % testimonials.length) {
      return containerWidth - visibleAmount;
    }
    
    return index < activeIndex ? -cardWidth - gap : containerWidth + gap;
  };

  const positionCards = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      const xPos = getCardPosition(index, containerWidth);
      
      anime.set(card, {
        translateX: xPos,
        opacity: index === activeIndex ? 1 : 0.5
      });
    });
  };

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
    
    const timeline = anime.timeline({
      easing: 'easeInOutQuad',
      duration: 1000,
      complete: () => {
        setActiveIndex(nextActiveIndex);
        setNextActiveIndex(null);
        setIsMoving(false);
        isAnimatingRef.current = false;
      }
    });

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      
      const willBeActive = index === nextActiveIndex;
      const willBeNext = index === (nextActiveIndex + 1) % testimonials.length;
      const willBePrevious = index === (nextActiveIndex - 1 + testimonials.length) % testimonials.length;
      
      let targetX;
      if (willBeActive) {
        targetX = (containerWidth - cardWidth) / 2;
      } else if (willBeNext) {
        targetX = containerWidth - visibleAmount;
      } else if (willBePrevious) {
        targetX = -cardWidth + visibleAmount;
      } else {
        targetX = index < nextActiveIndex ? -cardWidth - gap : containerWidth + gap;
      }

      timeline.add({
        targets: card,
        translateX: targetX,
        opacity: willBeActive ? 1 : 0.5
      }, 0);
    });
  };

  useEffect(() => {
    positionCards();
    
    const interval = setInterval(animateToNextSlide, 5000);
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
      <div ref={containerRef} className="relative w-[90%] max-w-[1400px] h-[400px] sm:h-[450px] mx-auto">
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
              ref={el => cardsRef.current[index] = el}
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
