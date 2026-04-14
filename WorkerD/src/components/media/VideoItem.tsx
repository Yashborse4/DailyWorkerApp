import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import Video, { VideoRef, SelectedVideoTrackType } from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scaleSize } from '../../utils/responsiveEnhanced';
import FastImage from 'react-native-fast-image';

interface VideoItemProps {
    source: string;
    thumbnail?: string;
    isVisible: boolean;
    onClose: () => void;
}

const VideoItem: React.FC<VideoItemProps> = ({
    source,
    thumbnail,
    isVisible,
    onClose
}) => {
    const videoRef = useRef<VideoRef>(null);
    const [paused, setPaused] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [muted, setMuted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Auto-play/pause based on visibility and lifecycle
    useEffect(() => {
        if (isVisible) {
            setPaused(false);
        } else {
            setPaused(true);
        }

        // Cleanup: pause when component unmounts
        return () => {
            setPaused(true);
        };
    }, [isVisible]);

    return (
        <View style={styles.container}>
            {/* Thumbnail Poster (shown while loading or buffering) */}
            {(!isLoaded || isBuffering) && thumbnail && (
                <FastImage
                    source={{ uri: thumbnail }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="contain"
                />
            )}

            <Video
                ref={videoRef}
                source={{ uri: source }}
                style={styles.video}
                resizeMode="contain"
                paused={paused}
                muted={muted}
                repeat
                onLoad={() => {
                    setIsLoaded(true);
                    setIsBuffering(false);
                }}
                onBuffer={({ isBuffering: buffering }) => setIsBuffering(buffering)}
                onError={(e) => console.log('Video error:', e)}
                selectedVideoTrack={{
                    type: SelectedVideoTrackType.RESOLUTION,
                    value: 720
                }}
                ignoreSilentSwitch="ignore"
            />

            {/* Controls Overlay */}
            <TouchableOpacity
                style={styles.controls}
                activeOpacity={1}
                onPress={() => setPaused(!paused)}
            >
                {/* Close Button */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    <Ionicons name="close" size={30} color="#FFF" />
                </TouchableOpacity>

                {/* Mute Toggle */}
                <TouchableOpacity
                    style={styles.muteButton}
                    onPress={() => setMuted(!muted)}
                >
                    <Ionicons
                        name={muted ? "volume-mute" : "volume-high"}
                        size={24}
                        color="#FFF"
                    />
                </TouchableOpacity>

                {/* Play/Pause Indicator (only show if manually paused and visible) */}
                {paused && isVisible && !isBuffering && (
                    <View style={styles.playPauseIcon}>
                        <Ionicons name="play" size={50} color="rgba(255,255,255,0.8)" />
                    </View>
                )}

                {/* Buffering Indicator */}
                {isBuffering && (
                    <View style={styles.playPauseIcon}>
                        <ActivityIndicator size="large" color="#FFF" />
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    controls: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
        borderRadius: 20,
    },
    muteButton: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 25,
    },
    playPauseIcon: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 20,
        borderRadius: 50,
    }
});

export default VideoItem;
