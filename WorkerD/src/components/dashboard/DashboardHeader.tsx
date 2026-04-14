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

interface DashboardHeaderProps {
  /** User's full name */
  name: string;
  /** Subtitle line (e.g. location, role) */
  subtitle: string;
  /** Greeting prefix emoji */
  emoji?: string;
  /** Avatar background tint color */
  avatarColor?: string;
  /** Avatar icon/emoji */
  avatarIcon?: string;
  /** Show notification bell */
  showNotificationBell?: boolean;
  /** Notification count */
  notificationCount?: number;
  /** Callback when avatar is pressed */
  onAvatarPress?: () => void;
  /** Callback when bell is pressed */
  onNotificationPress?: () => void;
}

/**
 * Premium dashboard header with time-aware greeting, gradient-ring avatar,
 * frosted-glass notification bell, and slide-down entrance animation.
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  name,
  subtitle,
  emoji,
  avatarColor,
  avatarIcon = '👤',
  showNotificationBell = false,
  notificationCount = 0,
  onAvatarPress,
  onNotificationPress,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const getGreeting = (): { primary: string; secondary: string } => {
    const hour = new Date().getHours();
    if (hour < 12) return { primary: 'Good Morning', secondary: 'सुप्रभात' };
    if (hour < 17) return { primary: 'Good Afternoon', secondary: 'शुभ दोपहर' };
    return { primary: 'Good Evening', secondary: 'शुभ संध्या' };
  };

  const firstName = name.split(' ')[0] || 'User';
  const tintColor = avatarColor || theme.Colors.primary;
  const greeting = getGreeting();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.textCol}>
        <ThemedText
          type="body"
          size="medium"
          color={theme.Colors.grey[400]}
          weight="500"
          style={styles.greetingLabel}
        >
          {greeting.primary} {emoji || '👋'}
        </ThemedText>
        <ThemedText
          type="label"
          size="small"
          color={theme.Colors.grey[400]}
          weight="500"
          style={{ marginBottom: 2, opacity: 0.8 }}
        >
          {greeting.secondary}
        </ThemedText>
        <ThemedText type="headline" size="small" weight="800" style={styles.nameText}>
          {firstName}
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
        {showNotificationBell && (
          <TouchableOpacity
            style={[
              styles.bellBtn,
              {
                backgroundColor: theme.Colors.grey[100],
                borderColor: theme.Colors.grey[200],
              },
            ]}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.bellIcon}>🔔</ThemedText>
            {notificationCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.Colors.error }]}>
                <ThemedText style={styles.badgeText}>
                  {notificationCount > 9 ? '9+' : String(notificationCount)}
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Avatar with gradient ring effect */}
        <TouchableOpacity
          onPress={onAvatarPress}
          activeOpacity={0.8}
          style={[
            styles.avatarRing,
            {
              borderColor: tintColor + '40',
              ...Platform.select({
                ios: {
                  shadowColor: tintColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 10,
                },
                android: { elevation: 4 },
              }),
            },
          ]}
        >
          <View style={[styles.avatarInner, { backgroundColor: tintColor + '18' }]}>
            <ThemedText style={styles.avatarIcon}>{avatarIcon}</ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      {/* Subtle bottom separator */}
      <View style={[styles.separator, { backgroundColor: theme.Colors.grey[100] }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 54,
    marginBottom: 24,
    paddingBottom: 20,
  },
  textCol: {
    flex: 1,
    marginRight: 12,
  },
  greetingLabel: {
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  nameText: {
    marginBottom: 2,
  },
  subtitle: {
    letterSpacing: 0.2,
  },
  rightCol: {
    position: 'absolute',
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellBtn: {
    width: 48,
    height: 48,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  bellIcon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 22,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 24,
  },
  separator: {
    height: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.6,
  },
});

export default DashboardHeader;
