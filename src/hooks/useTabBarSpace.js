import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_HEIGHT = 64;

export function tabBarBottom(insets) {
  return Math.max(insets.bottom, 12);
}

// The tab bar floats over content; tab screens pad their bottom by this much.
export function useTabBarSpace() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + tabBarBottom(insets) + 16;
}
