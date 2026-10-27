import React from "react";
import { View, TextInput } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

export default function SearchBar({ val, setVal }) {
    const { colors } = useTheme();

    return(
        <View style={{ flexDirection: "row", alignItems: 'center', backgroundColor: colors.input, height: 40, width: '80%', borderRadius: 16,
            paddingHorizontal: 16, marginTop: 8
        }}>
            <FontAwesome name="search" size={24} color={colors.inputText} />
            <TextInput
                value={val}
                onChangeText={setVal}
                style={{
                    fontSize: 16,
                    color: colors.inputText,
                    marginLeft: 8,
                    width: '90%'
                }}
                placeholder="Search for a song"
                placeholderTextColor={colors.placeholder}
                autoCorrect={false}
            />
        </View>
    )
}
