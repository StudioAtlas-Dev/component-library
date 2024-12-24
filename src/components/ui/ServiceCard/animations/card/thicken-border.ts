import anime from 'animejs';
import type { AnimationConfig } from '../types';

export const thickenBorder: AnimationConfig = {
  enter: (borderElement: HTMLElement) => {
    const parentCard = borderElement.previousElementSibling;
    if (!parentCard) return anime({ targets: borderElement, duration: 0 });

    const computedStyle = window.getComputedStyle(parentCard);
    const borderColor = computedStyle.borderColor === 'rgb(0, 0, 0)' ? '#1a1a1a' : computedStyle.borderColor;
    const borderRadius = computedStyle.borderRadius;

    return anime({
      targets: borderElement,
      borderWidth: [0, 3],
      duration: 100,
      easing: 'easeOutQuad',
      begin: () => {
        borderElement.style.borderColor = borderColor;
        borderElement.style.borderRadius = borderRadius;
      }
    });
  },
  leave: (borderElement: HTMLElement) => {
    const parentCard = borderElement.previousElementSibling;
    if (!parentCard) return anime({ targets: borderElement, duration: 0 });

    const computedStyle = window.getComputedStyle(parentCard);
    const borderRadius = computedStyle.borderRadius;

    return anime({
      targets: borderElement,
      borderWidth: [3, 0],
      duration: 100,
      easing: 'easeInQuad',
      begin: () => {
        borderElement.style.borderRadius = borderRadius;
      },
      complete: () => {
        borderElement.style.borderWidth = '0px';
        borderElement.style.borderColor = 'transparent';
      }
    });
  }
}; 