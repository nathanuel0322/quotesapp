import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useUserDoc } from '../hooks/useUser';
import { getUsers } from '../services/users';
import { useTheme } from '../theme/ThemeProvider';
import UserRow from '../components/UserRow';
import { EmptyState, Loading } from '../components/ui';

export default function FollowListScreen({ navigation, route }) {
  const { uid, type } = route.params; // type: 'followers' | 'following'
  const { colors } = useTheme();
  const { user, loading } = useUserDoc(uid);
  const [people, setPeople] = useState(null);
  const ids = user?.[type] ?? null;
  const idsKey = ids?.join(',');

  useLayoutEffect(() => {
    navigation.setOptions({ title: type === 'followers' ? 'Followers' : 'Following' });
  }, [navigation, type]);

  useEffect(() => {
    if (!ids) return;
    getUsers(ids)
      .then(setPeople)
      .catch(() => setPeople([]));
    // idsKey stands in for ids, which is a new array on every snapshot
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  // a missing user doc has nobody to list
  const list = !loading && !ids ? [] : people;
  if (list === null) return <Loading />;

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      data={list}
      keyExtractor={(u) => u.id}
      renderItem={({ item }) => <UserRow user={item} onPress={() => navigation.push('UserProfile', { uid: item.id })} />}
      ListEmptyComponent={
        <EmptyState
          icon="people-outline"
          title={type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
          subtitle={type === 'following' ? 'Tap a name on any quote to find people to follow.' : undefined}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical: 8, flexGrow: 1 },
});
