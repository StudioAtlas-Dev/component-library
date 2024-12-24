import anime from 'animejs';
import { AnimationConfig } from './types';

/**
 * Creates a border thickening animation that expands inward
 */
export const thickenBorder: AnimationConfig = {
  enter: (borderElement: HTMLElement) => {    
    return anime({
      targets: borderElement,
      borderWidth: [0, 3],
      duration: 100,
      easing: 'easeOutQuad'
    });
  },
  
  leave: (borderElement: HTMLElement) => {
    return anime({
      targets: borderElement,
      borderWidth: [3, 0],
      duration: 100,
      easing: 'easeInQuad'
    });
  }
}; 