import { useState } from 'react';
import { TouchableOpacity, Image, Text, View, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import GlobalStyles from '../../GlobalStyles';

export default function Song({ parentCallback, val, playSound, stopSound }) {
    const [soundstate, setSoundState] = useState('play')
    const [songplaying, setSongPlaying] = useState(false)
    
    // when song finishes playing, change icon back to play
    async function onPlaybackStatusUpdate(status) {
        setSongPlaying(prevSongPlaying => {
            if (prevSongPlaying && !status.isPlaying) {
                setSoundState('play')
            }
            return status.isPlaying
        })
    };

    return (
        <TouchableOpacity style={{ flexDirection: 'row', width: '80%', padding: 8, alignItems: 'center' }} onPress={() => {
            parentCallback({ link: val.preview, pic: val.album.cover, artist: val.artist.name, name: val.title})
        }}>
            <Image source={{ uri: val.album.cover }} width={50} height={50}  style={{ borderRadius: 6 }} />
            <View style={{ marginLeft: 12, maxWidth: '70%' }}>
                <Text style={{ color: 'white', fontFamily: GlobalStyles.fontSet.fontsemibold }}>{val.title}</Text>
                <Text style={{ color: 'white', fontFamily: GlobalStyles.fontSet.font }}>{val.artist.name}</Text>
            </View>
            <TouchableOpacity style={{ position: 'absolute', right: 8 }} onPress={async() => {
                if (soundstate === 'play') {
                    setSoundState('pause')
                    playSound(val.preview, onPlaybackStatusUpdate)
                } else {
                    stopSound()
                    setSoundState('play')
                }
            }}>
                {/* if song isn't playing, show play icon, but if it is, show loading if mp3 is loading, pause icon if it isn't */}
                {soundstate === 'play' ? 
                    <FontAwesome5 name={'play'} size={24} color="white" />
                :
                    songplaying ? 
                        <FontAwesome5 name={'pause'} size={24} color="white" />
                    :
                        <ActivityIndicator size={24} color="white" />
                }
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
