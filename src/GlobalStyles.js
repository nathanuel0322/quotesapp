const _colorSet = {
  background: '#0A0B14',
  text: '#ffffff',
  primary1: '#0A0B14',
  primary2: '#FFFFFF',
  primary4: '#FF765E',
  secondary6: '#C2C4D4',
  accent1: '#F84263',
  white: '#FFFFFF',
  neutral5: '#D9D9D9',
  neutral11: '#1D202D',
  neutral12: '#0E111C',
  red7: '#E84749',
  red8: '#F37370',
  cyan6: '#13A8A8',
  blue6: '#177DDC',
};

// Colors that stay the same in light and dark mode.
const _brand = {
  primary: _colorSet.primary4,
  accent: _colorSet.blue6,
  accentAlt: _colorSet.accent1,
  danger: _colorSet.red7,
  dangerSoft: _colorSet.red8,
  success: '#29AB70',
  teal: _colorSet.cyan6,
  onAccent: _colorSet.white,   // text/icons drawn on primary, accent, danger or teal
  onPastel: '#0A0B14',         // text drawn on the light emotion swatches
  onImage: _colorSet.white,    // text/icons drawn straight onto photos
  storyRing: '#ffa41b',
};

// Per-mode palettes, read through useTheme().colors.
const _themes = {
  dark: {
    ..._brand,
    background: _colorSet.primary1,
    surface: _colorSet.neutral11,
    header: _colorSet.neutral12,
    text: _colorSet.white,
    textSecondary: _colorSet.secondary6,
    border: _colorSet.neutral5,
    input: _colorSet.white,
    inputText: _colorSet.primary1,
    placeholder: '#666666',
    overlay: 'rgba(10, 11, 20, 0.85)',
    glass: 'rgba(255, 255, 255, 0.1)',
    tabBar: _colorSet.primary1,
    tabBarShadowOpacity: 0.58,
    switchTrackOff: _colorSet.neutral11,
    blurTint: 'dark',
    statusBarStyle: 'light-content',
  },
  light: {
    ..._brand,
    background: '#FFFFFF',
    surface: '#F0F1F5',
    header: '#F6F7FA',
    text: _colorSet.primary1,
    textSecondary: '#5B5F73',
    border: '#9EA1B0',
    input: '#F0F1F5',
    inputText: _colorSet.primary1,
    placeholder: '#7A7D8C',
    overlay: 'rgba(255, 255, 255, 0.85)',
    glass: 'rgba(10, 11, 20, 0.06)',
    tabBar: '#FFFFFF',
    tabBarShadowOpacity: 0.15,
    switchTrackOff: '#D5D7DF',
    blurTint: 'light',
    statusBarStyle: 'dark-content',
  },
};

const _fontSet = {
  font: "Gilroy",
  fontbold: "Gilroy-Bold",
  fontsemibold: "Gilroy-SemiBold",
};

const visible = { display: 'flex', position: 'absolute', bottom: 25, left: 20, right: 20, elevation: 24,
  borderRadius: 25, height: 70, width: '91.4666667%', borderTopWidth: 0,
  shadowOffset: { width: 0, height: 12, }, shadowRadius: 16.0, opacity: 1,
}

const invisible = { display: 'none' }

const GlobalStyles = {
  colorSet: _colorSet,
  themes: _themes,
  fontSet: _fontSet,
  showTabBar: (colors) => ({ ...visible, backgroundColor: colors.tabBar, shadowOpacity: colors.tabBarShadowOpacity }),
  hideTabBar: invisible
};

export default GlobalStyles;
