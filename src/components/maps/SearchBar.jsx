import React from "react";
import { View, Pressable, Image, Text } from "react-native";
import GlobalStyles from "../../GlobalStyles";

import SearchIcon from "../../assets/icons/searchicon.svg";

export default function SearchBar() {
    return(
        <Pressable
            style={{
                flex: 1,
                width: 'auto',
                height: 'auto',
                backgroundColor: GlobalStyles.colorSet.neutral11,
                borderRadius: 18,
            }}
            onPress={() => console.log('Pressed!')}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: 'center',
                    marginLeft: 18,
                    paddingHorizontal: -4,
                }}
            >
                <SearchIcon width={20} height={20} marginHorizontal={4}/>
                <Text
                    style={{
                        fontSize: 16,
                        color: GlobalStyles.colorSet.neutral5,
                        marginHorizontal: 4,
                    }}
                >
                    Search
                </Text>
            </View>
        </Pressable>
    )
}