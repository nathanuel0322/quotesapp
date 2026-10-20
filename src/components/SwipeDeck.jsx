import React, { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { fonts } from '../theme/ThemeProvider';

// Tinder-style stack showing quotes[0] on top. onSwipe(quote, 'left' | 'right') should remove it from `quotes`.
const SwipeDeck = forwardRef(function SwipeDeck({ quotes, onSwipe, renderCard }, ref) {
  const { width } = useWindowDimensions();
  const pan = useRef(new Animated.ValueXY()).current;
  const animating = useRef(false);
  const latest = useRef(null);
  latest.current = { quotes, onSwipe, width };
  const topId = quotes[0]?.id;

  // reset before paint so the next card doesn't flash at the old offset
  useLayoutEffect(() => {
    pan.setValue({ x: 0, y: 0 });
    animating.current = false;
  }, [topId, pan]);

  // reads everything through `latest`, so it never needs to change identity
  const fling = useCallback((direction, dy = 0) => {
    const { quotes, onSwipe, width } = latest.current;
    const quote = quotes[0];
    if (!quote || animating.current) return;
    animating.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    Animated.timing(pan, {
      toValue: { x: (direction === 'right' ? 1 : -1) * width * 1.4, y: dy },
      duration: 220,
      useNativeDriver: false,
    }).start(() => onSwipe(quote, direction));
  }, [pan]);

  useImperativeHandle(ref, () => ({ swipe: (direction) => fling(direction) }));

  const responder = useMemo(
    () =>
      PanResponder.create({
        // let taps through to the card (author link, mute button); only claim horizontal drags
        onMoveShouldSetPanResponder: (_, g) => !animating.current && Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
        onPanResponderRelease: (_, g) => {
          const threshold = latest.current.width * 0.28;
          if (g.dx > threshold || g.vx > 0.8) fling('right', g.dy);
          else if (g.dx < -threshold || g.vx < -0.8) fling('left', g.dy);
          else Animated.spring(pan, { toValue: { x: 0, y: 0 }, friction: 5, useNativeDriver: false }).start();
        },
        onPanResponderTerminate: () => Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start(),
      }),
    [pan, fling]
  );

  const rotate = pan.x.interpolate({ inputRange: [-width, 0, width], outputRange: ['-12deg', '0deg', '12deg'] });
  const likeOpacity = pan.x.interpolate({ inputRange: [0, width / 4], outputRange: [0, 1], extrapolate: 'clamp' });
  const nopeOpacity = pan.x.interpolate({ inputRange: [-width / 4, 0], outputRange: [1, 0], extrapolate: 'clamp' });
  const nextScale = pan.x.interpolate({ inputRange: [-width / 2, 0, width / 2], outputRange: [1, 0.94, 1], extrapolate: 'clamp' });

  const visible = quotes.slice(0, 2);

  return (
    <View style={styles.deck}>
      {visible
        .map((quote, i) => {
          const isTop = i === 0;
          if (!isTop) {
            return (
              <Animated.View key={quote.id} style={[StyleSheet.absoluteFill, { transform: [{ scale: nextScale }] }]} pointerEvents="none">
                {renderCard(quote, false)}
              </Animated.View>
            );
          }
          return (
            <Animated.View
              key={quote.id}
              {...responder.panHandlers}
              style={[StyleSheet.absoluteFill, { transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }] }]}
            >
              {renderCard(quote, true)}
              <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]} pointerEvents="none">
                <Text style={[styles.stampText, { color: '#2ECC71' }]}>LIKE</Text>
              </Animated.View>
              <Animated.View style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]} pointerEvents="none">
                <Text style={[styles.stampText, { color: '#E84749' }]}>NOPE</Text>
              </Animated.View>
            </Animated.View>
          );
        })
        .reverse()}
    </View>
  );
});

export default SwipeDeck;

const styles = StyleSheet.create({
  deck: { flex: 1 },
  stamp: {
    position: 'absolute',
    top: 70,
    borderWidth: 4,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  likeStamp: { left: 28, borderColor: '#2ECC71', transform: [{ rotate: '-18deg' }] },
  nopeStamp: { right: 28, borderColor: '#E84749', transform: [{ rotate: '18deg' }] },
  stampText: { fontFamily: fonts.bold, fontSize: 34, letterSpacing: 2 },
});
