/**
 * ConfirmationModal Component
 * 
 * Standardized confirmation dialogs for destructive actions.
 * Uses Reanimated for smooth entrance/exit animations.
 */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ViewStyle,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { Button } from './Button';

type ConfirmationVariant = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmationModalProps {
    /** Show/hide the modal */
    visible: boolean;
    /** Modal title */
    title: string;
    /** Modal description/body */
    message: string;
    /** Visual variant affects icon and button color */
    variant?: ConfirmationVariant;
    /** Confirm button text */
    confirmText?: string;
    /** Cancel button text */
    cancelText?: string;
    /** Confirm callback */
    onConfirm: () => void;
    /** Cancel callback */
    onCancel: () => void;
    /** Loading state for confirm button */
    loading?: boolean;
    /** Custom icon (Ionicons name) */
    icon?: string;
    /** Custom container style */
    style?: ViewStyle;
}

const VARIANT_CONFIG: Record<ConfirmationVariant, { icon: string; buttonVariant: 'primary' | 'danger' }> = {
    danger: { icon: 'warning-outline', buttonVariant: 'danger' },
    warning: { icon: 'alert-circle-outline', buttonVariant: 'primary' },
    info: { icon: 'information-circle-outline', buttonVariant: 'primary' },
    success: { icon: 'checkmark-circle-outline', buttonVariant: 'primary' },
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    message,
    variant = 'danger',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    loading = false,
    icon,
    style,
}) => {
    const { theme } = useTheme();
    const { colors } = theme;

    const config = VARIANT_CONFIG[variant];
    const iconName = icon || config.icon;

    const getIconColor = (): string => {
        switch (variant) {
            case 'danger':
                return colors.error;
            case 'warning':
                return colors.warning;
            case 'success':
                return colors.success;
            default:
                return colors.info;
        }
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    style={[styles.backdrop, { backgroundColor: colors.backdrop }]}
                >
                    <TouchableWithoutFeedback>
                        <Animated.View
                            entering={SlideInDown.springify().damping(20).stiffness(200)}
                            exiting={SlideOutDown.duration(200)}
                            style={[
                                styles.modal,
                                { backgroundColor: colors.surface },
                                style,
                            ]}
                        >
                            {/* Icon */}
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: getIconColor() + '15' },
                                ]}
                            >
                                <Ionicons name={iconName} size={32} color={getIconColor()} />
                            </View>

                            {/* Content */}
                            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                            <Text style={[styles.message, { color: colors.textSecondary }]}>
                                {message}
                            </Text>

                            {/* Actions */}
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={[styles.cancelButton, { backgroundColor: colors.surfaceVariant }]}
                                    onPress={onCancel}
                                    disabled={loading}
                                >
                                    <Text style={[styles.cancelText, { color: colors.text }]}>
                                        {cancelText}
                                    </Text>
                                </TouchableOpacity>

                                <Button
                                    title={confirmText}
                                    onPress={onConfirm}
                                    loading={loading}
                                    variant="primary"
                                    style={{
                                        ...styles.confirmButton,
                                        ...(config.buttonVariant === 'danger' ? { backgroundColor: colors.error } : {}),
                                    }}
                                />
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modal: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 16,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '600',
    },
    confirmButton: {
        flex: 1,
    },
});
