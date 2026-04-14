import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ThemedViewProps extends ViewProps {
  useSecondaryBackground?: boolean;
}

/**
 * A View component that automatically applies the theme's background color.
 */
export const ThemedView: React.FC<ThemedViewProps> = ({ 
  style, 
  useSecondaryBackground = false,
  ...props 
}) => {
  const { theme } = useTheme();

  const viewStyle = [
    { 
      backgroundColor: useSecondaryBackground 
        ? theme.Colors.grey[100] 
        : theme.Colors.background 
    },
    style,
  ];

  return <View style={viewStyle} {...props} />;
};

export default ThemedView;
