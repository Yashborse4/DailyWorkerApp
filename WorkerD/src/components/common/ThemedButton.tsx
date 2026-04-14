import React, { useRef } from 'react';
import { 
  StyleSheet, 
  Pressable, 
  Animated, 
  ViewStyle, 
  ActivityIndicator,
  Platform,
  View
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ThemedText } from './ThemedText';

export type ButtonVariant = 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text';

interface ThemedButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

/**
 * M3 Compliant Themed Button
 * Supports 5 standard M3 variants: Filled, Elevated, Tonal, Outlined, and Text.
 */
export const ThemedButton: React.FC<ThemedButtonProps> = ({ 
  title, 
  onPress,
  variant = 'filled', 
  loading = false, 
  disabled = false,
  style, 
  icon,
  ...props 
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getStyle = () => {
    const md3 = theme.md3.colors;
    const baseStyle : ViewStyle = {
       height: 56, // Fixed height for M3 large buttons
       borderRadius: theme.Shape.full,
       paddingHorizontal: icon ? 16 : 24,
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'center',
    };

    if (disabled) {
       return {
         ...baseStyle,
         backgroundColor: theme.md3.colors.surfaceDisabled,
       };
    }

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: md3.elevation.level1,
          elevation: 1,
          shadowColor: md3.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        };
      case 'tonal':
        return {
          ...baseStyle,
          backgroundColor: md3.secondaryContainer,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: md3.outline,
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          paddingHorizontal: 12,
        };
      case 'filled':
      default:
        return {
          ...baseStyle,
          backgroundColor: md3.primary,
        };
    }
  };

  const getTextColor = () => {
    const md3 = theme.md3.colors;
    if (disabled) return md3.onSurfaceDisabled;
    
    switch (variant) {
      case 'tonal': return md3.onSecondaryContainer;
      case 'outlined': return md3.primary;
      case 'text': return md3.primary;
      case 'elevated': return md3.primary;
      case 'filled':
      default: return md3.onPrimary;
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
      friction: 10
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 10
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }], width: '100%' }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={({ pressed }) => [
          getStyle(),
          pressed && variant !== 'text' && { opacity: 0.85 }
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <ThemedText 
              weight="700"
              style={{ 
                color: getTextColor(), 
                fontSize: 16,
                letterSpacing: 0.1,
              }}
            >
              {title}
            </ThemedText>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 8,
  }
});

export default ThemedButton;
