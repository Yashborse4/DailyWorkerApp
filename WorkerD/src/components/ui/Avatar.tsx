/**
 * Avatar Component
 * 
 * Displays user avatars with fallback to initials.
 * Supports multiple sizes and optional online status indicator.
 */
import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ImageSourcePropType,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    /** Image URL or require() source */
    source?: string | ImageSourcePropType;
    /** Fallback name for initials (e.g., "John Doe" -> "JD") */
    name?: string;
    /** Size preset */
    size?: AvatarSize;
    /** Custom size in pixels (overrides size preset) */
    customSize?: number;
    /** Show online status indicator */
    showStatus?: boolean;
    /** Online/offline status */
    isOnline?: boolean;
    /** Custom container style */
    style?: ViewStyle;
    /** Accessibility label override */
    accessibilityLabel?: string;
}

const SIZE_MAP: Record<AvatarSize, number> = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
};

const FONT_SIZE_MAP: Record<AvatarSize, number> = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 20,
    xl: 28,
};

export const Avatar: React.FC<AvatarProps> = ({
    source,
    name,
    size = 'md',
    customSize,
    showStatus = false,
    isOnline = false,
    style,
    accessibilityLabel,
}) => {
    const { theme } = useTheme();
    const { colors } = theme;

    const dimension = customSize || SIZE_MAP[size];
    const fontSize = customSize ? customSize * 0.35 : FONT_SIZE_MAP[size];
    const statusSize = Math.max(dimension * 0.25, 8);

    const getInitials = (fullName: string): string => {
        const parts = fullName.trim().split(/\s+/);
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const hasImage = typeof source === 'string' ? source.length > 0 : !!source;
    const initials = name ? getInitials(name) : '?';

    // Generate consistent background color from name
    const getBackgroundColor = (str: string): string => {
        const backgroundColors = [
            colors.primary,
            '#3498db',
            '#e74c3c',
            '#2ecc71',
            '#f39c12',
            '#9b59b6',
            '#1abc9c',
        ];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return backgroundColors[Math.abs(hash) % backgroundColors.length];
    };

    // Build accessibility label
    const a11yLabel = accessibilityLabel || (name
        ? `${name}'s avatar${showStatus ? (isOnline ? ', online' : ', offline') : ''}`
        : 'User avatar');

    return (
        <View
            accessible
            accessibilityRole="image"
            accessibilityLabel={a11yLabel}
            style={[
                styles.container,
                {
                    width: dimension,
                    height: dimension,
                    borderRadius: dimension / 2,
                    backgroundColor: hasImage ? colors.surfaceVariant : getBackgroundColor(name || ''),
                },
                style,
            ]}
        >
            {hasImage ? (
                <Image
                    source={typeof source === 'string' ? { uri: source } : source}
                    style={[
                        styles.image,
                        { width: dimension, height: dimension, borderRadius: dimension / 2 },
                    ]}
                    resizeMode="cover"
                />
            ) : (
                <Text style={[styles.initials, { fontSize, color: colors.onPrimary }]}>
                    {initials}
                </Text>
            )}

            {showStatus && (
                <View
                    style={[
                        styles.statusIndicator,
                        {
                            width: statusSize,
                            height: statusSize,
                            borderRadius: statusSize / 2,
                            backgroundColor: isOnline ? colors.success : colors.textSecondary,
                            borderColor: colors.surface,
                            borderWidth: 2,
                        },
                    ]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        backgroundColor: 'transparent',
    },
    initials: {
        fontWeight: '700',
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
});
