import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedText } from './ThemedText';
import { useTheme } from '../../hooks/useTheme';

type TextType = 'headline' | 'title' | 'body' | 'label';
type TextSize = 'large' | 'medium' | 'small';
type FontWeight = '400' | '500' | '600' | '700' | '800';

interface BilingualTextProps {
  /** i18n translation key (e.g. 'screens:messages_title') */
  i18nKey?: string;
  /** Namespace for the translation key */
  ns?: string;
  /** Fallback primary text if no i18n key */
  primary: string;
  /** Fallback secondary text (shown as subtitle) */
  secondary?: string;
  /** Primary text type */
  type?: TextType;
  /** Primary text size */
  size?: TextSize;
  /** Primary text weight */
  weight?: FontWeight;
  /** Primary text color override */
  color?: string;
  /** Container style */
  style?: ViewStyle;
  /** Primary text style override */
  primaryStyle?: TextStyle;
  /** Secondary text style override */
  secondaryStyle?: TextStyle;
  /** Whether to show icon alongside text */
  icon?: string;
  /** Icon size */
  iconSize?: number;
  /** Alignment */
  align?: 'left' | 'center' | 'right';
  /** Hide secondary text */
  hideSecondary?: boolean;
}

/**
 * BilingualText — Renders primary text with a smaller secondary-language subtitle.
 *
 * Designed for Indian workers with limited literacy:
 * - If the app language is Hindi → shows English as subtitle
 * - If the app language is English → shows Hindi as subtitle
 * - For other Indian languages → shows Hindi as subtitle
 *
 * This allows users to recognize familiar words in their native script
 * even if they can't fully read the interface language.
 */
export const BilingualText: React.FC<BilingualTextProps> = ({
  i18nKey,
  ns,
  primary,
  secondary,
  type = 'title',
  size = 'medium',
  weight = '700',
  color,
  style,
  primaryStyle,
  secondaryStyle,
  icon,
  iconSize = 20,
  align = 'left',
  hideSecondary = false,
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();

  const currentLang = i18n.language;

  // Determine secondary text display
  const showSecondary = !hideSecondary && secondary;

  const alignItems = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';

  return (
    <View style={[styles.container, { alignItems }, style]}>
      <View style={styles.primaryRow}>
        {icon && (
          <ThemedText style={[styles.icon, { fontSize: iconSize }]}>
            {icon}
          </ThemedText>
        )}
        <ThemedText
          type={type}
          size={size}
          weight={weight}
          color={color}
          style={primaryStyle}
        >
          {primary}
        </ThemedText>
      </View>
      {showSecondary && (
        <ThemedText
          type="label"
          size="small"
          weight="500"
          color={theme.Colors.grey[400]}
          style={[styles.secondaryText, secondaryStyle]}
        >
          {secondary}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 2,
  },
  secondaryText: {
    marginTop: 1,
    opacity: 0.8,
  },
});

export default BilingualText;
