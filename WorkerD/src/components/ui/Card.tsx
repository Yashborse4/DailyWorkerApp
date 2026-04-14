import React, { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { getResponsiveBorderRadius, getResponsiveSpacing } from '../../utils/responsiveEnhanced';
import { PremiumPressable } from './PremiumPressable';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat' | 'floating';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = memo(({
  children,
  variant = 'elevated',
  padding = 'md',
  onPress,
  disabled = false,
  style,
  testID,
  glow = false,
}) => {
  const { theme, isDark } = useTheme();
  const colors = theme.colors;

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          ...theme.shadows.md,
          borderWidth: isDark ? 1 : 0,
          borderColor: colors.border,
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'flat':
        return {
          backgroundColor: colors.surfaceVariant,
        };
      case 'floating':
        return {
          backgroundColor: colors.surface,
          ...theme.shadows.lg,
          shadowColor: colors.primary,
        };
      default:
        return {};
    }
  };

  const getPadding = (padding: string) => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return getResponsiveSpacing('sm');
      case 'lg': return getResponsiveSpacing('lg');
      default: return getResponsiveSpacing('md');
    }
  };

  const cardStyle = {
    borderRadius: getResponsiveBorderRadius('xl'),
    padding: getPadding(padding),
    overflow: 'hidden' as const,
    ...getVariantStyles(variant),
    ...style,
  };

  if (onPress && !disabled) {
    return (
      <PremiumPressable
        onPress={onPress}
        disabled={disabled}
        style={cardStyle}
        scaleTarget={0.98}
        liftAmount={-2}
        glow={glow || variant === 'floating'}
        haptic="light"
      >
        {children}
      </PremiumPressable>
    );
  }

  return (
    <View style={[cardStyle, { opacity: disabled ? 0.6 : 1 }]} testID={testID}>
      {children}
    </View>
  );
});

Card.displayName = 'Card';

export default Card;

