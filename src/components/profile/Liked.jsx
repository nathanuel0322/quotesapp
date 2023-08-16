import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { Text, View } from "react-native"

export default function Liked() {
    const [likedposts, setLikedPosts] = useState([])
    useEffect(() => {
        async function fetchPosts() {
            setLikedPosts(JSON.parse(await AsyncStorage.getItem('liked')))
        }
        fetchPosts()
    }, [])

    return (
        <View style={styles.container}>
            {likedposts.map((val, index) => {
                <View style={styles.items}>
                    
                </View>
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    items: {
        width: '50%'
    }
})