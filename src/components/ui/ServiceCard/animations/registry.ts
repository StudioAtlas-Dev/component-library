import { AnimationMap } from './types';
import { thickenBorder } from './card/thicken-border';
import { linkIndicator } from './card/link-indicator';
import { darkenBackground } from './card/darken-background';
import { rotate360 } from './icon/rotate-360';
import { lighten } from './icon/lighten';

const cardAnimations: AnimationMap = {
  'thicken-border': thickenBorder,
  'link-indicator': linkIndicator,
  'darken-background': darkenBackground,
};

const iconAnimations: AnimationMap = {
  'icon-360': rotate360,
  'lighten': lighten,
};

export function getAnimation(type: 'card' | 'icon', name: string) {
  const animations = type === 'card' ? cardAnimations : iconAnimations;
  return animations[name];
} 