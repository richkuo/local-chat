import { useColorScheme } from 'react-native';

const light = {
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  secondary: '#8E8E93',
  separator: '#C6C6C8',
  accent: '#007AFF',
  onAccent: '#FFFFFF',
  bubbleIn: '#E9E9EB',
  bubbleInText: '#000000',
  bubbleOut: '#007AFF',
  bubbleOutText: '#FFFFFF',
  danger: '#FF3B30',
  success: '#34C759',
};

const dark: typeof light = {
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  secondary: '#8E8E93',
  separator: '#38383A',
  accent: '#0A84FF',
  onAccent: '#FFFFFF',
  bubbleIn: '#26252A',
  bubbleInText: '#FFFFFF',
  bubbleOut: '#0A84FF',
  bubbleOutText: '#FFFFFF',
  danger: '#FF453A',
  success: '#30D158',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
