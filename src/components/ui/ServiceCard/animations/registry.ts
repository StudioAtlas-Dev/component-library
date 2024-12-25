import { thickenBorder } from './card/thicken-border';
import { rotate360 } from './icon/rotate-360';
import { lighten } from './icon/lighten';
import { linkIndicator } from './card/link-indicator';
import { darkenBackground } from './card/darken-background';
import { raiseBackgroundImage } from './card/raise-background-image';
import type { AnimationConfig } from './types';

type AnimationMap = {
  [key: string]: AnimationConfig;
};

export const cardAnimations: AnimationMap = {
  'thicken-border': thickenBorder,
  'link-indicator': linkIndicator,
  'darken-background': darkenBackground,
  'raise-background-image': raiseBackgroundImage
};

export const iconAnimations: AnimationMap = {
  'icon-360': rotate360,
  'lighten': lighten
}; 