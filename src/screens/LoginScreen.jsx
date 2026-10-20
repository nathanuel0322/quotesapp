import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useAuth } from '../context/AuthProvider';
import { useStyles } from '../theme/ThemeProvider';
import { Button, TextField } from '../components/ui';

export default function LoginScreen({ navigation }) {
  const { login, resetPassword } = useAuth();
  const s = useStyles(styles);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    await login(email, password);
    setBusy(false);
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
          <Image source={require('../assets/brand/logo.jpg')} style={s.logo} />
          <Text style={s.tagline}>Daily motivation, one swipe at a time.</Text>

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
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            onSubmitEditing={submit}
            returnKeyType="go"
          />
          <Button title="Sign in" onPress={submit} loading={busy} disabled={!email || !password} style={s.full} />

          <Pressable onPress={() => resetPassword(email)} style={s.link} hitSlop={8}>
            <Text style={s.linkText}>Forgot password?</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Signup')} style={s.link} hitSlop={8}>
            <Text style={s.mutedText}>
              New here? <Text style={s.accentText}>Create an account</Text>
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
    container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    logo: { width: 180, height: 180, borderRadius: 40, marginBottom: 16 },
    tagline: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 16, marginBottom: 32, textAlign: 'center' },
    full: { width: '100%', marginTop: 6 },
    link: { marginTop: 20 },
    linkText: { color: c.textMuted, fontFamily: fonts.semibold, fontSize: 15 },
    mutedText: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 15 },
    accentText: { color: c.accent, fontFamily: fonts.bold },
  });
