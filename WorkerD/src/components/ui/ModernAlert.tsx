import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Animated,
    Easing,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type AlertVariant = 'success' | 'error' | 'warning' | 'info' | 'question';

interface ModernAlertProps {
    visible: boolean;
    title: string;
    message?: string;
    variant?: AlertVariant;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
}

/**
 * Premium Minimalist Alert component.
 * Features a clean, production-grade aesthetic inspired by modern native styles 
 * without overly flashy animations or heavy gradients.
 */
const ModernAlert: React.FC<ModernAlertProps> = ({
    visible,
    title,
    message,
    variant = 'info',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    showCancel = true,
}) => {
    const { isDark } = useTheme();

    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(progress, {
                toValue: 1,
                duration: 250,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(progress, {
                toValue: 0,
                duration: 200,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        }
    }, [visible, progress]);

    const backdropOpacity = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const containerScale = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.95, 1],
        extrapolate: 'clamp',
    });

    if (!visible) return null;

    const variants: Record<AlertVariant, { icon: string; color: string }> = {
        success: { icon: 'checkmark-circle-outline', color: '#34C759' },
        error: { icon: 'close-circle-outline', color: '#FF3B30' },
        warning: { icon: 'warning-outline', color: '#FFCC00' },
        info: { icon: 'information-circle-outline', color: '#007AFF' },
        question: { icon: 'help-circle-outline', color: '#5856D6' },
    };

    const v = variants[variant];
    const surface = isDark ? '#1C1C1E' : '#FFFFFF';
    const titleColor = isDark ? '#FFFFFF' : '#000000';
    const messageColor = isDark ? '#AEAEB2' : '#3C3C43';
    const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const btnTextColor = isDark ? '#0A84FF' : '#007AFF';
    const cancelTextColor = isDark ? '#FF453A' : '#FF3B30'; // For critical actions like delete

    return (
        <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onCancel}>
                    <Animated.View style={[StyleSheet.absoluteFill, { opacity: backdropOpacity, backgroundColor: 'rgba(0,0,0,0.4)' }]} />
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.card, { opacity: backdropOpacity, transform: [{ scale: containerScale }], backgroundColor: surface }]}>
                    <View style={styles.content}>
                        <Ionicons name={v.icon} size={32} color={v.color} style={styles.icon} />
                        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
                        {message ? <Text style={[styles.message, { color: messageColor }]}>{message}</Text> : null}
                    </View>

                    <View style={[styles.actionBar, { borderTopColor: borderColor }]}>
                        {showCancel && (
                            <>
                                <TouchableOpacity
                                    style={styles.actionBtn}
                                    onPress={onCancel}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.actionBtnText, { color: cancelTextColor, fontWeight: '400' }]}>
                                        {cancelText}
                                    </Text>
                                </TouchableOpacity>
                                <View style={[styles.verticalDivider, { backgroundColor: borderColor }]} />
                            </>
                        )}
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={onConfirm}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.actionBtnText, { color: btnTextColor, fontWeight: '600' }]}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: SCREEN_WIDTH * 0.75,
        maxWidth: 320,
        borderRadius: 14,
        overflow: 'hidden',
        // Minimal subtle shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    content: {
        paddingTop: 24,
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    icon: {
        marginBottom: 12,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 6,
        letterSpacing: -0.4,
    },
    message: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
        fontWeight: '400',
        letterSpacing: -0.1,
    },
    actionBar: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
        height: 44,
    },
    verticalDivider: {
        width: StyleSheet.hairlineWidth,
        height: '100%',
    },
    actionBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionBtnText: {
        fontSize: 17,
        letterSpacing: -0.4,
    },
});

export default ModernAlert;

