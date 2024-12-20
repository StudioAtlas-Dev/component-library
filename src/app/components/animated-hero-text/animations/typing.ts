import anime from 'animejs';
import { type RefObject } from 'react';

interface TypingAnimationParams {
  textRef: RefObject<HTMLDivElement>;
  containerRef: RefObject<HTMLDivElement>;
  cursorRef: RefObject<HTMLSpanElement>;
  currentWord: string;
  nextWord: string;
  duration: number;
  onBegin?: () => void;
  onComplete?: () => void;
}

// Helper function to calculate text width
function calculateTextWidth(element: HTMLElement | null, text: string): number {
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
}

function animateTyping({
  textRef,
  containerRef,
  cursorRef,
  currentWord,
  nextWord,
  duration,
  onBegin,
  onComplete
}: TypingAnimationParams) {
  if (!textRef.current || !containerRef.current) return;

  const currentWidth = calculateTextWidth(textRef.current, currentWord);
  const nextWidth = calculateTextWidth(textRef.current, nextWord);

  // Initialize text content if not set
  if (!textRef.current.textContent) {
    textRef.current.textContent = currentWord;
  }

  const timeline = anime.timeline({
    easing: 'easeInOutSine',
    begin: () => {
      if (cursorRef.current) {
        cursorRef.current.style.animation = 'blink 0.75s step-end infinite';
      }
      onBegin?.();
    },
    complete: () => {
      onComplete?.();
    }
  });

  // Text animation
  timeline
    .add({
      targets: textRef.current,
      width: [currentWidth, 0],
      duration: duration * 0.5,
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
      duration: duration * 0.5,
      easing: 'steps(30)',
      begin: () => {
        if (textRef.current) {
          textRef.current.textContent = nextWord;
        }
      }
    });

  // Cursor animation
  if (cursorRef.current) {
    // Remove any existing animation before starting new one
    cursorRef.current.style.animation = 'none';
    
    timeline
      .add({
        targets: cursorRef.current,
        translateX: [currentWidth, 0],
        opacity: [1, 1],
        duration: duration * 0.5,
        easing: 'steps(30)',
        begin: () => {
          if (cursorRef.current) {
            cursorRef.current.style.opacity = '1';
          }
        }
      }, 0)
      .add({
        targets: cursorRef.current,
        translateX: [0, nextWidth],
        opacity: [1, 1],
        duration: duration * 0.5,
        easing: 'steps(30)'
      }, duration * 0.5);
  }
}

export { calculateTextWidth, animateTyping }; 