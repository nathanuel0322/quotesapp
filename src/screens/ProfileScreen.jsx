import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Toast } from 'toastify-react-native';
import { useAuth } from '../context/AuthProvider';
import { useStyles, useTheme } from '../theme/ThemeProvider';
import { useUserDoc } from '../hooks/useUser';
import { useTabBarSpace } from '../hooks/useTabBarSpace';
import { fetchQuotesByIds, fetchQuotesByUser } from '../services/quotes';
import { block, follow, unblock, unfollow, updateProfilePhoto } from '../services/users';
import { MOODS } from '../constants/moods';
import QuoteGrid from '../components/QuoteGrid';
import { MoodFilter } from '../components/MoodChips';
import { Avatar, Button, EmptyState, Loading } from '../components/ui';

// Used both as the Profile tab (your own, no params) and the UserProfile stack screen ({ uid }).
export default function ProfileScreen({ navigation, route }) {
  const { user: me, profile: myProfile } = useAuth();
  const { colors } = useTheme();
  const s = useStyles(styles);
  const uid = route.params?.uid ?? me.uid;
  const isMe = uid === me.uid;
  const isTab = !route.params?.uid;
  const tabSpace = useTabBarSpace();

  const { user: person, loading } = useUserDoc(uid);
  const [tab, setTab] = useState('posts');
  const [mood, setMood] = useState(null);
  const [posts, setPosts] = useState(null);
  const [liked, setLiked] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isFollowing = myProfile.following?.includes(uid);
  const isBlocked = myProfile.blocked?.includes(uid);
  const likedKey = (myProfile.likedquotes ?? []).join(',');

  const load = useCallback(async () => {
    try {
      const [p, l] = await Promise.all([
        fetchQuotesByUser(uid),
        isMe ? fetchQuotesByIds(myProfile.likedquotes ?? []) : Promise.resolve(null),
      ]);
      setPosts(p);
      setLiked(l);
    } catch (e) {
      console.error(e);
      Toast.error('Could not load posts.');
      setPosts((prev) => prev ?? []);
    }
    // likedKey stands in for the liked list so a new like refreshes this on focus
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, isMe, likedKey]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const confirmBlock = useCallback(() => {
    if (isBlocked) {
      unblock(me.uid, uid).catch(() => Toast.error('Something went wrong.'));
      return;
    }
    Alert.alert(`Block @${person?.username}?`, "You won't see their quotes, and they'll be removed from your following.", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Block',
        style: 'destructive',
        onPress: () =>
          block(me.uid, uid)
            .then(() => Toast.success('Blocked.'))
            .catch(() => Toast.error('Something went wrong.')),
      },
    ]);
  }, [isBlocked, me.uid, uid, person?.username]);

  useLayoutEffect(() => {
    if (isTab) return;
    navigation.setOptions({
      title: person ? `@${person.username}` : '',
      headerRight: isMe
        ? undefined
        : () => (
            <Pressable onPress={confirmBlock} hitSlop={10} accessibilityLabel={isBlocked ? 'Unblock' : 'Block'}>
              <Ionicons name={isBlocked ? 'remove-circle' : 'ellipsis-horizontal'} size={22} color={colors.text} />
            </Pressable>
          ),
    });
  }, [navigation, person, isMe, isTab, isBlocked, confirmBlock, colors.text]);

  const toggleFollow = async () => {
    setBusy(true);
    try {
      if (isFollowing) await unfollow(me.uid, uid);
      else await follow(me.uid, uid);
    } catch (e) {
      console.error(e);
      Toast.error('Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const changePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.9 });
    if (result.canceled || !result.assets?.[0]) return;
    setUploading(true);
    try {
      await updateProfilePhoto(me, result.assets[0].uri);
      Toast.success('Profile photo updated.');
    } catch (e) {
      console.error(e);
      Toast.error('Upload failed, try again.');
    } finally {
      setUploading(false);
    }
  };

  const list = tab === 'posts' ? posts : liked;
  const moods = useMemo(() => {
    const present = new Set((list ?? []).map((q) => q.phrase));
    return MOODS.filter((m) => present.has(m.phrase));
  }, [list]);
  const shown = (list ?? []).filter((q) => !mood || q.phrase === mood);

  if (loading) return <Loading />;
  if (!person) {
    return (
      <View style={[s.safe, { justifyContent: 'center' }]}>
        <EmptyState icon="person-outline" title="User not found" subtitle="This account may have been deleted." />
      </View>
    );
  }

  const openQuote = (q) => navigation.navigate('QuoteDetail', { id: q.id });
  const Wrapper = isTab ? SafeAreaView : View;

  return (
    <Wrapper style={s.safe} edges={['top', 'left', 'right']}>
      {isTab ? (
        <View style={s.topBar}>
          <Text style={s.topTitle}>@{person.username}</Text>
          <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={10} style={s.iconButton} accessibilityLabel="Settings">
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </Pressable>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={{ paddingBottom: isTab ? tabSpace : 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />}
      >
        <View style={s.header}>
          <Pressable onPress={isMe ? changePhoto : undefined} disabled={!isMe || uploading}>
            <Avatar uri={person.photoURL} name={person.username} size={96} />
            {isMe ? (
              <View style={s.cameraBadge}>
                {uploading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="camera" size={14} color="#fff" />}
              </View>
            ) : null}
          </Pressable>

          <View style={s.stats}>
            <Stat label="Posts" value={posts?.length ?? '–'} />
            <Stat label="Followers" value={person.followers?.length ?? 0} onPress={() => navigation.navigate('FollowList', { uid, type: 'followers' })} />
            <Stat label="Following" value={person.following?.length ?? 0} onPress={() => navigation.navigate('FollowList', { uid, type: 'following' })} />
          </View>
        </View>

        {person.bio ? <Text style={s.bio}>{person.bio}</Text> : null}

        <View style={s.buttons}>
          {isMe ? (
            <Button title="Edit profile" variant="secondary" compact onPress={() => navigation.navigate('EditProfile')} style={{ flex: 1 }} />
          ) : isBlocked ? (
            <Button title="Unblock" variant="secondary" compact onPress={confirmBlock} style={{ flex: 1 }} />
          ) : (
            <Button
              title={isFollowing ? 'Following' : 'Follow'}
              icon={isFollowing ? 'checkmark' : 'person-add'}
              variant={isFollowing ? 'secondary' : 'primary'}
              compact
              loading={busy}
              onPress={toggleFollow}
              style={{ flex: 1 }}
            />
          )}
        </View>

        {isMe ? (
          <View style={s.tabs}>
            {[
              ['posts', 'grid', 'Posts'],
              ['liked', 'heart', 'Liked'],
            ].map(([key, icon, label]) => (
              <Pressable
                key={key}
                style={[s.tab, tab === key && s.tabActive]}
                onPress={() => {
                  setTab(key);
                  setMood(null);
                }}
              >
                <Ionicons name={tab === key ? icon : `${icon}-outline`} size={18} color={tab === key ? colors.text : colors.textMuted} />
                <Text style={[s.tabText, tab === key && { color: colors.text }]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={s.divider} />
        )}

        {moods.length > 1 ? <MoodFilter selected={mood} onChange={setMood} moods={moods} style={{ paddingBottom: 12 }} /> : null}

        {isBlocked ? (
          <EmptyState icon="eye-off-outline" title="You blocked this account" subtitle="Unblock to see their quotes." />
        ) : list === null ? (
          <ActivityIndicator style={{ marginTop: 32 }} color={colors.accent} />
        ) : shown.length === 0 ? (
          tab === 'posts' ? (
            <EmptyState
              icon="create-outline"
              title={isMe ? 'Share your first quote' : 'No quotes yet'}
              subtitle={isMe ? 'Post something that keeps you going.' : undefined}
              action={isMe ? <Button title="Create a quote" icon="add" onPress={() => navigation.navigate('Tabs', { screen: 'Create' })} /> : null}
            />
          ) : (
            <EmptyState icon="heart-outline" title="No liked quotes yet" subtitle="Swipe right on a quote to save it here." />
          )
        ) : (
          <QuoteGrid quotes={shown} onPress={openQuote} />
        )}
      </ScrollView>
    </Wrapper>
  );
}

function Stat({ label, value, onPress }) {
  const s = useStyles(styles);
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={s.stat}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = (c, { fonts }) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
    topTitle: { color: c.text, fontFamily: fonts.bold, fontSize: 22, flexShrink: 1 },
    iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, columnGap: 20 },
    cameraBadge: {
      position: 'absolute',
      right: -4,
      bottom: -4,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: c.accent,
      borderWidth: 3,
      borderColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stats: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
    stat: { alignItems: 'center', minWidth: 64 },
    statValue: { color: c.text, fontFamily: fonts.bold, fontSize: 20 },
    statLabel: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 13, marginTop: 2 },
    bio: { color: c.text, fontFamily: fonts.regular, fontSize: 15, lineHeight: 21, paddingHorizontal: 20, marginTop: 14 },
    buttons: { flexDirection: 'row', columnGap: 10, paddingHorizontal: 20, marginTop: 16 },
    tabs: { flexDirection: 'row', marginTop: 20, marginBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 6, paddingVertical: 12 },
    tabActive: { borderBottomWidth: 2, borderBottomColor: c.accent },
    tabText: { color: c.textMuted, fontFamily: fonts.semibold, fontSize: 15 },
    divider: { height: StyleSheet.hairlineWidth, backgroundColor: c.border, marginTop: 20, marginBottom: 12 },
  });
