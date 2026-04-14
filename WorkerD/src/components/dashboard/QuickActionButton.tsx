import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
  View,
} from 'react-native';
import { ThemedText } from '../common/ThemedText';
import { useTheme } from '../../hooks/useTheme';

interface QuickActionButtonProps {
  /** Emoji icon */
  icon: string;
  /** Button label */
  label: string;
  /** Background color (solid) */
  backgroundColor: string;
  /** Optional secondary color for gradient overlay effect */
  gradientColor?: string;
  /** Animation delay for stagger */
  delay?: number;
  /** Press callback */
  onPress?: () => void;
}

/**
 * Premium horizontal pill quick action button with gradient overlay,
 * spring press animation, and staggered entrance effect.
 */
export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
  backgroundColor,
  gradientColor,
  delay = 0,
  onPress,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 600,
        delay,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, fadeAnim, translateAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      tension: 300,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 8,
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
        style={[
          styles.button,
          {
            backgroundColor,
            ...Platform.select({
              ios: {
                shadowColor: backgroundColor,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 18,
              },
              android: {
                elevation: 8,
              },
            }),
          },
        ]}
      >
        {/* Gradient overlay simulation */}
        {gradientColor && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: gradientColor,
                opacity: 0.35,
                borderRadius: 32,
              },
            ]}
          />
        )}

        <View style={styles.contentRow}>
          <View style={styles.iconCircle}>
            <ThemedText style={styles.icon}>{icon}</ThemedText>
          </View>
          <ThemedText weight="700" style={styles.label}>
            {label}
          </ThemedText>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 32,
    overflow: 'hidden',
    minHeight: 100,
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  label: {
    color: '#fff',
    fontSize: 15,
    letterSpacing: 0.3,
    flex: 1,
  },
});

export default QuickActionButton;
