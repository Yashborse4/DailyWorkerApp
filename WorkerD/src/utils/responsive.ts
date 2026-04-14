import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on standard iPhone 11 screen (375x812)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Scales a size based on screen width.
 */
export const scaleSize = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Scales a size based on screen height.
 */
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

/**
 * Moderate scaling for components that shouldn't grow too large.
 */
export const moderateScale = (size: number, factor = 0.5) => size + (scaleSize(size) - size) * factor;

/**
 * Returns a responsive spacing value based on the theme tokens.
 */
export const getResponsiveSpacing = (key: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl') => {
  const scale = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };
  return scaleSize(scale[key]);
};

/**
 * Returns a responsive typography value.
 */
export const getResponsiveTypography = (key: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
  const scale = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  };
  return scaleSize(scale[key]);
};

/**
 * Returns a responsive border radius.
 */
export const getResponsiveBorderRadius = (key: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
  const scale = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 24,
  };
  return scaleSize(scale[key]);
};

export default {
    scaleSize,
    verticalScale,
    moderateScale,
    getResponsiveSpacing,
    getResponsiveTypography,
    getResponsiveBorderRadius
};
