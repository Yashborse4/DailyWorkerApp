/**
 * EmptyState Component
 * 
 * Displays friendly empty/error states with icon, title, description, and optional action.
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../hooks/useTheme';
import { Button } from './Button';

type EmptyStateVariant = 'empty' | 'error' | 'search' | 'offline' | 'success';

interface EmptyStateProps {
    /** Variant determines default icon and styling */
    variant?: EmptyStateVariant;
    /** Custom icon name (Ionicons) */
    icon?: string;
    /** Primary title */
    title: string;
    /** Secondary description */
    description?: string;
    /** Action button text */
    actionText?: string;
    /** Action button callback */
    onAction?: () => void;
    /** Secondary action text */
    secondaryActionText?: string;
    /** Secondary action callback */
    onSecondaryAction?: () => void;
    /** Custom container style */
    style?: ViewStyle;
    /** Compact mode for inline usage */
    compact?: boolean;
}

const VARIANT_CONFIG: Record<EmptyStateVariant, { icon: string; color: string }> = {
    empty: { icon: 'file-tray-outline', color: 'grey.500' },
    error: { icon: 'alert-circle-outline', color: 'error' },
    search: { icon: 'search-outline', color: 'grey.500' },
    offline: { icon: 'cloud-offline-outline', color: 'warning' },
    success: { icon: 'checkmark-circle-outline', color: 'success' },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
    variant = 'empty',
    icon,
    title,
    description,
    actionText,
    onAction,
    secondaryActionText,
    onSecondaryAction,
    style,
    compact = false,
}) => {
    const { theme } = useTheme();
    const colors = theme.Colors;

    const config = VARIANT_CONFIG[variant];
    const iconName = icon || config.icon;
    const iconColor = config.color === 'grey.500' ? colors.grey[500] : (colors as any)[config.color] || colors.grey[500];

    return (
        <View style={[styles.container, compact && styles.compact, style]}>
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor: iconColor + '15',
                    },
                    compact && styles.iconCompact,
                ]}
            >
                <Ionicons
                    name={iconName}
                    size={compact ? 32 : 48}
                    color={iconColor}
                />
            </View>

            <Text
                style={[
                    styles.title,
                    { color: colors.onBackground },
                    compact && styles.titleCompact,
                ]}
            >
                {title}
            </Text>

            {description && (
                <Text
                    style={[
                        styles.description,
                        { color: colors.grey[500] },
                        compact && styles.descriptionCompact,
                    ]}
                >
                    {description}
                </Text>
            )}

            {(actionText || secondaryActionText) && (
                <View style={[styles.actions, compact && styles.actionsCompact]}>
                    {actionText && onAction && (
                        <Button
                            title={actionText}
                            onPress={onAction}
                            variant="primary"
                            size={compact ? 'sm' : 'md'}
                        />
                    )}
                    {secondaryActionText && onSecondaryAction && (
                        <Button
                            title={secondaryActionText}
                            onPress={onSecondaryAction}
                            variant="outlined"
                            size={compact ? 'sm' : 'md'}
                            style={{ marginTop: compact ? 8 : 12 }}
                        />
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    compact: {
        flex: 0,
        padding: 24,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconCompact: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    titleCompact: {
        fontSize: 16,
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 280,
    },
    descriptionCompact: {
        fontSize: 13,
        maxWidth: 240,
    },
    actions: {
        marginTop: 24,
        alignItems: 'center',
    },
    actionsCompact: {
        marginTop: 16,
    },
});
