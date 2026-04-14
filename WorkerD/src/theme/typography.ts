import { ThemeTypography } from '../types';

/**
 * Standardized Typography Scales for WorkerD
 * 
 * Scaled according to Headline, Title, Body, and Label.
 */
export const Typography: ThemeTypography = {
  headline: {
    large: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
    },
    medium: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700',
    },
    small: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700',
    },
  },
  title: {
    large: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '600',
    },
    medium: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    },
    small: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
    },
  },
  body: {
    large: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    },
    medium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
    },
  },
  label: {
    large: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    medium: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
    },
    small: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '500',
    },
  },
};

export default Typography;
