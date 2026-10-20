import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { moodFor } from '../constants/moods';
import { fonts } from '../theme/ThemeProvider';

// Two-column grid of quote thumbnails. Rendered inline (not a FlatList) so it can live
// inside a profile ScrollView.
export default function QuoteGrid({ quotes, onPress }) {
  return (
    <View style={styles.grid}>
      {quotes.map((quote) => {
        const mood = moodFor(quote.phrase, quote.color);
        return (
          <Pressable key={quote.id} style={({ pressed }) => [styles.cell, pressed && { opacity: 0.85 }]} onPress={() => onPress?.(quote)}>
            <Image source={{ uri: quote.imglink }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
            <View style={styles.scrim} />
            <Text style={styles.mood}>{mood.emoji}</Text>
            <Text style={styles.text} numberOfLines={4}>
              {quote.text}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12, paddingHorizontal: 16 },
  cell: { width: '48.5%', aspectRatio: 3 / 4, borderRadius: 18, overflow: 'hidden', padding: 12, justifyContent: 'flex-end', backgroundColor: '#1D202D' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8, 9, 16, 0.45)' },
  mood: { position: 'absolute', top: 10, left: 12, fontSize: 18 },
  text: {
    color: '#fff',
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
