import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '../common/ThemedText';
import { useTheme } from '../../hooks/useTheme';

interface SectionHeaderProps {
  /** Section title text */
  title: string;
  /** Secondary language subtitle */
  subtitle?: string;
  /** Optional action label (e.g. "See All") */
  actionLabel?: string;
  /** Callback when action is pressed */
  onActionPress?: () => void;
  /** Override the action text color */
  actionColor?: string;
}

/**
 * Reusable section header with accent underline, title,
 * optional bilingual subtitle, and pill-shaped "See All" action button.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  actionColor,
}) => {
  const { theme } = useTheme();
  const accent = actionColor || theme.Colors.primary;

  return (
    <View style={styles.container}>
      <View style={styles.titleCol}>
        <ThemedText type="title" size="medium" weight="800">
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText type="label" size="small" weight="500" color={theme.Colors.grey[400]}>
            {subtitle}
          </ThemedText>
        )}
        <View style={[styles.underline, { backgroundColor: accent }]} />
      </View>

      {actionLabel && onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.7}
          style={[styles.actionPill, { backgroundColor: accent + '14' }]}
        >
          <ThemedText type="label" size="medium" weight="700" color={accent}>
            {actionLabel}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 4,
  },
  titleCol: {
    flexDirection: 'column',
  },
  underline: {
    width: 28,
    height: 3,
    borderRadius: 2,
    marginTop: 6,
  },
  actionPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
});

export default SectionHeader;
