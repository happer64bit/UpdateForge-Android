import { Platform, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import AppBar from "../components/AppBar";
import styles from "../global.styles";
import Icon from 'react-native-vector-icons/Feather'
import { useDispatch } from "react-redux";
import { removeSource } from "../state/sourcelist_reducers";
import { useToast } from "react-native-toast-notifications";
import RNFetchBlob from 'rn-fetch-blob'

export default function PreviewScreen({ route, navigation }: any) {
    const { data } = route.params
    const toast = useToast()
    const dispatch = useDispatch()

    async function downloadFile(url: string, headers?: object) {
        let dirs = RNFetchBlob.fs.dirs;

        var filename = url.split('/').pop()

        RNFetchBlob.config({
            path: `${dirs.DownloadDir}/updateforge-${filename}`,
            fileCache: false,
            addAndroidDownloads: {
                notification: true,
                title: "Downloading",
                description: `Downloading from ${url}`,
                useDownloadManager: true
            }
        })
            .fetch('GET', url, {
                'Cache-Control': 'no-store',
                ...headers
            })
            .progress({ interval: 250 }, (received, total) => {
                console.log('progress', received / total);
            })
            .then((res) => {
                if (Platform.OS === 'ios') {
                    RNFetchBlob.ios.openDocument(res.path());
                } else {
                    RNFetchBlob.android.actionViewIntent(
                        res.path(),
                        'application/pdf'
                    );
                }
            })
            .catch((reason) => {
                toast.show(`Error downloading file: ${reason}`, {
                    type: "danger"
                })
            });
    }

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
                    }} onPress={() => navigation.navigate("EditHeaderScreen", { id: data.id })}>
                        <Icon name="edit" color={"#000"} size={16} />
                        <Text style={{ color: "#000", fontSize: 16 }}>Edit Header</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        ...styles.ghostButton,
                        gap: 5,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }} onPress={() => {
                        const isDeleted = dispatch(removeSource(data.id))

                        if (isDeleted) {
                            toast.show("Successfully deleted", {
                                type: "success",
                            });
                            navigation.pop();
                        } else {
                            toast.show("Failed to delete", {
                                type: "danger",
                            });
                        }

                    }}>
                        <Icon name="trash" color={"red"} size={16} />
                        <Text style={{ color: "red", fontSize: 16 }}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        ...styles.ghostButton,
                        gap: 5,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }} onPress={() => navigation.navigate("ViewMetadataScreen", {
                        metadata: data.json.metadata
                    })}>
                        <Icon name="info" color={"#000"} size={16} />
                        <Text style={{ color: "#000", fontSize: 16 }}>Metadata</Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    paddingHorizontal: 10,
                    marginTop: 20
                }}>
                    {data.json.list.map((event: any) => (
                        <View key={event.version} style={{
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
                                        backgroundColor: "#000",
                                        marginLeft: 6
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
                                    <TouchableOpacity style={{ ...styles.defaultButton, ...styles.defaultFont }} onPress={async() => await downloadFile(event.downloadUrl, data.headers)}>
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