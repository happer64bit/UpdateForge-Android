import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import AppBar from "../components/AppBar";
import styles from "../global.style";
import Icon from 'react-native-vector-icons/Feather'

export default function PreviewScreen({ route, navigation }) {
    const { data } = route.params

    return (
        <View>
            <AppBar title={data.json.metadata.name} isBackable navigation={navigation} />
            <View style={{
                marginTop: 10,
                paddingHorizontal: 5,
            }}>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <TouchableOpacity style={{
                        ...styles.ghostButton,
                        gap: 5,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <Icon name="edit" color={"#000"} size={17}/>
                        <Text style={{ color: "#000", fontSize: 17 }}>Edit Header</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        ...styles.ghostButton,
                        gap: 5,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <Icon name="trash" color={"red"} size={17}/>
                        <Text style={{ color: "red", fontSize: 17 }}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        ...styles.ghostButton,
                        gap: 5,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <Icon name="info" color={"#000"} size={17}/>
                        <Text style={{ color: "#000", fontSize: 17 }}>Metadata</Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    paddingHorizontal: 10,
                    marginTop: 20
                }}>
                    {data.json.list.map((event) => (
                        <View key={event.id} style={{
                            marginVertical: 5
                        }}>
                            <View style={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: "row"
                            }}>
                                <View style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3,
                                    flexDirection: "row"
                                }}>
                                    <Text style={{
                                        color: "#000",
                                        fontSize: 20,
                                        fontWeight: "600",
                                        fontFamily: "Quicksand-Medium"
                                    }}>{event.version}</Text>
                                    <View style={{
                                        paddingHorizontal: 0,
                                        paddingVertical: 0,
                                        minWidth: 16,
                                        height: 16,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 8,
                                        backgroundColor: "#000"
                                    }}>
                                        <Text style={{
                                            color: "#fff",
                                            fontSize: 12,
                                            paddingHorizontal: 14
                                        }}>{event.type}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3,
                                    flexDirection: "row"
                                }}>
                                    <TouchableOpacity style={{...styles.defaultButton, ...styles.defaultFont}}>
                                        <Text style={{ color: "#fff" }}>Download</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )
}