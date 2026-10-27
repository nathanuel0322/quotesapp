import React from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useTheme } from '../global/ThemeContext';

export default function StoriesBar() {
  const { colors } = useTheme();
  const ring = [styles.user_story_button, { borderColor: colors.storyRing }];
  const username = [styles.username, { color: colors.text }];

  return (
    <View style={styles.container}>
      <View style={styles.add_story_container}>
        <View style={[styles.add_story_button, { borderColor: colors.text }]}>
          <Feather
            name="plus"
            size={30}
            color={colors.text}
          />
        </View>
      </View>
      <ScrollView horizontal={true}>
        <View style={styles.user_story_container}>
          <View style={ring} />
          <Text style={username}>Username</Text>
        </View>
        <View style={{width: 10}} />
        <View style={styles.user_story_container}>
          <View style={ring} />
          <Text style={username}>Username</Text>
        </View>
        <View style={{width: 10}} />
        <View style={styles.user_story_container}>
          <View style={ring} />
          <Text style={username}>Username</Text>
        </View>
        <View style={{width: 10}} />
        <View style={styles.user_story_container}>
          <View style={ring} />
          <Text style={username}>Username</Text>
        </View>
        <View style={{width: 10}} />
        <View style={styles.user_story_container}>
          <View style={ring} />
          <Text style={username}>Username</Text>
        </View>
        <View style={{width: 10}} />
        <View style={styles.user_story_container}>
          <View style={ring} />
          <Text style={username}>Username</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  add_story_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 20,
  },
  stories_list: {},
  add_story_button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  user_story_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  user_story_button: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 20,
  },
  username: {},
});
