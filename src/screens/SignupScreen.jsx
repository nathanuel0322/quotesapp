import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthProvider';
import { normalizeUsername, USERNAME_RULES, validateUsername } from '../services/users';
import { useStyles } from '../theme/ThemeProvider';
import { Button, TextField } from '../components/ui';

export default function SignupScreen({ navigation }) {
  const { register } = useAuth();
  const s = useStyles(styles);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const usernameError = username && validateUsername(normalizeUsername(username)) ? USERNAME_RULES : null;
  const confirmError = confirm && confirm !== password ? 'Passwords don’t match.' : null;
  const canSubmit = email && username && password.length >= 6 && confirm === password && !usernameError;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    await register(email, username, password);
    setBusy(false);
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
          <Text style={s.title}>Create your account</Text>
          <Text style={s.subtitle}>Share what keeps you going.</Text>

          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <TextField
            label="Username"
            value={username}
            onChangeText={(t) => setUsername(t.toLowerCase())}
            placeholder="yourname"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username-new"
            textContentType="username"
            maxLength={20}
            error={usernameError}
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            autoComplete="password-new"
            textContentType="newPassword"
          />
          <TextField
            label="Confirm password"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Type it again"
            secureTextEntry
            textContentType="newPassword"
            error={confirmError}
            onSubmitEditing={submit}
            returnKeyType="go"
          />
          <Button title="Sign up" onPress={submit} loading={busy} disabled={!canSubmit} style={s.full} />

          <Pressable onPress={() => navigation.goBack()} style={s.link} hitSlop={8}>
            <Text style={s.mutedText}>
              Have an account? <Text style={s.accentText}>Sign in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = (c, { fonts }) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    title: { color: c.text, fontFamily: fonts.bold, fontSize: 30 },
    subtitle: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 16, marginTop: 6, marginBottom: 28 },
    full: { width: '100%', marginTop: 6 },
    link: { marginTop: 20, alignSelf: 'center' },
    mutedText: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 15 },
    accentText: { color: c.accent, fontFamily: fonts.bold },
  });
