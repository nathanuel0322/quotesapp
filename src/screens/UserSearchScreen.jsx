import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { searchUsers } from '../services/users';
import { useTheme } from '../theme/ThemeProvider';
import UserRow from '../components/UserRow';
import { EmptyState, TextField } from '../components/ui';

export default function UserSearchScreen({ navigation }) {
  const { colors } = useTheme();
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const term = q.trim();
  useEffect(() => {
    if (!term) return undefined;
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      searchUsers(term)
        .then((r) => active && setResults(r))
        .catch(() => active && setResults([]))
        .finally(() => active && setLoading(false));
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [term]);

  const shown = term ? results : [];
  const busy = term ? loading : false;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.search}>
        <TextField
          value={q}
          onChangeText={setQ}
          placeholder="Search by username"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          returnKeyType="search"
          style={{ marginBottom: 0 }}
        />
      </View>
      {busy ? <ActivityIndicator style={{ marginTop: 16 }} color={colors.accent} /> : null}
      <FlatList
        data={shown}
        keyExtractor={(u) => u.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => <UserRow user={item} onPress={() => navigation.navigate('UserProfile', { uid: item.id })} />}
        ListEmptyComponent={
          !busy ? (
            <EmptyState
              icon="search-outline"
              title={term ? 'No one found' : 'Find people'}
              subtitle={term ? 'Usernames are lowercase. Check the spelling.' : 'Search for friends by their username.'}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: { padding: 16, paddingBottom: 8 },
});
