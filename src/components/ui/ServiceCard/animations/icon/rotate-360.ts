import anime from 'animejs';
import type { AnimationConfig } from '../types';

export const rotate360: AnimationConfig = {
  enter: (containerElement: HTMLElement) => {
    // Find the icon within this specific card's container
    const iconElement = containerElement.querySelector('.service-card-icon');
    if (!iconElement) return anime({ targets: containerElement, duration: 0 });

    return anime({
      targets: iconElement,
      rotateY: 360,
      duration: 600,
      easing: 'easeInOutQuad'
    });
  },
  leave: (containerElement: HTMLElement) => {
    // Find the icon within this specific card's container
    const iconElement = containerElement.querySelector('.service-card-icon');
    if (!iconElement) return anime({ targets: containerElement, duration: 0 });

    return anime({
      targets: iconElement,
      rotateY: 0,
      duration: 600,
      easing: 'easeInOutQuad'
    });
  }
}; 