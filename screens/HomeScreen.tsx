import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import styles from '../global.styles'
import Icon from 'react-native-vector-icons/Feather'
import { store } from '../state/store'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editSource } from "../state/sourcelist_reducers";
import { useToast } from 'react-native-toast-notifications'
import AppBar from '../components/AppBar'

export default function HomeScreen({ navigation }: any) {
    const [list, setList] = useState<any[]>([])
    const [isloading, setIsLoading] = useState<boolean>(true)
    const toast = useToast()
    const dataFetchedRef = useRef(false);

    const settings = useSelector((state: any) => state.settings)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // @ts-ignore
            setList(store.getState().sources)
        });

        return unsubscribe;
    }, [navigation])

    useEffect(() => {
        if(dataFetchedRef.current) return

        if (settings.updateOnLoad) {
            updateButtonOnClick();
            dataFetchedRef.current = true
        }
    }, [])

    async function updateButtonOnClick() {
        setIsLoading(true);
        let updatedWithoutError = true;

        try {
            const schemas = list;
            
            await Promise.all(
                schemas.map(async (event: any) => {
                    const res = await fetch(event.source_url, {
                        headers: Object(event.headers),
                    });

                    if (res.ok) {
                        const body = await res.json();
                        editSource(event.id, { ...body });
                    } else {
                        updatedWithoutError = false
                        return toast.show(`Failed to update for ${event.json.metadata.name}`, {
                            type: "danger"
                        })
                    }
                })
            )
            if(updatedWithoutError) {
                return toast.show("Updated All Schema");
            }
            toast.show("Failed To Update", {
                type: "danger"
            })
        } catch (err: any) {
            updatedWithoutError = false
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // @ts-ignore
        setList(store.getState().sources)
        setIsLoading(false)
    }, [])

    return (
        <View>
            <AppBar title='UpdateForge' isBackable={false} navigation={navigation} />
            <View style={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingHorizontal: 12,
                paddingTop: 10
            }}>
                <TouchableOpacity style={styles.defaultButton} onPress={() => navigation.navigate("ImportSchemaScreen")} disabled={isloading}>
                    <Icon name='file-plus' color={"#fff"} />
                    <Text style={{ color: "white" }}>
                        Import Schema
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.defaultButton} onPress={updateButtonOnClick} disabled={isloading}>
                    <Icon name="rotate-ccw" color={"#fff"} />
                    <Text style={{ color: "white" }}>Update</Text>
                </TouchableOpacity>
            </View>
            <View style={{
                marginVertical: 10
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
                                <Text style={{ color: "#000", fontWeight: "bold", fontSize: 24 }}>
                                    {event.json.metadata.name.length > 18
                                        ? `${event.json.metadata.name.slice(0, 18)}...`
                                        : event.json.metadata.name
                                    }
                                </Text>
                                {event.json.metadata.description
                                    ? (event.json.metadata.description.length > 100
                                        ? <Text>String(`${event.json.metadata.description.slice(0, 100)}...`)</Text>
                                        : <Text style={{ color: "#000" }}>{String(event.json.metadata.description)}</Text>
                                    )
                                    : <Text style={{ color: "#000" }}>No Description Provided</Text>
                                }
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

