import AsyncStorage from "@react-native-async-storage/async-storage"
import { collection, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { Text, View, Image } from "react-native"
import { db } from "../../../firebase"
import { Dimensions } from "react-native"
import GlobalValues from "../../GlobalValues"
import DropDownPicker from "react-native-dropdown-picker"
import { useTheme } from "../global/ThemeContext"

export default function Liked() {
    const [likedposts, setLikedPosts] = useState([])
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([])
    const { colors, isDarkMode } = useTheme()

    useEffect(() => {
        setItems(GlobalValues.emotions.map((val) => ({ label: val, value: val })))
        async function fetchPosts() {
            const likedposts = JSON.parse(await AsyncStorage.getItem('liked'))
            // console.log("liked posts:", likedposts)
            const querySnapshot = await getDocs(collection(db, 'quotes'))
            // keep only the posts they've liked
            setLikedPosts(querySnapshot.docs
                .filter((doc) => likedposts?.includes(doc.id))
                .map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        fetchPosts().catch((e) => console.log("Loading liked posts failed:", e))
    }, [])

    return (
        <View>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                multiple={true}
                min={0}
                max={5}
                searchable={true}
                theme={isDarkMode ? "DARK" : "LIGHT"}
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                dropDownContainerStyle={{ backgroundColor: colors.surface, borderColor: colors.border }}
                textStyle={{ color: colors.text }}
                placeholderStyle={{ color: colors.textSecondary }}
            />
            <View style={styles.container}>
                {likedposts.map((val) => {
                    return (
                        // <View key={index} style={styles.items}>
                        //     <View>
                        //         <View>
                                    <Image key={val.id} style={styles.imgstyles}
                                        source={{ uri: val.imglink }}
                                    />
                                    //middle text
                        //             <View style={styles.innerview}>
                        //                 <View style={styles.innertext}>
                        //                     <Text style={styles.textstyles}>Emotion: {val.phrase}</Text>
                        //                     <Text style={styles.textstyles}>{val.text}</Text>
                        //                     <Text style={styles.textstyles}>Posted by {val.username}</Text>
                        //                 </View>
                        //             </View>
                        //         </View>
                        //     </View>
                        // </View>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginTop: 12,
    },
    items: {
        width: '100%'
    },
    imgstyles: {
        width: 150,
        height: 190,
        borderRadius: 20 
    },
})