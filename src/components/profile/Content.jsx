import React from 'react';
import { View, Text } from "react-native";
import Post from '../home/Post';

export const Content = () => {
    return(
        <View style={{flex: 1}}>
            <Text style={{color: 'white'}}>Content is here!</Text>
            <Post />
        </View>
    )
}