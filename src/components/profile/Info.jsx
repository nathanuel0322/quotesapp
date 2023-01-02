import React from 'react';
import { View, Text } from "react-native";
import Post from '../home/Post';

export const Info = () => {
    return(
        <View style={{width: '100%', flex: 1, position: 'absolute', top: 550}}>
            <View style={{height: 20}} />
            <View style={{marginVertical: 20, height: 1, backgroundColor: '#222'}} />            
            <Post />
        </View>
    )
}