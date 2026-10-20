import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { moodFor } from '../constants/moods';
import { useUserSummary } from '../hooks/useUser';
import { fonts } from '../theme/ThemeProvider';
import { Avatar } from './ui';

// The full-size card used in the swipe deck and on the quote detail screen.
// Always dark: text sits on top of a photo, regardless of app theme.
export default function QuoteCard({ quote, onPressAuthor, muted, onToggleMute, style }) {
  const mood = moodFor(quote.phrase, quote.color);
  const author = useUserSummary(quote.uid);
  const hasSong = !!(quote.name || quote.trackId);
  const textSize = quote.text?.length > 140 ? 20 : quote.text?.length > 70 ? 24 : 30;

  return (
    <View style={[styles.card, style]}>
      <Image source={{ uri: quote.imglink }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
      <View style={styles.scrim} />

      <View style={styles.top}>
        <View style={[styles.mood, { backgroundColor: mood.color }]}>
          <Text style={styles.moodText}>
            {mood.emoji} {mood.phrase}
          </Text>
        </View>
        {hasSong && onToggleMute ? (
          <Pressable onPress={onToggleMute} hitSlop={12} style={styles.roundButton} accessibilityLabel={muted ? 'Unmute' : 'Mute'}>
            <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={20} color="#fff" />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.middle}>
        <Text style={styles.quoteMark}>“</Text>
        <Text style={[styles.quote, { fontSize: textSize, lineHeight: textSize * 1.25 }]}>{quote.text}</Text>
      </View>

      <View style={styles.bottom}>
        <Pressable onPress={onPressAuthor} disabled={!onPressAuthor} style={styles.author} hitSlop={8}>
          <Avatar uri={author?.photoURL} name={quote.username} size={34} />
          <Text style={styles.authorName} numberOfLines={1}>
            @{author?.username ?? quote.username}
          </Text>
        </Pressable>
        <View style={styles.likes}>
          <Ionicons name="heart" size={16} color="#fff" />
          <Text style={styles.likesText}>{quote.likes ?? 0}</Text>
        </View>
      </View>

      {hasSong ? (
        <View style={styles.song}>
          {quote.pic ? <Image source={{ uri: quote.pic }} style={styles.songArt} /> : <Ionicons name="musical-notes" size={18} color="#fff" />}
          <Text style={styles.songText} numberOfLines={1}>
            {quote.name} • {quote.artist}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const shadow = { textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 };

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#1D202D',
    padding: 18,
    justifyContent: 'space-between',
  },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8, 9, 16, 0.42)' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mood: { paddingHorizontal: 12, height: 32, borderRadius: 16, justifyContent: 'center' },
  moodText: { color: '#0A0B14', fontFamily: fonts.bold, fontSize: 13 },
  roundButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: { flex: 1, justifyContent: 'center', paddingHorizontal: 6 },
  quoteMark: { color: '#FF765E', fontFamily: fonts.bold, fontSize: 64, lineHeight: 64, marginBottom: -18, ...shadow },
  quote: { color: '#fff', fontFamily: fonts.bold, ...shadow },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  author: { flexDirection: 'row', alignItems: 'center', columnGap: 10, flexShrink: 1 },
  authorName: { color: '#fff', fontFamily: fonts.semibold, fontSize: 15, flexShrink: 1, ...shadow },
  likes: { flexDirection: 'row', alignItems: 'center', columnGap: 5 },
  likesText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 14, ...shadow },
  song: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginTop: 12,
    padding: 6,
    paddingRight: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  songArt: { width: 28, height: 28, borderRadius: 8 },
  songText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 13, flexShrink: 1 },
});
