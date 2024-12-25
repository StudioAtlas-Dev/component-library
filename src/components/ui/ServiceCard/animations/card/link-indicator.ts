import anime from 'animejs';
import type { AnimationConfig } from '../types';

export const linkIndicator: AnimationConfig = {
  enter: (borderElement: HTMLElement) => {
    const parentCard = borderElement.previousElementSibling;
    if (!parentCard) return anime({ targets: borderElement, duration: 0 });

    // Get the color from either the icon container (floating variant) or the icon itself
    // Since all cards share the same color on a page, we can use querySelector
    const iconContainer = document.querySelector('.service-card-icon-container');
    const icon = document.querySelector('.service-card-icon');
    const color = iconContainer?.getAttribute('data-color') || icon?.getAttribute('data-color') || '#1a1a1a';

    // Create or get the triangle element
    let triangle = borderElement.querySelector('.link-indicator-triangle') as HTMLElement;
    if (!triangle) {
      triangle = document.createElement('div');
      triangle.className = 'link-indicator-triangle';
      triangle.style.position = 'absolute';
      triangle.style.bottom = '0';
      triangle.style.right = '0';
      triangle.style.width = '0';
      triangle.style.height = '0';
      triangle.style.borderStyle = 'solid';
      triangle.style.borderWidth = '0';
      triangle.style.borderColor = `transparent ${color} ${color} transparent`;
      triangle.style.transform = 'translate3d(0, 0, 0)'; // Enable hardware acceleration
      triangle.style.opacity = '0';
      borderElement.appendChild(triangle);
    }

    return anime.timeline({
      easing: 'easeOutQuad',
    })
    .add({
      targets: triangle,
      borderWidth: ['0', '24px'],
      opacity: [0, 1],
      duration: 200,
      begin: () => {
        triangle.style.opacity = '0';
        triangle.style.borderColor = `transparent ${color} ${color} transparent`;
      }
    });
  },
  leave: (borderElement: HTMLElement) => {
    const triangle = borderElement.querySelector('.link-indicator-triangle') as HTMLElement;
    if (!triangle) return anime({ targets: borderElement, duration: 0 });

    return anime({
      targets: triangle,
      borderWidth: ['24px', '0'],
      opacity: [1, 0],
      duration: 200,
      easing: 'easeInQuad',
      complete: () => {
        triangle.remove();
      }
    });
  }
}; 