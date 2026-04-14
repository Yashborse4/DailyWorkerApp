import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type TypographyType = 'headline' | 'title' | 'body' | 'label';
type TypographySize = 'small' | 'medium' | 'large';

interface ThemedTextProps extends TextProps {
  type?: TypographyType;
  size?: TypographySize;
  color?: string;
  weight?: '400' | '500' | '600' | '700' | '800' | 'bold' | 'normal';
  // Legacy support for backward compatibility during refactor
  variant?: 'header' | 'subheader' | 'body' | 'caption';
}

/**
 * A Text component that automatically applies themed colors and typography.
 */
export const ThemedText: React.FC<ThemedTextProps> = ({ 
  style, 
  type = 'body', 
  size = 'medium',
  variant,
  color,
  weight,
  ...props 
}) => {
  const { theme } = useTheme();

  // Map legacy variants to new types/sizes if needed
  let finalType = type;
  let finalSize = size;

  if (variant) {
    switch (variant) {
      case 'header':
        finalType = 'headline';
        finalSize = 'medium';
        break;
      case 'subheader':
        finalType = 'title';
        finalSize = 'medium';
        break;
      case 'body':
        finalType = 'body';
        finalSize = 'medium';
        break;
      case 'caption':
        finalType = 'label';
        finalSize = 'medium';
        break;
    }
  }

  const textStyle = [
    { color: color || theme.Colors.onBackground },
    theme.Typography[finalType][finalSize],
    weight && { fontWeight: weight },
    style,
  ];

  return <Text style={textStyle} {...props} />;
};

export default ThemedText;
