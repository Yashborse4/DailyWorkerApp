import { ThemeSpacing, ThemeShape } from '../types';

/**
 * Standardized Spacing Scale (M3 Aligned)
 */
export const Spacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Standardized Shape Scale (M3 Aligned)
 */
export const Shape: ThemeShape = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

/**
 * M3 Motion Specification
 */
export const Motion = {
  duration: {
    short1: 50,
    short2: 100,
    short3: 150,
    short4: 200,
    medium1: 250,
    medium2: 300,
    medium3: 350,
    medium4: 400,
    long1: 450,
    long2: 500,
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1.0)',
    decelerated: 'cubic-bezier(0, 0, 0, 1)',
    accelerated: 'cubic-bezier(0.3, 0, 1, 1)',
  }
};

export default { Spacing, Shape, Motion };
