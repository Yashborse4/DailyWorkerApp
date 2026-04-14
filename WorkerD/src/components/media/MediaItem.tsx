import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MediaAsset } from './types';
import ImageItem from './ImageItem';
import VideoItem from './VideoItem';

interface MediaItemProps {
    item: MediaAsset;
    isVisible: boolean;
    onClose: () => void;
}

const MediaItem: React.FC<MediaItemProps> = React.memo(({ item, isVisible, onClose }) => {
    if (item.type === 'video') {
        return (
            <VideoItem
                source={item.url}
                thumbnail={item.thumbnail}
                isVisible={isVisible}
                onClose={onClose}
            />
        );
    }

    return (
        <ImageItem
            source={item.url}
            blurHash={item.blurHash}
            isVisible={isVisible}
            onClose={onClose}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default MediaItem;
