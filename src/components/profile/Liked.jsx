import AsyncStorage from "@react-native-async-storage/async-storage"
import { collection, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { Text, View, Image } from "react-native"
import { db } from "../../../firebase"
import { Dimensions } from "react-native"
import GlobalValues from "../../GlobalValues"
import DropDownPicker from "react-native-dropdown-picker"
import { ScrollView } from "react-native"

export default function Liked() {
    const [likedposts, setLikedPosts] = useState([])
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([])

    const SCREEN_HEIGHT = Dimensions.get('window').height
    const SCREEN_WIDTH = Dimensions.get('window').width

    useEffect(() => {
        setItems(GlobalValues.emotions.map((val) => ({ label: val, value: val })))
        async function fetchPosts() {
            const likedposts = JSON.parse(await AsyncStorage.getItem('liked'))
            // console.log("liked posts:", likedposts)
            const querySnapshot = await getDocs(collection(db, 'quotes'))
            const postsarr = await Promise.all(querySnapshot.docs.map(async(doc) => {
                // console.log(doc.id, " => ", doc.data())
                // if one of the post's they've liked is present, add to array
                if (likedposts?.includes(doc.id)) {
                    return doc.data();
                }
                return null
            }))

            // Filter out null values (posts that weren't liked)
            const filteredPosts = postsarr.filter(post => post !== null);

            setLikedPosts(filteredPosts)
        }
        fetchPosts()
    }, [])

    useEffect(() => {
        console.log("\nlikedposts updated:", likedposts)
    }, [likedposts])

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
            />
            <View style={styles.container} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', }}>
                {likedposts.map((val, index) => {
                    console.log(`\nval is:${val.imglink}, lp:${likedposts}\n`)
                    return (
                        // <View key={index} style={styles.items}>
                        //     <View>
                        //         <View>
                                    <Image key={index} style={styles.imgstyles}
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
        backgroundColor: 'transparent'
    },
    items: {
        width: '100%'
    },
    imgstyles: {
        width: 150,
        height: 190,
        borderRadius: 20 
    },
    innertext: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: '#0A0B14',
      maxHeight: '30%',
      padding: 8,
      borderRadius: 16
    },
    innerview: {
      zIndex: 1000,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0, 
      justifyContent: 'center',
      alignItems: 'center'
    },
    textstyles: {
      textAlign: 'center',
      marginVertical: '2%',
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    },
})