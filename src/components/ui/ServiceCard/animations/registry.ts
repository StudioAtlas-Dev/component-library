import type { AnimationConfig } from './types';

export type AnimationType = 'card' | 'icon';

// Import all animations from their respective folders
const cardAnimations = {
  'thicken-border': require('./card/thicken-border').thickenBorder
} as const;

const iconAnimations = {
  'icon-360': require('./icon/rotate-360').rotate360
} as const;

export type CardAnimation = keyof typeof cardAnimations;
export type IconAnimation = keyof typeof iconAnimations;

export const getAnimation = (type: AnimationType, name: string): AnimationConfig | null => {
  if (type === 'card') {
    return cardAnimations[name as CardAnimation] ?? null;
  }
  return iconAnimations[name as IconAnimation] ?? null;
}; 