import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Toast } from 'toastify-react-native';
import { useAuth } from '../context/AuthProvider';
import { useStyles, useTheme } from '../theme/ThemeProvider';
import { createQuote } from '../services/quotes';
import { searchTracks } from '../services/deezer';
import { useTrackPreview } from '../hooks/usePreviewPlayer';
import { useTabBarSpace } from '../hooks/useTabBarSpace';
import QuoteCard from '../components/QuoteCard';
import Sheet from '../components/Sheet';
import { MoodPicker } from '../components/MoodChips';
import { Button, EmptyState } from '../components/ui';
import { showActionSheet } from '../components/ActionSheet';
import DeezerLogo from '../assets/brand/deezer-white.svg';
import DeezerLogoDark from '../assets/brand/deezer-black.svg';

const MAX_LENGTH = 220;

export default function CreateScreen({ navigation }) {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const s = useStyles(styles);
  const tabSpace = useTabBarSpace();

  const [image, setImage] = useState(null); // { uri, width, height }
  const [text, setText] = useState('');
  const [mood, setMood] = useState(null);
  const [song, setSong] = useState(null); // Deezer track object
  const [sheet, setSheet] = useState(null); // 'mood' | 'song' | null
  const [posting, setPosting] = useState(false);

  const canPost = image && text.trim().length > 0 && mood && !posting;

  const preview = useMemo(
    () => ({
      id: 'preview',
      uid: user.uid,
      username: user.displayName,
      text: text.trim() || 'Your message will appear here.',
      phrase: mood?.phrase ?? 'Pick a mood',
      color: mood?.color,
      imglink: image?.uri,
      likes: 0,
      ...(song ? { name: song.title, artist: song.artist.name, pic: song.album.cover_small } : {}),
    }),
    [user, text, mood, image, song]
  );

  const pick = async (source) => {
    const options = { mediaTypes: ['images'], allowsEditing: true, aspect: [3, 4], quality: 0.9 };
    let result;
    if (source === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Toast.error('Camera permission is needed to take a photo.');
        return;
      }
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }
    if (!result.canceled && result.assets?.[0]) {
      const { uri, width, height } = result.assets[0];
      setImage({ uri, width, height });
    }
  };

  const choosePhoto = () => {
    showActionSheet({
      title: image ? 'Change photo' : 'Add a photo',
      options: [
        { text: 'Choose from library', onPress: () => pick('library') },
        { text: 'Take a photo', onPress: () => pick('camera') },
      ],
    });
  };

  const reset = () => {
    setImage(null);
    setText('');
    setMood(null);
    setSong(null);
  };

  const post = async () => {
    if (!canPost) return;
    setPosting(true);
    try {
      const id = await createQuote({ user, image, mood, text, song });
      reset();
      Toast.success('Quote posted!');
      navigation.navigate('QuoteDetail', { id });
    } catch (e) {
      console.error(e);
      Toast.error('Upload failed. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[s.container, { paddingBottom: tabSpace }]} keyboardShouldPersistTaps="handled">
          <View style={s.header}>
            <Text style={s.title}>New quote</Text>
            {image || text || mood || song ? (
              <Pressable onPress={reset} hitSlop={10}>
                <Text style={s.clear}>Clear</Text>
              </Pressable>
            ) : null}
          </View>

          <Pressable onPress={choosePhoto} style={s.previewWrap}>
            {image ? (
              <>
                <QuoteCard quote={preview} />
                <View style={s.changePhoto}>
                  <Ionicons name="image-outline" size={16} color="#fff" />
                  <Text style={s.changePhotoText}>Change</Text>
                </View>
              </>
            ) : (
              <View style={s.placeholder}>
                <Ionicons name="image-outline" size={48} color={colors.textMuted} />
                <Text style={s.placeholderTitle}>Add a background photo</Text>
                <Text style={s.placeholderSub}>Tap to pick from your library or camera</Text>
              </View>
            )}
          </Pressable>

          <View style={s.inputWrap}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="What's pushing you today?"
              placeholderTextColor={colors.placeholder}
              selectionColor={colors.accent}
              multiline
              maxLength={MAX_LENGTH}
              style={s.input}
            />
            <Text style={s.counter}>
              {text.length}/{MAX_LENGTH}
            </Text>
          </View>

          <Pressable style={s.option} onPress={() => setSheet('mood')}>
            <View style={[s.optionIcon, mood && { backgroundColor: mood.color }]}>
              {mood ? <Text style={{ fontSize: 18 }}>{mood.emoji}</Text> : <Ionicons name="happy-outline" size={20} color={colors.text} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.optionLabel}>Mood</Text>
              <Text style={s.optionValue}>{mood ? mood.phrase : 'Required'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>

          <Pressable style={s.option} onPress={() => setSheet('song')}>
            {song ? (
              <Image source={{ uri: song.album.cover_small }} style={s.optionArt} />
            ) : (
              <View style={s.optionIcon}>
                <Ionicons name="musical-notes-outline" size={20} color={colors.text} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={s.optionLabel}>Song</Text>
              <Text style={s.optionValue} numberOfLines={1}>
                {song ? `${song.title} • ${song.artist.name}` : 'Optional'}
              </Text>
            </View>
            {song ? (
              <Pressable onPress={() => setSong(null)} hitSlop={10} accessibilityLabel="Remove song">
                <Ionicons name="close-circle" size={22} color={colors.textMuted} />
              </Pressable>
            ) : (
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            )}
          </Pressable>

          <Button title="Post" icon="paper-plane" onPress={post} loading={posting} disabled={!canPost} style={{ marginTop: 8 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Sheet visible={sheet === 'mood'} title="How does it feel?" onClose={() => setSheet(null)}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <MoodPicker
            selected={mood?.phrase}
            onSelect={(m) => {
              setMood(m);
              setSheet(null);
            }}
          />
        </ScrollView>
      </Sheet>

      <Sheet visible={sheet === 'song'} title="Add a song" onClose={() => setSheet(null)}>
        <SongSearch
          logo={isDark ? DeezerLogo : DeezerLogoDark}
          onSelect={(track) => {
            setSong(track);
            setSheet(null);
          }}
        />
      </Sheet>
    </SafeAreaView>
  );
}

function SongSearch({ onSelect, logo: Logo }) {
  const { colors } = useTheme();
  const s = useStyles(styles);
  const preview = useTrackPreview();
  const isFocused = useIsFocused();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { stop } = preview;
  useEffect(() => stop, [stop]);
  useEffect(() => {
    if (!isFocused) stop();
  }, [isFocused, stop]);

  const term = q.trim();
  useEffect(() => {
    if (!term) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      searchTracks(term, controller.signal)
        .then(setResults)
        .catch((e) => e.name !== 'AbortError' && Toast.error('Song search failed.'))
        .finally(() => !controller.signal.aborted && setLoading(false));
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  const shown = term ? results : [];
  const busy = term ? loading : false;

  return (
    <View style={{ flex: 1 }}>
      <View style={s.searchRow}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search songs or artists"
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.accent}
          style={s.searchInput}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
        />
        {busy ? <ActivityIndicator color={colors.accent} /> : null}
      </View>
      <FlatList
        data={shown}
        keyExtractor={(t) => String(t.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        ListEmptyComponent={
          !busy ? (
            <EmptyState icon="musical-notes-outline" title={q ? 'No songs found' : 'Find the perfect soundtrack'} subtitle="30-second previews from Deezer" />
          ) : null
        }
        renderItem={({ item }) => {
          const active = preview.currentId === item.id;
          return (
            <Pressable
              style={({ pressed }) => [s.track, pressed && { opacity: 0.7 }]}
              onPress={() => {
                preview.stop();
                onSelect(item);
              }}
            >
              <Image source={{ uri: item.album.cover_small }} style={s.trackArt} />
              <View style={{ flex: 1 }}>
                <Text style={s.trackTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={s.trackArtist} numberOfLines={1}>
                  {item.artist.name}
                </Text>
              </View>
              <Pressable onPress={() => preview.toggle(item)} hitSlop={10} style={s.playButton} accessibilityLabel={active ? 'Stop preview' : 'Play preview'}>
                {active && preview.loading ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : (
                  <Ionicons name={active ? 'pause' : 'play'} size={18} color={colors.text} />
                )}
              </Pressable>
            </Pressable>
          );
        }}
      />
      <View style={s.attribution}>
        <Logo width={90} height={24} />
      </View>
    </View>
  );
}

const styles = (c, { fonts }) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    container: { padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    title: { color: c.text, fontFamily: fonts.bold, fontSize: 26 },
    clear: { color: c.accent, fontFamily: fonts.semibold, fontSize: 15 },
    previewWrap: { aspectRatio: 3 / 4, width: '100%', marginBottom: 16 },
    placeholder: {
      flex: 1,
      borderRadius: 28,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: c.border,
      backgroundColor: c.surface,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    placeholderTitle: { color: c.text, fontFamily: fonts.bold, fontSize: 18, marginTop: 12 },
    placeholderSub: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 14, marginTop: 4, textAlign: 'center' },
    changePhoto: {
      position: 'absolute',
      top: 64,
      right: 16,
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 4,
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },
    changePhotoText: { color: '#fff', fontFamily: fonts.semibold, fontSize: 13 },
    inputWrap: { backgroundColor: c.surface, borderRadius: 18, borderWidth: 1, borderColor: c.border, padding: 14, marginBottom: 12 },
    input: { color: c.text, fontFamily: fonts.semibold, fontSize: 17, minHeight: 72, textAlignVertical: 'top' },
    counter: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 12, alignSelf: 'flex-end' },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 12,
      backgroundColor: c.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      padding: 12,
      marginBottom: 12,
    },
    optionIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: c.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
    optionArt: { width: 40, height: 40, borderRadius: 10 },
    optionLabel: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 12 },
    optionValue: { color: c.text, fontFamily: fonts.semibold, fontSize: 15, marginTop: 2 },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 10,
      margin: 16,
      paddingHorizontal: 14,
      height: 48,
      borderRadius: 16,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    },
    searchInput: { flex: 1, color: c.text, fontFamily: fonts.regular, fontSize: 16 },
    track: { flexDirection: 'row', alignItems: 'center', columnGap: 12, paddingHorizontal: 16, paddingVertical: 8 },
    trackArt: { width: 48, height: 48, borderRadius: 10 },
    trackTitle: { color: c.text, fontFamily: fonts.semibold, fontSize: 15 },
    trackArtist: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 13, marginTop: 2 },
    playButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: c.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
    attribution: { alignItems: 'center', paddingVertical: 10 },
  });
