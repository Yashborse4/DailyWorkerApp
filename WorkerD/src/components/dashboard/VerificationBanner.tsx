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

interface VerificationBannerProps {
  /** Title text */
  title?: string;
  /** Subtitle text */
  subtitle?: string;
  /** CTA button label */
  ctaLabel?: string;
  /** CTA press callback */
  onPress?: () => void;
  /** Animation delay */
  delay?: number;
}

/**
 * Premium CTA banner for identity verification.
 * Features a softer gradient background, larger decorative circles,
 * pill-shaped CTA, and pulse animation on the shield icon.
 */
export const VerificationBanner: React.FC<VerificationBannerProps> = ({
  title = 'Verify Your Identity',
  subtitle = 'Unlock high-paying jobs & trusted badge.',
  ctaLabel = 'Verify Now',
  onPress,
  delay = 0,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle pulse on the icon
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    const timer = setTimeout(() => pulse.start(), delay + 600);
    return () => clearTimeout(timer);
  }, [delay, fadeAnim, scaleAnim, pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.banner,
          {
            backgroundColor: theme.Colors.primary,
            ...Platform.select({
              ios: {
                shadowColor: theme.Colors.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
              },
              android: {
                elevation: 10,
              },
            }),
          },
        ]}
      >
        {/* Decorative overlay circles (larger for premium feel) */}
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
        <View style={[styles.decorCircle, styles.decorCircle3]} />

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.iconBox,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <ThemedText style={styles.icon}>🛡️</ThemedText>
          </Animated.View>

          <View style={styles.textCol}>
            <ThemedText weight="800" style={styles.title}>
              {title}
            </ThemedText>
            <ThemedText weight="500" style={styles.subtitle}>
              {subtitle}
            </ThemedText>
          </View>

          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <ThemedText
              weight="700"
              color={theme.Colors.primary}
              style={styles.ctaText}
            >
              {ctaLabel}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  banner: {
    borderRadius: 28,
    padding: 22,
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  decorCircle1: {
    width: 140,
    height: 140,
    top: -40,
    right: -30,
  },
  decorCircle2: {
    width: 90,
    height: 90,
    bottom: -25,
    left: -15,
  },
  decorCircle3: {
    width: 60,
    height: 60,
    top: 20,
    right: 80,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 26,
  },
  textCol: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    lineHeight: 17,
  },
  ctaBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  ctaText: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
});

export default VerificationBanner;
