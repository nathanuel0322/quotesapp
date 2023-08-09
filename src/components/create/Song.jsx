import { useState } from 'react';
import { TouchableOpacity, Image, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import GlobalStyles from '../../GlobalStyles';

export default function Song({ parentCallback, val, index, playSound, stopSound }) {
    const [soundstate, setSoundState] = useState('play')
    return (
        <TouchableOpacity style={{ flexDirection: 'row', width: '80%', padding: 8, alignItems: 'center' }} key={index} onPress={() => {
            parentCallback(val.preview)
        }}
        >
            <Image source={{ uri: val.album.cover }} width={50} height={50}  style={{ borderRadius: 6 }}
                // placeholder={blurhash}
                // contentFit="cover"
                // transition={1000}
            />
            <View style={{ marginLeft: 12, maxWidth: '70%' }}>
                <Text style={{ color: 'white', fontFamily: GlobalStyles.fontSet.fontsemibold }}>{val.title}</Text>
                <Text style={{ color: 'white', fontFamily: GlobalStyles.fontSet.font }}>{val.artist.name}</Text>
            </View>
            <TouchableOpacity style={{ position: 'absolute', right: 8 }} onPress={() => {
                if (soundstate === 'play') {
                    setSoundState('pause')
                    playSound(val.preview)
                } else {
                    stopSound()
                    setSoundState('play')
                }
            }}>
                <FontAwesome5 name={soundstate} size={24} color="white" />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
