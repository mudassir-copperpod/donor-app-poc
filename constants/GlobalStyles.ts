import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  text: {
    fontFamily: 'SourceSans3_400Regular',
  },
  textSemiBold: {
    fontFamily: 'SourceSans3_600SemiBold',
  },
  textBold: {
    fontFamily: 'SourceSans3_700Bold',
  },
});

// Default font configuration for Text components
export const defaultFontConfig = {
  regular: 'SourceSans3_400Regular',
  semiBold: 'SourceSans3_600SemiBold',
  bold: 'SourceSans3_700Bold',
};
