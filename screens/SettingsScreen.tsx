import { View, Text, Switch, TouchableOpacity, Dimensions } from "react-native";
import styles from "../global.styles";
import Icon from 'react-native-vector-icons/Feather'

export default function SettingsScreen({ navigation } : any) {
    return (
        <View style={{
            backgroundColor: "#fff",
            height: Dimensions.get("screen").height
        }}>
            <View style={{
                padding: 20
            }}>
                <Text style={{ fontSize: 30, fontWeight: "bold", fontFamily: "Quicksand-Bold", color: "#000" }}>Settings</Text>
                <View style={{
                    marginTop: 15
                }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", fontFamily: "Quicksand-Bold", color: "#000" }}>Schema</Text>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        marginVertical: 4
                    }}>
                        <Text style={{ color: "#000" }}>Update All Schemas On Load</Text>
                        <Switch value={true}/>
                    </View>
                </View>
                <View style={{
                    marginTop: 15
                }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", fontFamily: "Quicksand-Bold", color: "#000" }}>Backup & Restore</Text>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        marginVertical: 8,
                        flexWrap: "wrap"
                    }}>
                        <TouchableOpacity style={{...styles.defaultButton, width: "100%"}}>
                            <Text style={{
                                color: "#fff"
                            }}>Backup</Text>
                            <Icon name="archive" color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{...styles.defaultButton, width: "100%"}}>
                            <Text style={{
                                color: "#fff"
                            }}>Restore</Text>
                            <Icon name="refresh-cw" color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    marginTop: 15
                }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", fontFamily: "Quicksand-Bold", color: "#000" }}>Bugs & Report</Text>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        marginVertical: 8,
                        flexWrap: "wrap"
                    }}>
                        <TouchableOpacity style={{...styles.defaultButton, width: "100%"}}>
                            <Text style={{
                                color: "#fff"
                            }}>Report a Bug</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}