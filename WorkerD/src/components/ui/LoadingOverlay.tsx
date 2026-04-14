/**
 * LoadingOverlay Component
 * 
 * Full-screen or inline loading indicator with optional message.
 * Uses Reanimated for smooth fade animations.
 */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Modal,
    ViewStyle,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

interface LoadingOverlayProps {
    /** Show/hide the overlay */
    visible: boolean;
    /** Loading message */
    message?: string;
    /** Use as full-screen modal */
    fullScreen?: boolean;
    /** Show transparent backdrop */
    transparent?: boolean;
    /** Custom container style */
    style?: ViewStyle;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    visible,
    message,
    fullScreen = true,
    transparent = true,
    style,
}) => {
    const { theme } = useTheme();
    const { colors } = theme;

    const pulseScale = useSharedValue(1);

    React.useEffect(() => {
        if (visible) {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.1, { duration: 600 }),
                    withTiming(1, { duration: 600 })
                ),
                -1,
                true
            );
        }
    }, [visible, pulseScale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    const content = (
        <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={[
                styles.container,
                {
                    backgroundColor: transparent
                        ? colors.backdrop
                        : colors.background,
                },
                style,
            ]}
        >
            <View
                style={[
                    styles.card,
                    { backgroundColor: colors.surface },
                ]}
            >
                <Animated.View style={animatedStyle}>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />
                </Animated.View>
                {message && (
                    <Text
                        style={[
                            styles.message,
                            { color: colors.text },
                        ]}
                    >
                        {message}
                    </Text>
                )}
            </View>
        </Animated.View>
    );

    if (!visible) return null;

    if (fullScreen) {
        return (
            <Modal
                visible={visible}
                transparent
                animationType="none"
                statusBarTranslucent
            >
                {content}
            </Modal>
        );
    }

    return content;
};

/**
 * Inline Skeleton Loader
 * For use in lists and cards while content is loading
 */
interface SkeletonProps {
    width?: number | `${number}%`;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 16,
    borderRadius = 4,
    style,
}) => {
    const { theme } = useTheme();
    const { colors } = theme;

    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 800 }),
                withTiming(0.3, { duration: 800 })
            ),
            -1,
            true
        );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: colors.surfaceVariant,
                },
                animatedStyle,
                style,
            ]}
        />
    );
};

/**
 * Card Skeleton - Pre-built skeleton for car/item cards
 */
export const CardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => {
    const { theme } = useTheme();
    const { colors } = theme;

    return (
        <View
            style={[
                styles.cardSkeleton,
                { backgroundColor: colors.surface, borderColor: colors.border },
                style,
            ]}
        >
            <Skeleton height={160} borderRadius={8} />
            <View style={styles.cardSkeletonContent}>
                <Skeleton width="70%" height={18} />
                <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
                <Skeleton width="50%" height={20} style={{ marginTop: 12 }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    card: {
        paddingVertical: 24,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    message: {
        marginTop: 16,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    cardSkeleton: {
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
    },
    cardSkeletonContent: {
        padding: 12,
    },
});
