import React, { useRef, useEffect } from 'react';
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../hooks/useTheme';
import {
  scaleSize,
  getResponsiveSpacing,
  getResponsiveTypography,
  getResponsiveBorderRadius,
} from '../../utils/responsive';
import { PremiumPressable } from './PremiumPressable';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'outlined' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  rounded?: 'default' | 'full' | 'none';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptics?: boolean;
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  rounded = 'default',
  fullWidth = false,
  style,
  textStyle,
  haptics = true,
  glow = false,
}) => {
  const { theme, isDark } = useTheme();
  const colors = theme.Colors;

  const handlePress = () => {
    if (disabled || loading) return;
    onPress();
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };

    if (fullWidth) baseStyle.width = '100%';

    // Size
    switch (size) {
      case 'sm':
        baseStyle.paddingHorizontal = getResponsiveSpacing('md');
        baseStyle.paddingVertical = scaleSize(6);
        baseStyle.height = scaleSize(32);
        break;
      case 'lg':
        baseStyle.paddingHorizontal = getResponsiveSpacing('xl');
        baseStyle.paddingVertical = scaleSize(14);
        baseStyle.height = scaleSize(56);
        break;
      default: // md
        baseStyle.paddingHorizontal = getResponsiveSpacing('lg');
        baseStyle.paddingVertical = scaleSize(10);
        baseStyle.height = scaleSize(44);
    }

    // Rounded
    if (rounded === 'full') {
      baseStyle.borderRadius = 999;
    } else if (rounded === 'none') {
      baseStyle.borderRadius = 0;
    } else {
      baseStyle.borderRadius = getResponsiveBorderRadius('xl'); // Modern default
    }

    // Variant
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = colors.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = theme.md3?.colors?.secondaryContainer || colors.grey[100];
        break;
      case 'outline':
      case 'outlined':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.md3?.colors?.outline || colors.grey[300];
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
      case 'danger':
        baseStyle.backgroundColor = colors.error;
        break;
      case 'success':
        baseStyle.backgroundColor = colors.success;
        break;
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (disabled) {
      // For filled buttons, keep high contrast text (opacity handles visual disabled state)
      if (variant === 'primary') return colors.onPrimary;
      if (variant === 'danger') return colors.onError;
      if (variant === 'success') return '#FFFFFF';
      // For others, use disabled text color
      return colors.grey[400];
    }

    switch (variant) {
      case 'primary': return colors.onPrimary;
      case 'secondary': return colors.text;
      case 'outline':
      case 'outlined': return theme.md3?.colors?.primary || colors.primary;
      case 'ghost': return colors.primary;
      case 'danger': return colors.onError;
      case 'success': return theme.md3?.colors?.success || colors.success;
      default: return colors.onBackground;
    }
  };

  const getIconColor = () => {
    return getTextColor();
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return getResponsiveTypography('xs');
      case 'lg': return getResponsiveTypography('md');
      default: return getResponsiveTypography('sm');
    }
  };

  return (
    <PremiumPressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
      bounce={true}
      haptic={haptics ? 'light' : 'none'}
      scaleTarget={0.96}
      glow={glow || variant === 'primary'}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon as any}
              size={scaleSize(18)}
              color={getIconColor()}
              style={{ marginRight: scaleSize(8) }}
            />
          )}
          <Text
            style={[
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                fontWeight: '600',
                letterSpacing: 0.3,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon as any}
              size={scaleSize(18)}
              color={getIconColor()}
              style={{ marginLeft: scaleSize(8) }}
            />
          )}
        </>
      )}
    </PremiumPressable>
  );
};
