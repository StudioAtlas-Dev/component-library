import anime from 'animejs';
import type { AnimationConfig } from '../types';

function getColorInfo(color: string) {
  // If it's already HSL format
  if (color.startsWith('hsl')) {
    const [h, s, l] = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
    return { hue: h, saturation: s, lightness: l, isLight: l >= 50 };
  }

  // If it's hex format
  if (color.startsWith('#')) {
    color = color.slice(1);
  }

  // Convert hex to RGB
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);

  // Convert RGB to HSL
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    hue: Math.round(h * 360),
    saturation: Math.round(s * 100),
    lightness: Math.round(l * 100),
    isLight: l * 100 >= 50
  };
}

export const lighten: AnimationConfig = {
  enter: (containerElement: HTMLElement) => {
    const iconContainer = containerElement.querySelector('.service-card-icon-container') as HTMLElement;
    const icon = containerElement.querySelector('.service-card-icon') as HTMLElement;
    if (!icon) return anime({ targets: containerElement, duration: 0 });

    // Get the color from the data attribute
    const color = icon.dataset.color || '#007acc';
    const colorInfo = getColorInfo(color);

    // Store original colors only if not already stored
    if (iconContainer && !iconContainer.dataset.originalBackground) {
      iconContainer.dataset.originalBackground = getComputedStyle(iconContainer).backgroundColor;
    }
    if (!icon.dataset.originalColor) {
      icon.dataset.originalColor = getComputedStyle(icon).color;
    }

    return anime.timeline({
      targets: [iconContainer, icon],
      easing: 'easeOutQuad',
      duration: 200
    })
    .add({
      targets: iconContainer,
      backgroundColor: color,
    })
    .add({
      targets: icon,
      color: colorInfo.isLight ? '#000000' : '#ffffff',
    }, '-=200');
  },
  leave: (containerElement: HTMLElement) => {
    const iconContainer = containerElement.querySelector('.service-card-icon-container') as HTMLElement;
    const icon = containerElement.querySelector('.service-card-icon') as HTMLElement;
    if (!icon) return anime({ targets: containerElement, duration: 0 });

    return anime.timeline({
      targets: [iconContainer, icon],
      easing: 'easeInQuad',
      duration: 200
    })
    .add({
      targets: iconContainer,
      backgroundColor: iconContainer.dataset.originalBackground,
    })
    .add({
      targets: icon,
      color: icon.dataset.originalColor,
    }, '-=200');
  }
}; 