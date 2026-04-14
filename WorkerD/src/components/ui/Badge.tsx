/**
 * Badge Component
 * 
 * Displays status indicators, counts, or labels.
 * Supports multiple variants and can be used as a standalone or overlay.
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    /** Text or number to display */
    content?: string | number;
    /** Visual variant */
    variant?: BadgeVariant;
    /** Size preset */
    size?: BadgeSize;
    /** Show as a dot (no content) */
    dot?: boolean;
    /** Max number before showing "99+" */
    max?: number;
    /** Custom container style */
    style?: ViewStyle;
    /** Custom text style */
    textStyle?: TextStyle;
    /** Children to wrap (badge appears as overlay) */
    children?: React.ReactNode;
}

const SIZE_CONFIG = {
    sm: { padding: 2, fontSize: 10, minWidth: 16, dotSize: 6 },
    md: { padding: 4, fontSize: 11, minWidth: 18, dotSize: 8 },
    lg: { padding: 6, fontSize: 12, minWidth: 22, dotSize: 10 },
};

export const Badge: React.FC<BadgeProps> = ({
    content,
    variant = 'primary',
    size = 'md',
    dot = false,
    max = 99,
    style,
    textStyle,
    children,
}) => {
    const { theme } = useTheme();
    const { colors } = theme;

    const config = SIZE_CONFIG[size];

    const getVariantColors = (): { bg: string; text: string } => {
        switch (variant) {
            case 'success':
                return { bg: colors.success, text: colors.onSuccess };
            case 'warning':
                return { bg: colors.warning, text: colors.onWarning };
            case 'error':
                return { bg: colors.error, text: colors.onError };
            case 'info':
                return { bg: colors.info, text: colors.onInfo };
            case 'neutral':
                return { bg: colors.surfaceVariant, text: colors.textSecondary };
            default:
                return { bg: colors.primary, text: colors.onPrimary };
        }
    };

    const variantColors = getVariantColors();

    const formatContent = (): string => {
        if (typeof content === 'number' && content > max) {
            return `${max}+`;
        }
        return String(content ?? '');
    };

    const badgeElement = (
        <View
            style={[
                styles.badge,
                dot
                    ? {
                        width: config.dotSize,
                        height: config.dotSize,
                        borderRadius: config.dotSize / 2,
                    }
                    : {
                        minWidth: config.minWidth,
                        paddingHorizontal: config.padding + 4,
                        paddingVertical: config.padding,
                        borderRadius: config.minWidth / 2,
                    },
                { backgroundColor: variantColors.bg },
                children ? styles.overlay : null,
                style,
            ]}
        >
            {!dot && (
                <Text
                    style={[
                        styles.text,
                        { fontSize: config.fontSize, color: variantColors.text },
                        textStyle,
                    ]}
                >
                    {formatContent()}
                </Text>
            )}
        </View>
    );

    if (children) {
        return (
            <View style={styles.wrapper}>
                {children}
                {badgeElement}
            </View>
        );
    }

    return badgeElement;
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
    },
    badge: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: -4,
        right: -4,
    },
    text: {
        fontWeight: '700',
        textAlign: 'center',
    },
});
