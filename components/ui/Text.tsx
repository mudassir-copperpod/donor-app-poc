import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

interface CustomTextProps extends RNTextProps {
  weight?: 'regular' | 'semibold' | 'bold';
}

export const Text: React.FC<CustomTextProps> = ({ 
  style, 
  weight = 'regular',
  ...props 
}) => {
  const fontFamily = weight === 'bold' 
    ? 'SourceSans3_700Bold'
    : weight === 'semibold'
    ? 'SourceSans3_600SemiBold'
    : 'SourceSans3_400Regular';

  return (
    <RNText 
      style={[{ fontFamily }, style]} 
      {...props} 
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'SourceSans3_400Regular',
  },
});
