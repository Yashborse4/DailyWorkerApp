import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    StatusBar,
    Platform,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

import { useTheme } from '../../theme';
import { scaleSize, getResponsiveSpacing } from '../../utils/responsiveEnhanced';
import MediaItem from './MediaItem';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface MediaAsset {
    id: string | number;
    url: string;
    type: 'image' | 'video';
    thumbnail?: string; // For videos
    blurHash?: string; // For images
}

interface CarMediaViewerProps {
    visible: boolean;
    initialIndex?: number;
    media: MediaAsset[];
    onClose: () => void;
}

const CarMediaViewer: React.FC<CarMediaViewerProps> = ({
    visible,
    initialIndex = 0,
    media,
    onClose,
}) => {
    const { theme, isDark } = useTheme();
    const { colors } = theme;
    const insets = useSafeAreaInsets();
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const flatListRef = useRef<FlatList>(null);

    // Track visibility for sub-components (videos should play only when visible)
    const [isViewerVisible, setIsViewerVisible] = useState(visible);

    useEffect(() => {
        setIsViewerVisible(visible);
        if (visible) {
            setCurrentIndex(initialIndex);
            // Small timeout to allow layout to happen before scrolling
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index: initialIndex,
                    animated: false,
                });
            }, 50);
        }
    }, [visible, initialIndex]);

    // Gestures for swipe-to-close
    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            if (event.translationY > 0) { // Only swipe down
                translateY.value = event.translationY + context.value.y;
            }
        })
        .onEnd((event) => {
            if (event.translationY > 150) {
                runOnJS(onClose)();
            } else {
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        // Dim background based on swipe distance
        const opacity = 1 - Math.min(translateY.value / (SCREEN_HEIGHT / 2), 1);
        return {
            transform: [{ translateY: translateY.value }],
            backgroundColor: `rgba(0,0,0,${opacity})`,
        };
    });

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }, []);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    // Render Logic
    const renderItem = useCallback(({ item, index }: { item: MediaAsset; index: number }) => {
        return (
            <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center' }}>
                <MediaItem
                    item={item}
                    isVisible={index === currentIndex && isViewerVisible}
                    onClose={onClose}
                />
            </View>
        );
    }, [currentIndex, isViewerVisible, onClose]);

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none" // We handle animations with Reanimated
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <GestureHandlerRootView style={styles.container}>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.backdrop, animatedStyle]}>
                        <StatusBar barStyle="light-content" backgroundColor="black" />

                        {/* Header / Controls */}
                        <View style={[styles.header, { top: insets.top + 10 }]}>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={28} color="#FFFFFF" />
                            </TouchableOpacity>

                            <View style={styles.counterContainer}>
                                <Text style={styles.counterText}>
                                    {currentIndex + 1} / {media.length}
                                </Text>
                            </View>

                            {/* Placeholder right action - maybe Share or Menu */}
                            <View style={{ width: 40 }} />
                        </View>

                        {/* Main Carousel */}
                        <FlatList
                            ref={flatListRef}
                            data={media}
                            keyExtractor={(item, index) => `${item.id}-${index}`}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderItem}
                            onViewableItemsChanged={onViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                            getItemLayout={(_, index) => ({
                                length: SCREEN_WIDTH,
                                offset: SCREEN_WIDTH * index,
                                index,
                            })}
                            initialNumToRender={2}
                            maxToRenderPerBatch={2}
                            windowSize={3}
                            removeClippedSubviews={false} // Needed for video stability often
                        />

                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    closeButton: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    counterContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 15,
    },
    counterText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default CarMediaViewer;
