import {
    Button,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import styles from '../global.style'
import Icon from 'react-native-vector-icons/Feather'
import { store } from '../state/store'
import { useEffect, useState } from 'react'

export default function HomeScreen({ navigation }: any) {
    const [list, setList] = useState<any[]>([])
    const [isloading, setIsLoading] = useState<boolean>(true)

    function refetch() {
        setIsLoading(true)
        setList(store.getState().sources)
        console.log(list)
        setIsLoading(false)
    }

    useEffect(() => {
        setList(store.getState().sources)
        setIsLoading(false)
    })

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
                <TouchableOpacity style={styles.defaultButton} onPress={() => navigation.navigate("ImportSchemaScreen")} disabled={isloading}>
                    <Icon name='file-plus' color={"#fff"} />
                    <Text style={{ color: "white" }}>
                        Import Schema
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.defaultButton} onPress={refetch} disabled={isloading}>
                    <Icon name="rotate-ccw" color={"#fff"} />
                    <Text style={{ color: "white" }} >Update</Text>
                </TouchableOpacity>
            </View>
            <View style={{
                marginVertical: 20
            }}>
                {isloading && (
                    <Text>Loading...</Text>
                )}
                {!isloading && list.map((event: any) => (
                    <TouchableOpacity key={event.id} style={{
                        marginVertical: 10,
                        marginHorizontal: 10,
                        padding: 12,
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row"
                    }} onPress={() => navigation.navigate("PreviewScreen", {
                        data: event
                    })}>
                        <View style={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "center" }}>
                            <Image source={{
                                uri: event.json.metadata.icon,
                                width: 50,
                                height: 50,
                                method: "GET",
                            }} />
                            <View>
                                <Text style={{ color: "#000", fontWeight: "bold", fontSize: 24}}>{event.json.metadata.name}</Text>
                                <Text style={{ color: "#000" }}>{event.json.metadata.description.slice(0, 100)}...</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

