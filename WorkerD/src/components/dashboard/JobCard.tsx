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

interface JobCardProps {
  /** Job title */
  title: string;
  /** Location or subtitle */
  subtitle: string;
  /** Pay / salary display */
  pay?: string;
  /** Job type badge text (e.g. "Daily", "Full-time") */
  typeBadge?: string;
  /** Accent color */
  accentColor?: string;
  /** Animation delay for stagger */
  delay?: number;
  /** Press callback */
  onPress?: () => void;
  /** Optional icon emoji */
  icon?: string;
  /** Optional status text (for hirer cards) */
  status?: string;
  /** Status is active or not */
  statusActive?: boolean;
  /** Optional footer content (e.g. applicant count) */
  footerLabel?: string;
  /** Optional footer action */
  footerAction?: string;
  /** Footer action callback */
  onFooterAction?: () => void;
}

/**
 * Premium job listing card with squircle icon, frosted surface,
 * pill-shaped pay/status badges, and animated entrance.
 */
export const JobCard: React.FC<JobCardProps> = ({
  title,
  subtitle,
  pay,
  typeBadge,
  accentColor,
  delay = 0,
  onPress,
  icon = '🛠️',
  status,
  statusActive,
  footerLabel,
  footerAction,
  onFooterAction,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const accent = accentColor || theme.Colors.primary;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 500,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, fadeAnim, translateAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: translateAnim }, { scale: scaleAnim }],
      }}
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
            borderColor: theme.Colors.grey[100],
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
              },
              android: {
                elevation: 3,
              },
            }),
          },
        ]}
      >
        {/* Main row */}
        <View style={styles.mainRow}>
          <View style={[styles.iconBox, { backgroundColor: accent + '12' }]}>
            <ThemedText style={styles.iconText}>{icon}</ThemedText>
          </View>

          <View style={styles.infoCol}>
            <ThemedText type="title" size="small" weight="700">
              {title}
            </ThemedText>
            <ThemedText
              type="body"
              size="small"
              color={theme.Colors.grey[400]}
              weight="500"
              style={styles.subtitle}
            >
              {subtitle}
            </ThemedText>
          </View>

          <View style={styles.rightCol}>
            {pay && (
              <View style={[styles.payChip, { backgroundColor: accent + '12' }]}>
                <ThemedText type="label" size="small" weight="800" color={accent}>
                  {pay}
                </ThemedText>
              </View>
            )}
            {typeBadge && (
              <View style={[styles.typeBadge, { backgroundColor: theme.Colors.grey[100] }]}>
                <ThemedText type="label" size="small" weight="600" color={theme.Colors.grey[400]}>
                  {typeBadge}
                </ThemedText>
              </View>
            )}
            {status && (
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: statusActive ? '#E8F5E9' : '#FFEBEE',
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: statusActive ? '#2E7D32' : '#C62828' },
                  ]}
                />
                <ThemedText
                  type="label"
                  size="small"
                  weight="700"
                  color={statusActive ? '#2E7D32' : '#C62828'}
                >
                  {status}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Footer row (optional — for hirer cards) */}
        {(footerLabel || footerAction) && (
          <>
            <View style={[styles.divider, { backgroundColor: theme.Colors.grey[100] }]} />
            <View style={styles.footerRow}>
              {footerLabel && (
                <ThemedText type="body" size="small" weight="600" color={theme.Colors.grey[400]}>
                  {footerLabel}
                </ThemedText>
              )}
              {footerAction && onFooterAction && (
                <TouchableOpacity
                  onPress={onFooterAction}
                  activeOpacity={0.7}
                  style={[styles.footerBtn, { backgroundColor: accent + '14' }]}
                >
                  <ThemedText type="label" size="medium" weight="700" color={accent}>
                    {footerAction}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    marginBottom: 14,
    borderWidth: 1,
    padding: 20,
    overflow: 'hidden',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  infoCol: {
    flex: 1,
  },
  subtitle: {
    marginTop: 3,
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  payChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  typeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
    borderRadius: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
});

export default JobCard;
