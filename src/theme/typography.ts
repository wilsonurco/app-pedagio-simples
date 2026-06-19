import { Platform, type TextStyle } from 'react-native';

const systemStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", system-ui, sans-serif';

type Weight = TextStyle['fontWeight'];

function weightStyle(weight: Weight): TextStyle {
  if (Platform.OS === 'web') {
    return { fontFamily: systemStack, fontWeight: weight };
  }
  return { fontWeight: weight };
}

export const fonts = {
  regular: weightStyle('400'),
  medium: weightStyle('500'),
  semibold: weightStyle('600'),
  bold: weightStyle('700'),
} as const;
