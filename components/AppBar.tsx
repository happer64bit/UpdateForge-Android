import { Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Feather'

export default function AppBar({ title, isBackable, navigation } : { title: string, isBackable: true | boolean, navigation: any }) {
    return (
        <View style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 20,
            paddingVertical: 15
        }}>
            <View style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexDirection: "row"
            }}>
                {isBackable && (
                    <TouchableOpacity onPress={() => navigation.pop() }>
                        <Icon name="arrow-left" color={"#111"} size={20}/>
                    </TouchableOpacity>
                )}
                <Text style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#000",
                    fontFamily: "Quicksand-Regular"
                }}>{title}</Text>
            </View>
        </View>
    )
}