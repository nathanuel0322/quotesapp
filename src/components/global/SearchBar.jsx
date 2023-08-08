import React from "react";
import { View, TextInput } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

export default function SearchBar({ val, setVal }) {
    return(
        <View style={{ flexDirection: "row", alignItems: 'center', backgroundColor: 'white', height: 40, width: '80%', borderRadius: 16,
            paddingHorizontal: 16, marginTop: 8
        }}>
            <FontAwesome name="search" size={24} color="black" />
            <TextInput
                value={val}
                onChangeText={setVal}
                style={{
                    fontSize: 16,
                    color: 'black',
                    marginLeft: 8,
                    width: '90%'
                }}
                placeholder="Search for a song"
            />
        </View>
    )
}