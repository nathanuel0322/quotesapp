import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MOODS } from '../constants/moods';
import { useTheme } from '../theme/ThemeProvider';
import { Chip } from './ui';

// Horizontal mood filter. `selected` is a phrase or null for "All".
// Pass `moods` to only offer moods that actually have posts.
export function MoodFilter({ selected, onChange, moods = MOODS, style }) {
  const { colors } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.row, style]}>
      <Chip label="All" selected={!selected} color={colors.accent} onPress={() => onChange(null)} />
      {moods.map((m) => (
        <Chip
          key={m.phrase}
          label={m.phrase}
          emoji={m.emoji}
          color={m.color}
          selected={selected === m.phrase}
          onPress={() => onChange(selected === m.phrase ? null : m.phrase)}
        />
      ))}
    </ScrollView>
  );
}

// Wrapping grid used when picking a mood for a new post.
export function MoodPicker({ selected, onSelect }) {
  return (
    <View style={styles.wrap}>
      {MOODS.map((m) => (
        <Chip key={m.phrase} label={m.phrase} emoji={m.emoji} color={m.color} selected={selected === m.phrase} onPress={() => onSelect(m)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { columnGap: 8, paddingHorizontal: 16 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
});
