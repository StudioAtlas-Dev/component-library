import type { AnimeInstance } from 'animejs';

/**
 * Available animation effects for the ServiceCard icon.
 * - none: No animation
 * - icon-360: Icon spins 360 degrees in 3D space on hover
 */
export type IconAnimation = 'none' | 'icon-360';

/**
 * Available animation effects for the ServiceCard itself.
 * - none: No animation
 * - thicken-border: Border thickens inward on hover
 */
export type CardAnimation = 'none' | 'thicken-border';

/**
 * Interface for animation configurations
 * Each animation should provide enter and leave functions
 * that handle the animation lifecycle
 */
export interface AnimationConfig {
  enter: (element: HTMLElement) => AnimeInstance;
  leave: (element: HTMLElement) => AnimeInstance;
}

/**
 * Map of all available animations
 * Add new animations here to make them available to the ServiceCard
 */
export interface AnimationMap {
  [key: string]: AnimationConfig;
} 