import anime from 'animejs';
import type { AnimationConfig } from '../types';

export const darkenBackground: AnimationConfig = {
  enter: (borderElement: HTMLElement) => {
    const card = borderElement.parentElement as HTMLElement;
    if (!card) return anime({ targets: borderElement, duration: 0 });

    // Get text elements
    const textElements = card.querySelectorAll('h3, p');

    // Store original colors only if not already stored
    textElements.forEach(el => {
      if (el instanceof HTMLElement && !el.dataset.originalColor) {
        el.dataset.originalColor = getComputedStyle(el).color;
      }
    });

    // Store original background only if not already stored
    if (!card.dataset.originalBackground) {
      card.dataset.originalBackground = getComputedStyle(card).backgroundColor;
    }

    return anime.timeline({
      easing: 'easeOutQuad',
    })
    .add({
      targets: card,
      backgroundColor: card.dataset.activeDarkColor,
      duration: 250
    })
    .add({
      targets: textElements,
      color: '#ffffff',
      duration: 200
    }, '-=200');
  },
  leave: (borderElement: HTMLElement) => {
    const card = borderElement.parentElement as HTMLElement;
    if (!card) return anime({ targets: borderElement, duration: 0 });

    // Get text elements
    const textElements = card.querySelectorAll('h3, p');

    return anime.timeline({
      easing: 'easeInQuad',
    })
    .add({
      targets: textElements,
      color: (el: Element) => {
        return (el instanceof HTMLElement && el.dataset.originalColor) || getComputedStyle(el).color;
      },
      duration: 200
    })
    .add({
      targets: card,
      backgroundColor: card.dataset.originalBackground,
      duration: 200
    }, '-=150');
  }
}; 
