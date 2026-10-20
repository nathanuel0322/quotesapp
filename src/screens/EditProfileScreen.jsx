import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Toast } from 'toastify-react-native';
import { useAuth } from '../context/AuthProvider';
import { useStyles } from '../theme/ThemeProvider';
import { normalizeUsername, renameUser, updateBio, updateProfilePhoto, USERNAME_RULES, validateUsername } from '../services/users';
import { Avatar, Button, TextField } from '../components/ui';

const BIO_MAX = 160;

export default function EditProfileScreen({ navigation }) {
  const { user, profile } = useAuth();
  const s = useStyles(styles);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const name = normalizeUsername(username);
  const usernameError = validateUsername(name) ? USERNAME_RULES : null;
  const dirty = name !== profile.username || bio.trim() !== (profile.bio ?? '');

  const changePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.9 });
    if (result.canceled || !result.assets?.[0]) return;
    setUploading(true);
    try {
      await updateProfilePhoto(user, result.assets[0].uri);
    } catch {
      Toast.error('Upload failed, try again.');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (usernameError || !dirty) return;
    setSaving(true);
    try {
      if (name !== profile.username) await renameUser(user, profile.username, name);
      if (bio.trim() !== (profile.bio ?? '')) await updateBio(user.uid, bio);
      Toast.success('Profile updated.');
      navigation.goBack();
    } catch (e) {
      Toast.error(e.code === 'username-taken' ? 'That username is taken.' : 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.flex} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Pressable onPress={changePhoto} style={s.avatarWrap} disabled={uploading}>
          <Avatar uri={profile.photoURL} name={profile.username} size={104} />
          <View style={s.avatarLabel}>
            {uploading ? <ActivityIndicator size="small" /> : <Text style={s.changeText}>Change photo</Text>}
          </View>
        </Pressable>

        <TextField
          label="Username"
          value={username}
          onChangeText={(t) => setUsername(t.toLowerCase())}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={20}
          error={usernameError}
        />
        <TextField
          label={`Bio (${bio.length}/${BIO_MAX})`}
          value={bio}
          onChangeText={setBio}
          placeholder="What keeps you going?"
          multiline
          maxLength={BIO_MAX}
          inputStyle={{ minHeight: 96, textAlignVertical: 'top' }}
        />
        <Button title="Save" onPress={save} loading={saving} disabled={!dirty || !!usernameError} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (c, { fonts }) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: c.background },
    content: { padding: 20 },
    avatarWrap: { alignItems: 'center', marginBottom: 24 },
    avatarLabel: { marginTop: 10, minHeight: 20 },
    changeText: { color: c.accent, fontFamily: fonts.semibold, fontSize: 15 },
  });
