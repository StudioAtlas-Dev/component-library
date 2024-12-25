import type { AnimeInstance } from 'animejs';

/**
 * Available animation effects for the ServiceCard icon.
 * - none: No animation
 * - icon-360: Icon spins 360 degrees in 3D space on hover
 * - lighten: Icon background lightens and text color adjusts based on contrast
 * 
 * Multiple animations can be combined by separating them with spaces.
 * Example: 'lighten icon-360'
 */
export type IconAnimation = 'none' | 'icon-360' | 'lighten';

/**
 * Available animation effects for the ServiceCard itself.
 * - none: No animation
 * - thicken-border: Border thickens inward on hover
 * - link-indicator: Shows a triangle in the bottom right corner
 * 
 * Multiple animations can be combined by separating them with spaces.
 * Example: 'thicken-border link-indicator'
 */
export type CardAnimation = 'none' | 'thicken-border' | 'link-indicator';

/**
 * Interface for animation configurations
 * Each animation should provide enter and leave functions
 * that handle the animation lifecycle.
 * 
 * When multiple animations are used, they will be executed
 * in the order they are specified in the string.
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