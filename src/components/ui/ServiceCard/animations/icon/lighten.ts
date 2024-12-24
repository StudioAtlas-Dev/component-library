import anime from 'animejs';
import type { AnimationConfig } from '../types';

// Convert hex to HSL and determine if color is light
function getColorInfo(color: string) {
  // Default values
  let h = 0, s = 0, l = 0;

  // Check if it's already HSL format
  const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/i);
  if (hslMatch) {
    h = parseInt(hslMatch[1]);
    s = parseInt(hslMatch[2]);
    l = parseInt(hslMatch[3]);
    return {
      h,
      s,
      l,
      isLight: l > 70
    };
  }

  // Check if it's a valid hex color
  if (!color.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
    throw new Error(`Invalid color format: ${color}. Must be hex (#RRGGBB) or HSL.`);
  }

  // Remove hash if present
  color = color.replace(/^#/, '');

  // Expand shorthand hex
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }

  // Convert hex to RGB
  const r = parseInt(color.substring(0, 2), 16) / 255;
  const g = parseInt(color.substring(2, 4), 16) / 255;
  const b = parseInt(color.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  // Calculate lightness
  l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
    isLight: l * 100 > 70
  };
}

export const lighten: AnimationConfig = {
  enter: (containerElement: HTMLElement) => {
    // Try to find icon container first
    const iconContainer = containerElement.querySelector('.service-card-icon-container');
    const icon = containerElement.querySelector('.service-card-icon') as HTMLElement;
    if (!icon) return anime({ targets: containerElement, duration: 0 });

    // Get the original color from data attribute
    const color = icon.dataset.color || '#007acc';
    let colorInfo;
    try {
      colorInfo = getColorInfo(color);
    } catch (e) {
      console.error(e);
      colorInfo = { isLight: false }; // Default to dark if invalid
    }
    const textColor = colorInfo.isLight ? '#000000' : '#ffffff';

    if (iconContainer) {
      // If we have a container, animate it
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
        color: textColor,
      }, '-=200'); // Start at same time
    } else {
      // If no container, create a background effect within the icon's parent div
      const iconParent = icon.closest('.w-8.h-8.mb-4');
      if (!iconParent) return anime({ targets: containerElement, duration: 0 });

      // Create or get the background element
      let background = iconParent.querySelector('.service-card-icon-background') as HTMLElement;
      if (!background) {
        // Create a wrapper to maintain layout
        const wrapper = document.createElement('div');
        wrapper.className = 'relative w-full h-full';
        
        // Create the background
        background = document.createElement('div');
        background.className = 'service-card-icon-background absolute';
        background.style.borderRadius = '50%';
        background.style.opacity = '0';
        background.style.transform = 'scale(0)';
        background.style.zIndex = '1';
        // Expand outward
        background.style.top = '-8px';
        background.style.right = '-8px';
        background.style.bottom = '-8px';
        background.style.left = '-8px';
        
        // Move the icon into the wrapper and ensure it's on top
        const parent = icon.parentElement;
        if (parent) {
          wrapper.appendChild(background);
          wrapper.appendChild(icon);
          icon.style.position = 'relative';
          icon.style.zIndex = '2';
          parent.appendChild(wrapper);
        }
      }

      return anime.timeline({
        easing: 'easeOutQuad',
        duration: 200
      })
      .add({
        targets: background,
        scale: [0, 1],
        opacity: [0, 1],
        backgroundColor: color,
      })
      .add({
        targets: icon,
        color: textColor,
      }, '-=200'); // Start at same time
    }
  },
  leave: (containerElement: HTMLElement) => {
    const iconContainer = containerElement.querySelector('.service-card-icon-container');
    const icon = containerElement.querySelector('.service-card-icon') as HTMLElement;
    const background = containerElement.querySelector('.service-card-icon-background');
    if (!icon) return anime({ targets: containerElement, duration: 0 });

    // Get the original color and calculate darker version for container
    const color = icon.dataset.color || '#007acc';
    let darkerColor;
    try {
      // If it's HSL, we'll get the values but won't use them - we'll still darken the original color
      getColorInfo(color);
      // Only calculate darker version for hex
      darkerColor = color.startsWith('#')
      ? color.replace(/^#/, '').match(/.{2}/g)?.map(c => {
          const rgbValue = parseInt(c, 16);
          return Math.max(0, Math.floor(rgbValue * 0.6)).toString(16).padStart(2, '0');
        }).join('')
      : '1a4294';
    } catch (e) {
      console.error(e);
      darkerColor = '1a4294'; // Default dark blue if invalid
    }

    if (iconContainer) {
      // If we have a container, animate it back
      return anime.timeline({
        targets: [iconContainer, icon],
        easing: 'easeInQuad',
        duration: 200
      })
      .add({
        targets: iconContainer,
        backgroundColor: `#${darkerColor}`,
      })
      .add({
        targets: icon,
        color: '#ffffff', // Always white when returning to dark background
      }, '-=200'); // Start at same time
    } else {
      // If no container, animate the background away
      return anime.timeline({
        easing: 'easeInQuad',
        duration: 200
      })
      .add({
        targets: background,
        scale: 0,
        opacity: 0,
      })
      .add({
        targets: icon,
        color: color,
      }, '-=200'); // Start at same time
    }
  }
}; 