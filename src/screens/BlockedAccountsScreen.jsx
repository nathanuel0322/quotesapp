import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Toast } from 'toastify-react-native';
import { useAuth } from '../context/AuthProvider';
import { getUsers, unblock } from '../services/users';
import { useTheme } from '../theme/ThemeProvider';
import UserRow from '../components/UserRow';
import { Button, EmptyState, Loading } from '../components/ui';

export default function BlockedAccountsScreen({ navigation }) {
  const { profile } = useAuth();
  const { colors } = useTheme();
  const [people, setPeople] = useState(null);
  const blockedKey = (profile.blocked ?? []).join(',');

  useEffect(() => {
    getUsers(profile.blocked ?? [])
      .then(setPeople)
      .catch(() => setPeople([]));
    // blockedKey stands in for profile.blocked, which is a new array on every profile snapshot
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockedKey]);

  if (people === null) return <Loading />;

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
      data={people}
      keyExtractor={(u) => u.id}
      renderItem={({ item }) => (
        <UserRow
          user={item}
          onPress={() => navigation.navigate('UserProfile', { uid: item.id })}
          right={
            <Button
              title="Unblock"
              variant="secondary"
              compact
              onPress={() => unblock(profile.uid, item.id).catch(() => Toast.error('Something went wrong.'))}
            />
          }
        />
      )}
      ListEmptyComponent={<EmptyState icon="shield-checkmark-outline" title="No blocked accounts" subtitle="People you block will show up here." />}
    />
  );
}
