import React, { useState, useEffect } from 'react';
import { Animated, ActivityIndicator, View, StyleSheet, ImageStyle, ViewStyle, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '../../theme/ThemeContext';
import { imageError } from '../../assets/images/image-error';

interface AnimatedImageProps {
  source: { uri: string };
  style?: ImageStyle;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  fadeDuration?: number;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: () => void;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  source,
  style,
  resizeMode = 'cover',
  fadeDuration = 300,
  onLoadStart,
  onLoadEnd,
  onError,
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (!loading && !error) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: fadeDuration,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, error]);

  const handleLoadStart = () => {
    // Only set loading if not already loaded (though strict mode might reset)
    // We rely on onLoadEnd to clear this
  };

  const handleLoadEnd = () => {
    setLoading(false);
    onLoadEnd?.();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    onError?.();
  };

  // Safety timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [loading]);

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.placeholder, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Image
            source={{ uri: imageError }}
            style={styles.errorImage}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <FastImage
          source={source}
          style={styles.image}
          resizeMode={resizeMode}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
        />
      </Animated.View>

      {loading && (
        <View style={[styles.loadingOverlay, { backgroundColor: theme.colors.surfaceVariant }]}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorImage: {
    width: 40,
    height: 40,
    opacity: 0.5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
