import React, { useRef } from 'react';
import { View, ViewProps, StyleSheet, Platform, Pressable, Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

interface ThemedCardProps extends ViewProps {
  variant?: CardVariant;
  elevation?: number;
  onPress?: () => void;
}

/**
 * M3 Compliant Themed Card.
 * Supports: Elevated, Filled, and Outlined variants.
 */
export const ThemedCard: React.FC<ThemedCardProps> = ({ 
  children,
  style, 
  variant = 'elevated',
  elevation = 1,
  onPress,
  ...props 
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getCardStyle = () => {
    const md3 = theme.md3.colors;
    const baseStyle = {
      borderRadius: theme.Shape.lg,
      padding: theme.Spacing.md,
      overflow: 'hidden' as const,
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: md3.surfaceVariant,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: md3.surface,
          borderWidth: 1,
          borderColor: md3.outlineVariant,
        };
      case 'elevated':
      default:
        return {
          ...baseStyle,
          backgroundColor: md3.elevation.level1,
          ...Platform.select({
            ios: {
              shadowColor: md3.shadow,
              shadowOffset: { width: 0, height: elevation },
              shadowOpacity: 0.08 * elevation,
              shadowRadius: elevation * 2,
            },
            android: {
              elevation: elevation * 2,
            },
          }),
        };
    }
  };

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const Container = onPress ? Pressable : View;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Container 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={getCardStyle()} 
        {...props}
      >
        {children}
      </Container>
    </Animated.View>
  );
};

export default ThemedCard;
