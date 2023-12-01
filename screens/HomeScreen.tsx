import {
    Button,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import styles from '../global.style'

export default function HomeScreen() {
    return (
        <View>
            <View style={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingHorizontal: 12,
                paddingVertical: 10
            }}>
                <TouchableOpacity style={styles.defaultButton}>
                    <Text style={{ color: "white" }}>Import Schema</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.defaultButton}>
                    <Text style={{ color: "white" }}>Update</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

