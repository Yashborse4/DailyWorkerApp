import React, { useMemo } from 'react';
import {
    Pressable,
    StyleProp,
    ViewStyle,
    Platform,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    interpolate,
    interpolateColor,
} from 'react-native-reanimated';
import { hapticFeedback } from './MicroInteractionsModern';
import { useTheme } from '../../theme';

interface PremiumPressableProps {
    children: React.ReactNode;
    onPress?: () => void;
    onLongPress?: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;

    // Animation configs
    scaleTarget?: number;
    liftAmount?: number;
    glow?: boolean;
    bounce?: boolean;
    haptic?: 'light' | 'medium' | 'heavy' | 'none';

    // Custom glow color
    glowColor?: string;
}

const AnimatedView = Animated.createAnimatedComponent(Animated.View);

/**
 * PremiumPressable: A senior-grade interactive wrapper.
 * Delivers 60FPS fluid micro-animations using Reanimated 3.
 */
export const PremiumPressable: React.FC<PremiumPressableProps> = ({
    children,
    onPress,
    onLongPress,
    disabled = false,
    style,
    scaleTarget = 0.96,
    liftAmount = -4,
    glow = false,
    bounce = true,
    haptic = 'light',
    glowColor,
}) => {
    const { theme } = useTheme();

    // Shared values for high-performance animations
    const pressValue = useSharedValue(0); // 0 (normal) to 1 (pressed)

    // Configuration for springs (Physics-based premium feel)
    const springConfig = useMemo(() => ({
        damping: 15,
        stiffness: 150,
        mass: 0.6,
    }), []);

    const animatedStyle = useAnimatedStyle(() => {
        // 1. Bounce / Scale
        const scale = bounce
            ? withSpring(interpolate(pressValue.value, [0, 1], [1, scaleTarget]), springConfig)
            : 1;

        // 2. Lift / Shadow increase
        // We simulate shadow lift with translateY and shadow offset opacity/radius elsewhere if needed
        const translateY = withSpring(interpolate(pressValue.value, [0, 1], [0, liftAmount / 2]), springConfig);

        // 3. Border Glow / Color
        const borderColor = glow
            ? interpolateColor(
                pressValue.value,
                [0, 1],
                [theme.colors.transparent, glowColor || theme.colors.primary]
            )
            : undefined;

        return {
            transform: [{ scale }, { translateY }],
            borderColor: glow ? borderColor : undefined,
            borderWidth: glow ? 1 : 0,
            opacity: disabled ? 0.6 : 1,
        };
    });

    const handlePressIn = () => {
        if (disabled) return;
        if (haptic !== 'none') hapticFeedback[haptic]();
        pressValue.value = withTiming(1, { duration: 100 });
    };

    const handlePressOut = () => {
        if (disabled) return;
        pressValue.value = withSpring(0, springConfig);
    };

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={{ width: '100%' }} // Wrapper to ensure style applies correctly to animated view
        >
            <Animated.View style={[style, animatedStyle]}>
                {children}
            </Animated.View>
        </Pressable>
    );
};
