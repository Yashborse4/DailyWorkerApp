import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ThemedText } from '../common/ThemedText';
import { useTheme } from '../../hooks/useTheme';

interface StatsCardProps {
  /** Emoji or icon string */
  icon: string;
  /** The stat value (e.g. "12", "₹4.5k") */
  value: string;
  /** Label below the value (e.g. "Applied") */
  label: string;
  /** Accent color for the value text and icon bg */
  accentColor?: string;
  /** Animation delay for stagger effect (ms) */
  delay?: number;
  /** Callback when card is pressed */
  onPress?: () => void;
}

/**
 * Premium stats card with frosted glassmorphism surface,
 * animated entrance, spring scale press, and accent-tinted icon container.
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  value,
  label,
  accentColor,
  delay = 0,
  onPress,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const color = accentColor || theme.Colors.primary;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 550,
        delay,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, fadeAnim, translateAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={!onPress}
        style={[
          styles.card,
          {
            backgroundColor: theme.Colors.surface,
            borderColor: color + '18',
            ...Platform.select({
              ios: {
                shadowColor: color,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.1,
                shadowRadius: 16,
              },
              android: {
                elevation: 4,
              },
            }),
          },
        ]}
      >
        {/* Frosted glass accent glow */}
        <View
          style={[
            styles.glowOverlay,
            { backgroundColor: color + '08' },
          ]}
        />

        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <ThemedText style={styles.icon}>{icon}</ThemedText>
        </View>
        <ThemedText type="title" size="large" weight="800" color={color} style={styles.value}>
          {value}
        </ThemedText>
        <ThemedText type="label" size="small" weight="600" color={theme.Colors.grey[400]}>
          {label}
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    padding: 20,
    borderRadius: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  icon: {
    fontSize: 24,
  },
  value: {
    marginBottom: 4,
  },
});

export default StatsCard;
