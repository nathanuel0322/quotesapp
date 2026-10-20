import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useStyles } from '../theme/ThemeProvider';
import { Avatar } from './ui';

export default function UserRow({ user, onPress, right }) {
  const s = useStyles(styles);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.row, pressed && { opacity: 0.7 }]}>
      <Avatar uri={user.photoURL} name={user.username} size={46} />
      <View style={s.info}>
        <Text style={s.name} numberOfLines={1}>
          @{user.username}
        </Text>
        {user.bio ? (
          <Text style={s.bio} numberOfLines={1}>
            {user.bio}
          </Text>
        ) : null}
      </View>
      {right}
    </Pressable>
  );
}

const styles = (c, { fonts }) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', columnGap: 14, paddingHorizontal: 20, paddingVertical: 10 },
    info: { flex: 1 },
    name: { color: c.text, fontFamily: fonts.semibold, fontSize: 16 },
    bio: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 13, marginTop: 2 },
  });
