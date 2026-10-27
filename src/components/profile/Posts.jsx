import { Text, View } from "react-native"
import { useTheme } from "../global/ThemeContext"

export default function Posts() {
    const { colors } = useTheme()

    return (
        <View>
            <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>Posts here!</Text>
        </View>
    )
}