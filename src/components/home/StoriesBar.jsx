import React from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import { Feather } from '@expo/vector-icons';

import GlobalStyles from '../../GlobalStyles';

export default function StoriesBar() {
  return (
    <View style={styles.container}>
      <View style={styles.add_story_container}>
        <View style={styles.add_story_button}>
          <Feather
            name="plus"
            size={30}
            color={GlobalStyles.colorSet.text}
          />
        </View>
      </View>
      <ScrollView horizontal={true}>
        <View style={styles.user_story_container}>
          <View style={styles.user_story_button} />
          <Text style={styles.username}>Username</Text>
        </View>
        <View style={{width: 10}} />
        <View style={styles.user_story_container}>
          <View style={styles.user_story_button} />
          <Text style={styles.username}>Username</Text>
        </View>
        <View style={{width: 10}} />
        <View style={styles.user_story_container}>
          <View style={styles.user_story_button} />
          <Text style={styles.username}>Username</Text>
        </View>
        <View style={{width: 10}} />
        <View style={styles.user_story_container}>
          <View style={styles.user_story_button} />
          <Text style={styles.username}>Username</Text>
        </View>
        <View style={{width: 10}} />
        <View style={styles.user_story_container}>
          <View style={styles.user_story_button} />
          <Text style={styles.username}>Username</Text>
        </View>
        <View style={{width: 10}} />
        <View style={styles.user_story_container}>
          <View style={styles.user_story_button} />
          <Text style={styles.username}>Username</Text>
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
    borderColor: GlobalStyles.colorSet.text,
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
    borderColor: '#ffa41b',
  },
  username: {
    color: GlobalStyles.colorSet.text,
  },
});
