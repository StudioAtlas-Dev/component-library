import anime from 'animejs';
import { AnimationConfig } from './types';

/**
 * Creates a 3D rotation animation for an icon element
 * The animation rotates the icon 360 degrees around the Y axis,
 * creating a 3D flipping effect where the icon appears to spin in space
 */
export const icon360: AnimationConfig = {
  enter: (iconElement: HTMLElement) => {
    return anime({
      targets: iconElement,
      rotateY: [0, 360],
      duration: 300,
      easing: 'easeOutQuad',
      // Use transform-style: preserve-3d on the icon element
      begin: () => {
        iconElement.style.transformStyle = 'preserve-3d';
        iconElement.style.backfaceVisibility = 'visible';
      }
    });
  },
  
  leave: (iconElement: HTMLElement) => {
    return anime({
      targets: iconElement,
      rotateY: [360, 0], // Complete another full rotation
      duration: 300,
      easing: 'easeInQuad',
      complete: () => {
        // Reset transform to prevent any rendering artifacts
        iconElement.style.transform = '';
      }
    });
  }
}; 