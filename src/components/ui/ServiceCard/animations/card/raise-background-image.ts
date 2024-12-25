import anime from 'animejs';
import type { AnimationConfig } from '../types';

export const raiseBackgroundImage: AnimationConfig = {
  enter: (borderElement: HTMLElement) => {
    const card = borderElement.parentElement as HTMLElement;
    if (!card || !card.dataset.animationImage) return anime({ targets: borderElement, duration: 0 });

    // Create container if it doesn't exist
    let imageContainer = card.querySelector('.background-image-container') as HTMLElement;
    if (!imageContainer) {
      imageContainer = document.createElement('div');
      imageContainer.className = 'background-image-container absolute inset-x-0 bottom-0 h-[100px] overflow-hidden pointer-events-none z-0';
      card.insertBefore(imageContainer, card.firstChild);

      // Move the preloaded Next.js Image from its hidden container
      const preloadedImage = card.parentElement?.querySelector('img');
      if (!preloadedImage) {
        console.error('Next.js Image not found');
        return anime({ targets: borderElement, duration: 0 });
      }

      // Configure the image
      preloadedImage.className = 'absolute inset-0 w-full h-[100px] object-cover object-[0_-5px] mix-blend-multiply opacity-100 block';
      preloadedImage.style.transform = 'translateY(100%)';
      // Set the background image to repeat
      preloadedImage.style.backgroundSize = 'auto 100%';
      preloadedImage.style.backgroundRepeat = 'repeat-x';
      imageContainer.appendChild(preloadedImage);

      // Create overlay that matches card background
      const overlay = document.createElement('div');
      overlay.className = 'absolute inset-0 bg-inherit opacity-85';
      overlay.style.backgroundColor = getComputedStyle(card).backgroundColor;
      imageContainer.appendChild(overlay);

      // Set up mutation observer to watch for background color changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            overlay.style.backgroundColor = getComputedStyle(card).backgroundColor;
          }
        });
      });
      observer.observe(card, { attributes: true, attributeFilter: ['style'] });
    }

    // Ensure content is above the background
    const content = card.querySelector('.service-card-content');
    if (content instanceof HTMLElement) {
      content.style.position = 'relative';
      content.style.zIndex = '1';
    }

    // Ensure icon is above the background
    const icon = card.querySelector('.service-card-icon-container');
    if (icon instanceof HTMLElement) {
      icon.style.position = 'relative';
      icon.style.zIndex = '1';
    }

    // Animate the image rising
    const image = imageContainer.querySelector('img');
    if (!image) return anime({ targets: borderElement, duration: 0 });

    return anime({
      targets: image,
      translateY: '10%',
      easing: 'easeOutQuad',
      duration: 500
    });
  },
  leave: (borderElement: HTMLElement) => {
    const card = borderElement.parentElement as HTMLElement;
    if (!card) return anime({ targets: borderElement, duration: 0 });

    const image = card.querySelector('.background-image-container img');
    if (!image) return anime({ targets: borderElement, duration: 0 });

    return anime({
      targets: image,
      translateY: '100%',
      easing: 'easeInQuad',
      duration: 500
    });
  }
}; 