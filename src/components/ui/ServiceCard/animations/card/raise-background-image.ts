import anime from 'animejs';
import type { AnimationConfig } from '../types';

const IMAGE_HEIGHT = 110; // px

// Create and preload a single shared image instance
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Cache to store preloaded image URLs
const preloadedImages = new Set<string>();

export const raiseBackgroundImage: AnimationConfig = {
  enter: (borderElement: HTMLElement) => {
    const card = borderElement.parentElement as HTMLElement;
    if (!card || !card.dataset.animationImage) return anime({ targets: borderElement, duration: 0 });

    // Preload image if not already preloaded
    const imageUrl = card.dataset.animationImage;
    if (!preloadedImages.has(imageUrl)) {
      preloadedImages.add(imageUrl);
      preloadImage(imageUrl).catch(console.error);
    }

    // Create image container if it doesn't exist
    let imageContainer = card.querySelector('.background-image-container') as HTMLElement;
    if (!imageContainer) {
      imageContainer = document.createElement('div');
      imageContainer.className = 'background-image-container absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none h-[100px] z-0';
      card.insertBefore(imageContainer, card.firstChild);

      // Create the image element using the data attribute
      const image = document.createElement('div');
      image.className = 'absolute inset-x-0 w-full';
      image.style.backgroundImage = `url(${imageUrl})`;
      image.style.backgroundSize = `auto ${IMAGE_HEIGHT}px`;
      image.style.backgroundPosition = 'center top';
      image.style.height = `${IMAGE_HEIGHT}px`;
      image.style.transform = 'translateY(100%)';
      image.style.mixBlendMode = 'multiply';
      imageContainer.appendChild(image);

      // Create overlay that matches card background
      const overlay = document.createElement('div');
      overlay.className = 'absolute inset-0 opacity-85';
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

    // Animate the image rising
    return anime({
      targets: imageContainer.querySelector('div:not(:last-child)'),
      translateY: '20%',
      easing: 'easeOutQuad',
      duration: 600
    });
  },
  leave: (borderElement: HTMLElement) => {
    const card = borderElement.parentElement as HTMLElement;
    if (!card) return anime({ targets: borderElement, duration: 0 });

    const image = card.querySelector('.background-image-container div:not(:last-child)') as HTMLElement;
    if (!image) return anime({ targets: borderElement, duration: 0 });

    return anime({
      targets: image,
      translateY: '100%',
      easing: 'easeInQuad',
      duration: 400
    });
  }
}; 