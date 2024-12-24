import anime from 'animejs';
import { AnimationConfig } from './types';

/**
 * Creates a border thickening animation that expands inward
 * Uses the parent grid's border color
 */
export const thickenBorder: AnimationConfig = {
  enter: (borderElement: HTMLElement) => {
    // Get the parent grid's border color
    const parentGrid = borderElement.closest('[role="region"]');
    const dividerColor = parentGrid 
      ? window.getComputedStyle(parentGrid.querySelector('.border-neutral-200') || parentGrid).borderColor
      : '#e5e7eb'; // Tailwind's neutral-200 as fallback
    
    return anime({
      targets: borderElement,
      borderWidth: [0, 3],
      duration: 100,
      easing: 'easeOutQuad',
      begin: () => {
        borderElement.style.borderColor = dividerColor;
      }
    });
  },
  
  leave: (borderElement: HTMLElement) => {
    return anime({
      targets: borderElement,
      borderWidth: [3, 0],
      duration: 100,
      easing: 'easeInQuad',
      complete: () => {
        borderElement.style.borderWidth = '0px';
      }
    });
  }
}; 