'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { twMerge } from 'tailwind-merge';

interface AnimatedHeroTextProps {
  words: string[];
  duration?: number;
  className?: string;
  animationType?: 'blur-away' | 'falling-letters' | 'typing';
  wordLifespan?: number;
}

export default function AnimatedHeroTextComponent({
  words,
  duration = 2000,
  className,
  animationType = 'blur-away',
  wordLifespan = 1000,
}: AnimatedHeroTextProps) {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const blinkRef = useRef<anime.AnimeInstance | null>(null);

  // Helper function to calculate text width (with null safety)
  const calculateTextWidth = (element: HTMLElement | null, text: string): number => {
    if (!element) return 0;
    
    const tempDiv = document.createElement('div');
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.position = 'absolute';
    tempDiv.style.whiteSpace = 'nowrap';
    tempDiv.style.font = window.getComputedStyle(element).font;
    tempDiv.textContent = text;
    document.body.appendChild(tempDiv);
    const width = tempDiv.offsetWidth;
    document.body.removeChild(tempDiv);
    return width;
  };

  const createLetterSpans = (word: string) => {
    return word.split('').map((letter, i) => (
      <span key={i} className="inline-block opacity-100">{letter}</span>
    ));
  };

  // Refactored animateTyping function
  const animateTyping = useCallback((nextWord: string) => {
    if (!textRef.current || !containerRef.current) return;

    const currentWidth = calculateTextWidth(textRef.current, currentWord);
    const nextWidth = calculateTextWidth(textRef.current, nextWord);

    // Initialize text content if not set
    if (!textRef.current.textContent) {
      textRef.current.textContent = currentWord;
    }

    const timeline = anime.timeline({
      easing: 'easeInOutSine',
      complete: () => {
        setCurrentWord(nextWord);
        setIsAnimating(false);
      }
    });

    // Text animation
    timeline
      .add({
        targets: textRef.current,
        width: [currentWidth, 0],
        duration: duration / 2,
        easing: 'steps(30)',
        begin: () => {
          if (textRef.current) {
            textRef.current.textContent = currentWord;
          }
        }
      })
      .add({
        targets: textRef.current,
        width: [0, nextWidth],
        duration: duration / 2,
        easing: 'steps(30)',
        begin: () => {
          if (textRef.current) {
            textRef.current.textContent = nextWord;
          }
        }
      });

    // Cursor animation
    if (cursorRef.current) {
      timeline
        .add({
          targets: cursorRef.current,
          translateX: [currentWidth, 0],
          duration: duration / 2,
          easing: 'steps(30)'
        }, 0)
        .add({
          targets: cursorRef.current,
          translateX: [0, nextWidth],
          duration: duration / 2,
          easing: 'steps(30)'
        }, duration / 2);
    }
  }, [currentWord, duration]);

  const animateFallingLetters = useCallback((nextWord: string) => {
    if (!textRef.current) return;

    // Set up next word with letter spans
    textRef.current.innerHTML = '';
    const letterElements = createLetterSpans(nextWord);
    letterElements.forEach(letterElement => {
      const spanNode = document.createElement('span');
      spanNode.className = 'inline-block whitespace-nowrap';
      spanNode.textContent = letterElement.props.children;
      textRef.current?.appendChild(spanNode);
    });

    const timeline = anime.timeline({
      easing: 'easeInOutSine',
      complete: () => {
        setCurrentWord(nextWord);
        setIsAnimating(false);
      }
    });

    timeline
      .add({
        targets: textRef.current.children,
        opacity: [0, 1],
        translateY: [-50, 0],
        duration: duration * 0.75,
        delay: anime.stagger(100, { from: 'center' }),
        easing: 'easeOutBounce'
      });
  }, [duration]);

  const animateBlurAway = useCallback((nextWord: string) => {
    if (!textRef.current) return;

    const timeline = anime.timeline({
      easing: 'easeInOutSine',
      complete: () => {
        setCurrentWord(nextWord);
        setIsAnimating(false);
      }
    });

    timeline
      .add({
        targets: textRef.current,
        opacity: [1, 0],
        translateY: [0, -40],
        translateX: [0, 40],
        scale: [1, 2],
        filter: ['blur(0px)', 'blur(8px)'],
        duration: duration * 0.75,
        complete: () => {
          if (textRef.current) {
            textRef.current.textContent = nextWord;
            textRef.current.style.opacity = '0';
            textRef.current.style.filter = 'blur(0px)';
            textRef.current.style.transform = 'none';
          }
        }
      })
      .add({
        targets: textRef.current,
        opacity: [0, 1],
        duration: duration * 0.25,
      });
  }, [duration]);

  // Main animation trigger (simplified)
  const animateTransition = useCallback(() => {
    if (!containerRef.current || !textRef.current || isAnimating) return;

    setIsAnimating(true);
    const nextWord = words[words.indexOf(currentWord) + 1] || words[0];

    switch (animationType) {
      case 'typing':
        animateTyping(nextWord);
        break;
      case 'falling-letters':
        animateFallingLetters(nextWord);
        break;
      case 'blur-away':
        animateBlurAway(nextWord);
        break;
      default:
        break;
    }
  }, [animationType, animateTyping, animateFallingLetters, animateBlurAway, currentWord, words, isAnimating]);

  // Replace the cursor animation useEffect with CSS-based animation
  const cursorStyle = {
    width: '1px',
    left: 0,
    animation: 'blink 1s step-end infinite'
  };

  useEffect(() => {
    if (!isAnimating && words.length > 1) {
      const timer = setTimeout(() => {
        animateTransition();
      }, wordLifespan + duration);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, words, wordLifespan, duration, animateTransition]);

  // Initialize text content on mount
  useEffect(() => {
    if (textRef.current && !textRef.current.textContent) {
      textRef.current.textContent = currentWord;
    }
  }, [currentWord]);

  return (
    <div className={twMerge(
      "inline-block relative text-neutral-900 dark:text-neutral-100 px-2",
      className
    )}>
      <style jsx>{`
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      <div ref={containerRef} className="relative inline-flex items-center">
        <div
          ref={textRef}
          className="inline-block whitespace-nowrap overflow-hidden"
        >
          {currentWord}
        </div>
        {animationType === 'typing' && (
          <span
            ref={cursorRef}
            className="absolute top-0 h-full border border-neutral-500 bg-transparent dark:border-neutral-100"
            style={cursorStyle}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}