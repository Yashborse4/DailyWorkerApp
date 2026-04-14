import { ThemeColors, Theme } from '../types';
import { Typography } from './typography';
import { Spacing, Shape, Motion } from './layout';
import { Primitives } from './colors';

/**
 * Theme Definition for WorkerD
 * 
 * Centralized design tokens for colors, spacing, and typography.
 * Now fully M3 (Material Design 3) compatible.
 */

const LightColors: ThemeColors = {
  primary: Primitives.violet[600],
  primaryVariant: Primitives.violet[700],
  secondary: Primitives.teal[500],
  background: Primitives.white,
  surface: Primitives.white,
  error: Primitives.rose[600],
  success: Primitives.emerald[600],
  warning: Primitives.amber[600],
  onPrimary: Primitives.white,
  onSecondary: Primitives.white,
  onBackground: Primitives.slate[900],
  onSurface: Primitives.slate[900],
  onError: Primitives.white,
  white: Primitives.white,
  black: Primitives.black,
  
  // Custom Role-Based Colors
  worker: {
    base: Primitives.blue[600],
    light: Primitives.blue[100],
    dark: Primitives.blue[800],
  },
  hirer: {
    base: Primitives.emerald[600],
    light: Primitives.emerald[100],
    dark: Primitives.emerald[800],
  },
  
  // Neutral
  grey: {
    100: Primitives.slate[100],
    200: Primitives.slate[200],
    300: Primitives.slate[300],
    400: Primitives.slate[400],
    500: Primitives.slate[500],
  }
};

const DarkColors: ThemeColors = {
  primary: Primitives.violet[400],
  primaryVariant: Primitives.violet[300],
  secondary: Primitives.teal[400],
  background: Primitives.slate[950],
  surface: Primitives.slate[900],
  error: Primitives.rose[500],
  success: Primitives.emerald[500],
  warning: Primitives.amber[500],
  onPrimary: Primitives.black,
  onSecondary: Primitives.black,
  onBackground: Primitives.white,
  onSurface: Primitives.white,
  onError: Primitives.black,
  white: Primitives.white,
  black: Primitives.black,
  
  // Custom Role-Based Colors (Slightly adjusted for Dark Mode)
  worker: {
    base: Primitives.blue[400],
    light: Primitives.blue[100],
    dark: Primitives.blue[600],
  },
  hirer: {
    base: Primitives.emerald[400],
    light: Primitives.emerald[100],
    dark: Primitives.emerald[600],
  },
  
  // Neutral
  grey: {
    100: Primitives.slate[800],
    200: Primitives.slate[700],
    300: Primitives.slate[600],
    400: Primitives.slate[500],
    500: Primitives.slate[400],
  }
};

const createMD3Theme = (colors: ThemeColors, isDark: boolean) => ({
  colors: {
    primary: colors.primary,
    onPrimary: colors.onPrimary,
    primaryContainer: isDark ? colors.primary + '33' : colors.primary + '1A',
    onPrimaryContainer: colors.primary,
    secondary: colors.secondary,
    onSecondary: colors.onSecondary,
    secondaryContainer: isDark ? colors.secondary + '33' : colors.secondary + '1A',
    onSecondaryContainer: colors.secondary,
    tertiary: colors.warning,
    onTertiary: colors.white,
    tertiaryContainer: isDark ? colors.warning + '33' : colors.warning + '1A',
    onTertiaryContainer: colors.warning,
    error: colors.error,
    onError: colors.onPrimary,
    errorContainer: colors.error + '1A',
    onErrorContainer: colors.error,
    background: colors.background,
    onBackground: colors.onBackground,
    surface: colors.surface,
    onSurface: colors.onSurface,
    surfaceVariant: colors.grey[100],
    onSurfaceVariant: colors.grey[500],
    outline: colors.grey[200],
    outlineVariant: colors.grey[300],
    shadow: Primitives.black,
    scrim: Primitives.black,
    inverseSurface: colors.onSurface,
    inverseOnSurface: colors.surface,
    inversePrimary: colors.primary,
    elevation: {
      level0: 'transparent',
      level1: isDark ? '#232A31' : '#F7F9FC',
      level2: isDark ? '#28313A' : '#F1F4F9',
      level3: isDark ? '#2D3843' : '#EBF0F7',
      level4: isDark ? '#323F4C' : '#E5ECF5',
      level5: isDark ? '#374655' : '#DFE8F3',
    },
    surfaceDisabled: colors.grey[200],
    onSurfaceDisabled: colors.grey[400],
    backdrop: 'rgba(0,0,0,0.5)',
  },
  typography: {
    displayLarge: Typography.headline.large,
    displayMedium: Typography.headline.medium,
    displaySmall: Typography.headline.small,
    headlineLarge: Typography.headline.large,
    headlineMedium: Typography.headline.medium,
    headlineSmall: Typography.headline.small,
    titleLarge: Typography.title.large,
    titleMedium: Typography.title.medium,
    titleSmall: Typography.title.small,
    bodyLarge: Typography.body.large,
    bodyMedium: Typography.body.medium,
    bodySmall: Typography.body.small,
    labelLarge: Typography.label.large,
    labelMedium: Typography.label.medium,
    labelSmall: Typography.label.small,
  },
});

export const lightTheme: Theme = {
  Colors: LightColors,
  Spacing,
  Typography,
  Shape,
  md3: createMD3Theme(LightColors, false),
  motion: Motion,
};

export const darkTheme: Theme = {
  Colors: DarkColors,
  Spacing,
  Typography,
  Shape,
  md3: createMD3Theme(DarkColors, true),
  motion: Motion,
};

export const Themes = {
  light: lightTheme,
  dark: darkTheme,
};

export { Spacing, Shape, Typography, Motion };

export default Themes;
