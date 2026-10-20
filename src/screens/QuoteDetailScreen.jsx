import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Toast } from 'toastify-react-native';
import { useAuth } from '../context/AuthProvider';
import { useStyles, useTheme } from '../theme/ThemeProvider';
import { deleteQuote, fetchQuote, likeQuote, quoteCache, reportQuote, unlikeQuote } from '../services/quotes';
import { block } from '../services/users';
import { usePreviewPlayer } from '../hooks/usePreviewPlayer';
import QuoteCard from '../components/QuoteCard';
import { Button, EmptyState, Loading } from '../components/ui';
import { showActionSheet } from '../components/ActionSheet';

const REPORT_REASONS = ['Spam', 'Hateful or abusive', 'Nudity or sexual content', 'Violence or self-harm', 'Something else'];

export default function QuoteDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const { profile } = useAuth();
  const { colors } = useTheme();
  const s = useStyles(styles);
  const player = usePreviewPlayer();
  const isFocused = useIsFocused();

  const [quote, setQuote] = useState(() => quoteCache.get(id) ?? null);
  const [loading, setLoading] = useState(!quote);
  const [busy, setBusy] = useState(false);

  const isMine = quote?.uid === profile.uid;
  const isLiked = profile.likedquotes?.includes(id);

  useEffect(() => {
    fetchQuote(id)
      .then(setQuote)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isFocused && quote) player.play(quote);
    else player.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the quote or focus changes
  }, [quote?.id, isFocused]);

  const report = useCallback(() => {
    showActionSheet({
      title: 'Report this quote',
      message: 'Why are you reporting it?',
      options: REPORT_REASONS.map((reason) => ({
        text: reason,
        onPress: () =>
          reportQuote(profile.uid, quote, reason)
            .then(() => Toast.success('Thanks, we’ll take a look.'))
            .catch(() => Toast.error('Could not send report.')),
      })),
    });
  }, [profile.uid, quote]);

  const confirmDelete = useCallback(() => {
    Alert.alert('Delete this quote?', 'This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteQuote(quote);
            quoteCache.delete(quote.id);
            Toast.success('Deleted.');
            navigation.goBack();
          } catch {
            Toast.error('Could not delete.');
          }
        },
      },
    ]);
  }, [quote, navigation]);

  const openMenu = useCallback(() => {
    if (isMine) {
      confirmDelete();
      return;
    }
    showActionSheet({
      options: [
        { text: 'Report quote', onPress: report },
        {
          text: `Block @${quote.username}`,
          destructive: true,
          onPress: () =>
            block(profile.uid, quote.uid)
              .then(() => {
                Toast.success('Blocked.');
                navigation.goBack();
              })
              .catch(() => Toast.error('Something went wrong.')),
        },
      ],
    });
  }, [isMine, confirmDelete, report, quote, profile.uid, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: quote
        ? () => (
            <Pressable onPress={openMenu} hitSlop={10} accessibilityLabel={isMine ? 'Delete' : 'More options'}>
              <Ionicons name={isMine ? 'trash-outline' : 'ellipsis-horizontal'} size={22} color={colors.text} />
            </Pressable>
          )
        : undefined,
    });
  }, [navigation, quote, isMine, openMenu, colors.text]);

  const toggleLike = async () => {
    setBusy(true);
    const delta = isLiked ? -1 : 1;
    try {
      if (isLiked) await unlikeQuote(profile.uid, id);
      else await likeQuote(profile.uid, id);
      setQuote((q) => ({ ...q, likes: Math.max(0, (q.likes ?? 0) + delta) }));
    } catch {
      Toast.error('Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const share = () => {
    Share.share({ message: `“${quote.text}” — @${quote.username} on That Push` }).catch(() => {});
  };

  if (loading) return <Loading />;
  if (!quote) {
    return (
      <View style={[s.container, { justifyContent: 'center' }]}>
        <EmptyState icon="trash-outline" title="Quote not found" subtitle="It may have been deleted." />
      </View>
    );
  }

  const posted = quote.createdAt?.toDate?.();

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.card}>
        <QuoteCard
          quote={quote}
          muted={player.muted}
          onToggleMute={() => player.setMuted(!player.muted)}
          onPressAuthor={isMine ? undefined : () => navigation.push('UserProfile', { uid: quote.uid })}
        />
      </View>
      <View style={s.actions}>
        {!isMine ? (
          <Button
            title={isLiked ? 'Liked' : 'Like'}
            icon={isLiked ? 'heart' : 'heart-outline'}
            variant={isLiked ? 'secondary' : 'primary'}
            onPress={toggleLike}
            loading={busy}
            style={{ flex: 1 }}
          />
        ) : null}
        <Button title="Share" icon="share-outline" variant="secondary" onPress={share} style={{ flex: isMine ? 1 : undefined }} />
      </View>
      {posted ? <Text style={s.meta}>Posted {posted.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</Text> : null}
    </ScrollView>
  );
}

const styles = (c, { fonts }) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    content: { padding: 16, paddingBottom: 40 },
    card: { aspectRatio: 3 / 4, width: '100%' },
    actions: { flexDirection: 'row', columnGap: 10, marginTop: 16 },
    meta: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 13, textAlign: 'center', marginTop: 16 },
  });
