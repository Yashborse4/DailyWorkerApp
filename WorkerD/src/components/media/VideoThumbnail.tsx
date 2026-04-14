import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CarMedia } from '../../types/media';

interface VideoThumbnailProps {
    media: CarMedia;
    onPlay: () => void;
    width: number;
    height: number;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ media, onPlay, width, height }) => {
    const { url, thumbnailUrl, status } = media;
    const isProcessing = status === 'PROCESSING' || status === 'UPLOADING';
    const hasError = status === 'FAILED';

    // Use thumbnailUrl if available, otherwise try the main video url (some libraries can extract frame, 
    // currently we just rely on what's passed or a placeholder if video url isn't an image)
    // Ideally, backend provides a separate thumbnail URL.
    const source = thumbnailUrl ? { uri: thumbnailUrl } : { uri: url };

    return (
        <View style={[styles.container, { width, height }]}>
            <Image
                source={source}
                style={[styles.image, { width, height }]}
                resizeMode="cover"
            />

            {/* Dark Overlay for contrast */}
            <View style={styles.overlay} />

            {/* Center Action */}
            <View style={styles.centerContainer}>
                {isProcessing ? (
                    <View style={styles.processingContainer}>
                        <ActivityIndicator size="large" color="#FFF" />
                    </View>
                ) : hasError ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={40} color="#FF5252" />
                    </View>
                ) : (
                    <TouchableOpacity onPress={onPlay} activeOpacity={0.8}>
                        <View style={styles.playButton}>
                            <Ionicons name="play" size={32} color="#FFF" style={{ marginLeft: 4 }} />
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            {/* Status Badge */}
            {isProcessing && (
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Processing Video...</Text>
                </View>
            )}
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    image: {
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    processingContainer: {
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10
    },
    errorContainer: {
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10
    },
    statusBadge: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600'
    }
});
