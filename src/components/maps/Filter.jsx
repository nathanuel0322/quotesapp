import React from "react";
import { View, Image } from "react-native";
import GlobalStyles from "../../GlobalStyles";

import FilterIcon from "../../assets/icons/filter.svg";

export default function Filter() {
    return(
        <View
            style={{
                borderRadius: 18, 
                backgroundColor: GlobalStyles.colorSet.neutral11,
                alignItems: 'center',
                height: 'auto',
            }}
        >
            <FilterIcon height={55} />
        </View>
    )
}