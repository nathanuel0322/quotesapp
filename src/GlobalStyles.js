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

const _fontSet = {
  font: "Gilroy",
  fontbold: "Gilroy-Bold",
  fontsemibold: "Gilroy-SemiBold",
};

const visible = { display: 'flex', position: 'absolute', bottom: 25, left: 20, right: 20, elevation: 24,
  backgroundColor: _colorSet.primary1, borderRadius: 25, height: 70, width: '91.4666667%',
  shadowOffset: { width: 0, height: 12, }, shadowOpacity: 0.58, shadowRadius: 16.0, opacity: 1,
}

const invisible = { display: 'none' }

export default GlobalStyles = {
  colorSet: _colorSet,
  fontSet: _fontSet,
  showTabBar: visible,
  hideTabBar: invisible
};
