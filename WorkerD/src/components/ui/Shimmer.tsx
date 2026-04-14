import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface ShimmerProps {
  style?: any;
  duration?: number;
}

export const Shimmer: React.FC<ShimmerProps> = ({ style, duration = 1000 }) => {
  const { theme } = useTheme();
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerBackground = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.surfaceVariant, theme.colors.surface],
  });

  return (
    <Animated.View
      style={[
        styles.shimmer,
        {
          backgroundColor: shimmerBackground,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  shimmer: {
    width: '100%',
    height: '100%',
  },
});
