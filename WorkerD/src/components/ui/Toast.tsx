import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { m3Shape, m3Typography, m3Elevation } from '../../theme';

const { width: screenWidth } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type ToastPosition = 'top' | 'center' | 'bottom';

export interface ToastConfig {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  position?: ToastPosition;
  duration?: number;
  backdrop?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  onDismiss?: () => void;
}

export interface ToastItemProps extends ToastConfig {
  onRemove: (id: string) => void;
  index: number;
}

/**
 * Premium Minimalist Toast component.
 * Features a sleek, high-contrast pill design suitable for modern professional apps.
 */
const ToastItem: React.FC<ToastItemProps> = ({
  id,
  type,
  title,
  message,
  position = 'top',
  duration = 3000,
  backdrop = false,
  icon,
  onPress,
  onDismiss,
  onRemove,
  index,
}) => {
  const { isDark, theme } = useTheme();
  const colors = theme.colors;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const handleDismiss = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      onDismiss?.();
      onRemove(id);
    });
  }, [id, onDismiss, onRemove, opacityAnim, scaleAnim]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 12 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();

    if (duration > 0) {
      const timer = setTimeout(handleDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleDismiss, scaleAnim, opacityAnim]);

  const getToastColors = () => {
    // Material 3 tonal surface colors with primary accent
    const surface = isDark ? colors.surfaceContainerHigh : colors.surfaceContainerLowest;
    const onSurface = colors.onSurface;
    const outline = colors.outlineVariant;

    let accentColor = colors.primary;
    let iconName = 'notifications';

    switch (type) {
      case 'success': 
        accentColor = '#2E7D32'; // M3 green
        iconName = 'checkmark-circle';
        break;
      case 'error': 
        accentColor = '#C62828'; // M3 red
        iconName = 'close-circle';
        break;
      case 'warning': 
        accentColor = '#F9A825'; // M3 yellow
        iconName = 'warning';
        break;
      case 'info': 
        accentColor = colors.primary;
        iconName = 'information-circle';
        break;
      case 'neutral':
      default:
        accentColor = colors.secondary;
        iconName = 'notifications';
        break;
    }

    return { surface, onSurface, accentColor, iconName, outline };
  };

  const { surface, onSurface, accentColor, iconName, outline } = getToastColors();

  const getPositionStyle = () => {
    const offset = 16 + (index * 80);
    switch (position) {
      case 'top':
        return {
          top: Platform.OS === 'ios' ? 60 + offset : 24 + offset,
        };
      case 'bottom':
        return {
          bottom: Platform.OS === 'ios' ? 48 + offset : 24 + offset,
        };
      default:
        return {
          top: '40%',
        };
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        getPositionStyle() as any, 
        { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }
      ]} 
      pointerEvents="box-none"
    >
      {backdrop && <View style={styles.backdrop} />}

      <TouchableOpacity
        style={[styles.toastCard, { backgroundColor: surface, borderColor: outline }]}
        onPress={onPress || handleDismiss}
        activeOpacity={0.9}
      >
        {/* Leading accent indicator */}
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
        
        <View style={styles.content}>
          <Ionicons name={iconName as any} size={22} color={accentColor} style={styles.icon} />
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: onSurface }]} numberOfLines={1}>
              {title}
            </Text>
            {message && (
              <Text style={[styles.message, { color: onSurface }]} numberOfLines={2}>
                {message}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  toastCard: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 400,
    minHeight: 64,
    borderRadius: m3Shape.large, // 16px - M3 medium component radius
    borderWidth: 1,
    overflow: 'hidden',
    ...m3Elevation.level2,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...m3Typography.bodyLarge,
    fontWeight: '500',
  },
  message: {
    ...m3Typography.bodyMedium,
    marginTop: 2,
    opacity: 0.75,
  },
});

export default ToastItem;
