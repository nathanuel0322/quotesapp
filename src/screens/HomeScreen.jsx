import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Toast } from 'toastify-react-native';
import { useAuth } from '../context/AuthProvider';
import { useStyles, useTheme } from '../theme/ThemeProvider';
import { fetchFeed, likeQuote, passQuote, resetPassed } from '../services/quotes';
import { usePreviewPlayer } from '../hooks/usePreviewPlayer';
import { moodFor, MOODS } from '../constants/moods';
import { useTabBarSpace } from '../hooks/useTabBarSpace';
import SwipeDeck from '../components/SwipeDeck';
import QuoteCard from '../components/QuoteCard';
import { MoodFilter } from '../components/MoodChips';
import { Button, EmptyState, Loading } from '../components/ui';

export default function HomeScreen({ navigation }) {
  const { profile } = useAuth();
  const { colors } = useTheme();
  const s = useStyles(styles);
  const tabSpace = useTabBarSpace();
  const isFocused = useIsFocused();
  const player = usePreviewPlayer();
  const deckRef = useRef(null);

  const [queue, setQueue] = useState(null); // null while loading
  const [mood, setMood] = useState(null);

  // the profile doc changes on every like; read it through a ref so that doesn't refetch the feed
  const profileRef = useRef(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const load = useCallback(
    () =>
      fetchFeed(profileRef.current)
        .then(setQueue)
        .catch((e) => {
          console.error(e);
          Toast.error('Could not load quotes.');
          setQueue([]);
        }),
    []
  );

  const reload = () => {
    setQueue(null);
    load();
  };

  useEffect(() => {
    load();
  }, [load]);

  // also drop anything blocked or liked elsewhere (e.g. from the quote detail screen) since the feed loaded
  const blocked = useMemo(() => new Set(profile.blocked ?? []), [profile.blocked]);
  const liked = useMemo(() => new Set(profile.likedquotes ?? []), [profile.likedquotes]);
  const unfiltered = useMemo(() => (queue ?? []).filter((q) => !blocked.has(q.uid) && !liked.has(q.id)), [queue, blocked, liked]);
  const visible = useMemo(() => (mood ? unfiltered.filter((q) => q.phrase === mood) : unfiltered), [unfiltered, mood]);
  const availableMoods = useMemo(() => {
    const present = new Set(unfiltered.map((q) => q.phrase));
    return MOODS.filter((m) => present.has(m.phrase));
  }, [unfiltered]);

  const top = visible[0];

  // restart the song only when the top card or focus changes, not on every render
  useEffect(() => {
    if (isFocused && top) player.play(top);
    else player.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [top?.id, isFocused]);

  const onSwipe = useCallback(
    (quote, direction) => {
      setQueue((q) => q.filter((item) => item.id !== quote.id));
      const write = direction === 'right' ? likeQuote(profile.uid, quote.id) : passQuote(profile.uid, quote.id);
      write.catch((e) => {
        console.error(e);
        Toast.error(direction === 'right' ? 'Could not save your like.' : 'Could not save that.');
      });
    },
    [profile.uid]
  );

  const seeAgain = async () => {
    try {
      await resetPassed(profile.uid);
      profileRef.current = { ...profileRef.current, passedquotes: [] };
      reload();
    } catch {
      Toast.error('Something went wrong.');
    }
  };

  let body;
  if (queue === null) {
    body = <Loading style={{ backgroundColor: 'transparent' }} />;
  } else if (!top) {
    body = mood ? (
      <EmptyState
        icon="filter-outline"
        title={`No more ${moodFor(mood).phrase.toLowerCase()} quotes`}
        subtitle="Try another mood, or see everything."
        action={<Button title="Show all moods" variant="secondary" onPress={() => setMood(null)} />}
      />
    ) : (
      <EmptyState
        icon="checkmark-done-circle-outline"
        title="You're all caught up"
        subtitle="Check back later for new quotes, or post one of your own."
        action={
          <View style={{ rowGap: 10, alignItems: 'stretch' }}>
            <Button title="Create a quote" icon="add" onPress={() => navigation.navigate('Tabs', { screen: 'Create' })} />
            <Button title="See passed quotes again" variant="secondary" onPress={seeAgain} />
            <Button title="Refresh" variant="ghost" onPress={reload} />
          </View>
        }
      />
    );
  } else {
    body = (
      <>
        <View style={s.deck}>
          <SwipeDeck
            ref={deckRef}
            quotes={visible}
            onSwipe={onSwipe}
            renderCard={(quote, isTop) => (
              <QuoteCard
                quote={quote}
                muted={player.muted}
                onToggleMute={isTop ? () => player.setMuted(!player.muted) : undefined}
                onPressAuthor={isTop ? () => navigation.navigate('UserProfile', { uid: quote.uid }) : undefined}
              />
            )}
          />
        </View>
        <View style={s.actions}>
          <Pressable style={[s.action, s.small]} onPress={() => navigation.navigate('QuoteDetail', { id: top.id })} accessibilityLabel="Open quote">
            <Ionicons name="expand" size={20} color={colors.textMuted} />
          </Pressable>
          <Pressable style={s.action} onPress={() => deckRef.current?.swipe('left')} accessibilityLabel="Pass">
            <Ionicons name="close" size={34} color={colors.pass} />
          </Pressable>
          <Pressable style={s.action} onPress={() => deckRef.current?.swipe('right')} accessibilityLabel="Like">
            <Ionicons name="heart" size={32} color={colors.like} />
          </Pressable>
          <Pressable
            style={[s.action, s.small]}
            onPress={() => navigation.navigate('UserProfile', { uid: top.uid })}
            accessibilityLabel="View author"
          >
            <Ionicons name="person" size={20} color={colors.textMuted} />
          </Pressable>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <View style={s.header}>
        <View style={s.brand}>
          <Image source={require('../assets/brand/logo.jpg')} style={s.logo} />
          <Text style={s.title}>That Push</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('UserSearch')} hitSlop={10} style={s.iconButton} accessibilityLabel="Find people">
          <Ionicons name="search" size={22} color={colors.text} />
        </Pressable>
      </View>
      {availableMoods.length > 1 || mood ? (
        <View style={s.filters}>
          <MoodFilter selected={mood} onChange={setMood} moods={availableMoods} />
        </View>
      ) : null}
      <View style={[s.body, { paddingBottom: tabSpace }]}>{body}</View>
    </SafeAreaView>
  );
}

const styles = (c, { fonts }) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
    brand: { flexDirection: 'row', alignItems: 'center', columnGap: 10 },
    logo: { width: 38, height: 38, borderRadius: 10 },
    title: { color: c.text, fontFamily: fonts.bold, fontSize: 22 },
    iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' },
    filters: { paddingVertical: 6 },
    body: { flex: 1 },
    deck: { flex: 1, marginHorizontal: 16, marginTop: 8 },
    actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 18, paddingTop: 14 },
    action: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    small: { width: 46, height: 46, borderRadius: 23 },
  });
