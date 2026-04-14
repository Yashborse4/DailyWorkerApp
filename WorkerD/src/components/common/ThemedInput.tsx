import React, { useRef, useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TextInputProps, 
  View, 
  ViewStyle, 
  TextStyle,
  Animated,
  Platform
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ThemedText } from './ThemedText';

export type InputVariant = 'filled' | 'outlined';

interface ThemedInputProps extends TextInputProps {
  label?: string;
  variant?: InputVariant;
  containerStyle?: ViewStyle;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * M3 Compliant Themed Input
 * Supports: Filled and Outlined variants with animated focus states.
 */
export const ThemedInput: React.FC<ThemedInputProps> = ({ 
  label, 
  variant = 'filled',
  containerStyle, 
  error, 
  style, 
  icon,
  onFocus,
  onBlur,
  ...props 
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation for the focus indicator (active line or border highlight)
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const md3 = theme.md3.colors;

  const getContainerStyle = () => {
    if (variant === 'outlined') {
      return {
        borderWidth: isFocused ? 2 : 1,
        borderColor: error ? md3.error : isFocused ? md3.primary : md3.outline,
        borderRadius: theme.Shape.xs,
        backgroundColor: 'transparent',
      };
    }
    // Filled Variant
    return {
      backgroundColor: isFocused ? md3.surfaceVariant : md3.surfaceVariant + '80',
      borderTopLeftRadius: theme.Shape.xs,
      borderTopRightRadius: theme.Shape.xs,
      borderBottomWidth: 0,
    };
  };

  const activeIndicatorWidth = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <ThemedText 
          weight="700"
          style={[
            styles.label, 
            { color: error ? md3.error : isFocused ? md3.primary : md3.onSurfaceVariant }
          ]}
        >
          {label}
        </ThemedText>
      )}

      <View style={[styles.inputContainer, getContainerStyle()]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            { color: md3.onSurface },
            style as TextStyle
          ]}
          placeholderTextColor={md3.onSurfaceVariant + '80'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {variant === 'filled' && (
          <View style={[styles.inactiveLine, { backgroundColor: md3.onSurfaceVariant + '40' }]} />
        )}
        
        {variant === 'filled' && (
          <Animated.View 
            style={[
              styles.activeIndicator, 
              { 
                width: activeIndicatorWidth, 
                backgroundColor: error ? md3.error : md3.primary 
              }
            ]} 
          />
        )}
      </View>

      {error && (
        <ThemedText size="small" weight="600" style={{ color: md3.error, marginTop: 4, marginLeft: 16 }}>
          {error}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    marginLeft: 16,
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    height: '100%',
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  icon: {
    marginLeft: 16,
  },
  inactiveLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    height: 2,
  },
});

export default ThemedInput;
