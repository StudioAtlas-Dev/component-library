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
      ? window.getComputedStyle(parentGrid.querySelector('.divide-x') || parentGrid).borderColor
      : 'rgb(229, 231, 235)'; // Tailwind's neutral-200 as fallback
    
    // Set initial border color to prevent flash
    borderElement.style.borderColor = dividerColor;
    
    return anime({
      targets: borderElement,
      borderWidth: [0, 3],
      duration: 100,
      easing: 'easeOutQuad'
    });
  },
  
  leave: (borderElement: HTMLElement) => {
    // Get the parent grid's border color
    const parentGrid = borderElement.closest('[role="region"]');
    const dividerColor = parentGrid 
      ? window.getComputedStyle(parentGrid.querySelector('.divide-x') || parentGrid).borderColor
      : 'rgb(229, 231, 235)'; // Tailwind's neutral-200 as fallback
    
    // Ensure border color is set
    borderElement.style.borderColor = dividerColor;
    
    const animation = anime({
      targets: borderElement,
      borderWidth: [3, 0],
      duration: 100,
      easing: 'easeInQuad',
      complete: () => {
        // Ensure border is completely removed after animation
        borderElement.style.borderWidth = '0px';
      }
    });

    return animation;
  }
}; 