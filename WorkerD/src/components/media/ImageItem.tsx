import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';

import { scaleSize } from '../../utils/responsiveEnhanced';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageItemProps {
    source: string;
    blurHash?: string;
    isVisible: boolean;
    onClose: () => void;
}

const ImageItem: React.FC<ImageItemProps> = ({ source, isVisible }) => {
    const [isLoading, setIsLoading] = useState(true);
    const scale = useSharedValue(1);
    const focalX = useSharedValue(0);
    const focalY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    // Double Tap to Zoom
    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onStart((event) => {
            if (scale.value > 1) {
                // Reset to original
                scale.value = withSpring(1);
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            } else {
                // Zoom in
                scale.value = withSpring(2);
                // Adjust focal point (simplified for now)
            }
        });

    // Pinch Gesture
    const pinch = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = Math.max(1, event.scale);
        })
        .onEnd(() => {
            if (scale.value < 1.1) {
                scale.value = withSpring(1);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value }
            ],
            zIndex: scale.value > 1 ? 999 : 1, // Bring to front when zoomed
        };
    });

    const composed = Gesture.Race(doubleTap, pinch);

    return (
        <View style={styles.container}>
            <GestureDetector gesture={composed}>
                <Animated.View style={[styles.imageContainer, animatedStyle]}>
                    <FastImage
                        source={{ uri: source, priority: FastImage.priority.high }}
                        style={styles.image}
                        resizeMode={FastImage.resizeMode.contain}
                        onLoadStart={() => setIsLoading(true)}
                        onLoadEnd={() => setIsLoading(false)}
                    />
                    {isLoading && (
                        <View style={styles.loader}>
                            <ActivityIndicator size="large" color="#ffffff" />
                        </View>
                    )}
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    imageContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    loader: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ImageItem;
