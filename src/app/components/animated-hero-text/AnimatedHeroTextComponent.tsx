'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { twMerge } from 'tailwind-merge';

interface AnimatedHeroTextProps {
  words: string[];
  duration?: number;
  className?: string;
  animationType?: 'blur-away' | 'falling-letters';
}

export default function AnimatedHeroTextComponent({
  words,
  duration = 2000,
  className,
  animationType = 'blur-away'
}: AnimatedHeroTextProps) {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextWordRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    setIsClient(true);
    // Calculate the maximum width needed for any word
    if (containerRef.current) {
      const tempDiv = document.createElement('div');
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.position = 'absolute';
      tempDiv.style.whiteSpace = 'nowrap';
      document.body.appendChild(tempDiv);

      const maxWidth = Math.max(...words.map(word => {
        tempDiv.textContent = word;
        return tempDiv.offsetWidth;
      }));

      document.body.removeChild(tempDiv);
      setContainerWidth(maxWidth);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [words]);

  const createLetterSpans = (word: string) => {
    return word.split('').map((letter, i) => (
      <span key={i} className="inline-block opacity-100">{letter}</span>
    ));
  };

  const animateTransition = useCallback(() => {
    if (!containerRef.current || !nextWordRef.current || isAnimating) return;

    setIsAnimating(true);
    const nextWord = words[words.indexOf(currentWord) + 1] || words[0];
    
    if (animationType === 'falling-letters') {
      // Set up next word with letter spans
      nextWordRef.current.innerHTML = '';
      const letterElements = createLetterSpans(nextWord);
      letterElements.forEach(letterElement => {
        const spanNode = document.createElement('span');
        spanNode.className = 'inline-block whitespace-nowrap';
        spanNode.textContent = letterElement.props.children;
        nextWordRef.current?.appendChild(spanNode);
      });

      const timeline = anime.timeline({
        easing: 'easeInOutSine',
        complete: () => {
          setCurrentWord(nextWord);
          setIsAnimating(false);
        }
      });

      const currentElement = containerRef.current?.firstElementChild;
      if (currentElement?.children) {
        timeline
          .add({
            targets: currentElement.children,
            opacity: [1, 0],
            duration: 200,
            easing: 'easeInQuad'
          })
          .add({
            targets: nextWordRef.current.children,
            opacity: [0, 1],
            translateY: [-50, 0],
            duration: 750,
            delay: anime.stagger(100),
            easing: 'easeOutBounce'
          }, '-=100');
      }
    } else {
      nextWordRef.current.textContent = nextWord;
      nextWordRef.current.style.opacity = '0';
      nextWordRef.current.style.filter = 'blur(8px)';

      const timeline = anime.timeline({
        easing: 'easeInOutSine',
        complete: () => {
          setCurrentWord(nextWord);
          setIsAnimating(false);
        }
      });

      timeline
        .add({
          targets: containerRef.current.firstElementChild,
          opacity: [1, 0],
          translateY: [0, -40],
          translateX: [0, 40],
          scale: [1, 2],
          filter: ['blur(0px)', 'blur(8px)'],
          duration: 600
        })
        .add({
          targets: nextWordRef.current,
          opacity: [0, 1],
          filter: ['blur(8px)', 'blur(0px)'],
          duration: 400
        }, '-=200');
    }
  }, [currentWord, words, isAnimating, animationType]);

  useEffect(() => {
    if (!isAnimating && isClient) {
      timeoutRef.current = setTimeout(animateTransition, duration);
    }
  }, [isAnimating, duration, animateTransition, isClient]);

  if (!isClient) {
    return (
      <span className={twMerge(
        "inline-block text-neutral-900 dark:text-neutral-100 px-2",
        className
      )}>
        {words[0]}
      </span>
    );
  }

  const containerStyle = {
    width: containerWidth ? `${containerWidth}px` : 'auto',
    minWidth: 'min-content'
  };

  return (
    <div className={twMerge(
      "inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2",
      className
    )} style={containerStyle}>
      <div ref={containerRef} className="relative whitespace-nowrap">
        <div className="inline-block opacity-100 whitespace-nowrap">
          {animationType === 'falling-letters' ? createLetterSpans(currentWord) : currentWord}
        </div>
        <div 
          ref={nextWordRef}
          className="absolute top-0 left-0 inline-block whitespace-nowrap"
        />
      </div>
    </div>
  );
} 