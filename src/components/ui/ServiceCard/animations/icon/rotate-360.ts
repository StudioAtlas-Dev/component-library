import anime from 'animejs';
import type { AnimationConfig } from '../types';

export const rotate360: AnimationConfig = {
  enter: (iconElement: HTMLElement) => {
    return anime({
      targets: iconElement,
      rotateY: 360,
      duration: 600,
      easing: 'easeInOutQuad'
    });
  },
  leave: (iconElement: HTMLElement) => {
    return anime({
      targets: iconElement,
      rotateY: 0,
      duration: 600,
      easing: 'easeInOutQuad'
    });
  }
}; 