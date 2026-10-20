import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Toast } from 'toastify-react-native';
import { authErrorMessage, useAuth } from '../context/AuthProvider';
import { useStyles, useTheme } from '../theme/ThemeProvider';
import { deleteAccount } from '../services/users';
import { resetPassed } from '../services/quotes';
import Sheet from '../components/Sheet';
import { Button, Chip, ListRow, SectionTitle, TextField } from '../components/ui';

const APPEARANCE = [
  ['system', 'System', '📱'],
  ['light', 'Light', '☀️'],
  ['dark', 'Dark', '🌙'],
];

export default function SettingsScreen({ navigation }) {
  const { user, profile, logout, resetPassword } = useAuth();
  const { preference, setPreference, colors } = useTheme();
  const s = useStyles(styles);
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const confirmLogout = () =>
    Alert.alert('Log out?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);

  const resetFeed = () =>
    resetPassed(profile.uid)
      .then(() => Toast.success('Passed quotes will show up in your feed again.'))
      .catch(() => Toast.error('Something went wrong.'));

  const doDelete = async () => {
    setBusy(true);
    setDeleteError(null);
    try {
      // re-auth first so we never wipe data and then fail on deleteUser
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
      await deleteAccount(user, profile);
      Toast.success('Your account was deleted.');
    } catch (e) {
      console.error(e);
      // toasts render under the sheet, so show the error inline
      setDeleteError(authErrorMessage(e));
      setBusy(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <SectionTitle>Appearance</SectionTitle>
      <View style={s.chips}>
        {APPEARANCE.map(([key, label, emoji]) => (
          <Chip key={key} label={label} emoji={emoji} color={colors.accent} selected={preference === key} onPress={() => setPreference(key)} />
        ))}
      </View>

      <SectionTitle>Account</SectionTitle>
      <ListRow icon="person-circle-outline" label="Edit profile" onPress={() => navigation.navigate('EditProfile')} />
      <ListRow icon="key-outline" label="Change password" onPress={() => resetPassword(user.email)} />
      <ListRow icon="mail-outline" label="Email" value={user.email} />

      <SectionTitle>Privacy & feed</SectionTitle>
      <ListRow
        icon="ban-outline"
        label="Blocked accounts"
        value={profile.blocked?.length ? String(profile.blocked.length) : undefined}
        onPress={() => navigation.navigate('BlockedAccounts')}
      />
      <ListRow icon="refresh-outline" label="Show passed quotes again" onPress={resetFeed} />

      <SectionTitle>Session</SectionTitle>
      <ListRow icon="log-out-outline" label="Log out" onPress={confirmLogout} danger />
      <ListRow icon="trash-outline" label="Delete account" onPress={() => setDeleting(true)} danger />

      <Text style={s.footer}>That Push · signed in as @{profile.username}</Text>

      <Sheet
        visible={deleting}
        title="Delete account"
        onClose={() => {
          setDeleting(false);
          setPassword('');
          setDeleteError(null);
        }}
      >
        <View style={{ padding: 20 }}>
          <Text style={s.warning}>
            This permanently deletes your profile, all of your quotes and your photos. It can’t be undone.
          </Text>
          <TextField
            label="Enter your password to confirm"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoFocus
            textContentType="password"
            error={deleteError}
          />
          <Button title="Delete my account" variant="danger" onPress={doDelete} loading={busy} disabled={!password} />
        </View>
      </Sheet>
    </ScrollView>
  );
}

const styles = (c, { fonts }) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    chips: { flexDirection: 'row', columnGap: 8, paddingHorizontal: 20, paddingVertical: 12 },
    footer: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 13, textAlign: 'center', marginTop: 32 },
    warning: { color: c.text, fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, marginBottom: 20 },
  });
