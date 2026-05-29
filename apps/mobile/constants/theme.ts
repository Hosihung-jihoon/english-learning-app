/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

const baseFont = Platform.select({
  web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  default: 'System',
});

export const Fonts = {
  regular: baseFont,
  medium: baseFont,
  semiBold: baseFont,
  bold: baseFont,
  sans: baseFont,
  serif: Platform.select({ web: "Georgia, 'Times New Roman', serif", default: 'serif' }) || 'serif',
  rounded: Platform.select({ web: "'SF Pro Rounded', sans-serif", default: 'System' }) || 'System',
  mono: Platform.select({ web: "monospace", default: 'monospace' }) || 'monospace',
};
