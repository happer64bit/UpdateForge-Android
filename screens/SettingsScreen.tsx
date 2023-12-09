import { View, Text, Switch, TouchableOpacity, Dimensions } from "react-native";
import styles from "../global.styles";
import Icon from 'react-native-vector-icons/Feather'
import { updateSettings } from "../state/settings_reducers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useToast } from "react-native-toast-notifications";
import { writeFile, mkdir, exists, ExternalStorageDirectoryPath } from 'react-native-fs';

const joinPaths = (...paths: string[]) => {
    return paths.reduce((joinedPath, pathSegment) => {
        // Ensure there is a trailing slash in the joined path
        if (joinedPath.charAt(joinedPath.length - 1) !== '/') {
            joinedPath += '/';
        }

        // Remove any leading slash from the path segment
        pathSegment = pathSegment.replace(/^\//, '');

        return joinedPath + pathSegment;
    }, '');
};

export default function SettingsScreen({ navigation }: any) {
    const dispatch = useDispatch()
    const settings = useSelector((state: any) => state.settings);
    const sources = useSelector((state: any) => state.sources);

    const toast = useToast()

    useEffect(() => {
        const fetchData = async () => {
            dispatch(updateSettings({ "updateOnLoad": settings.updateOnLoad }));
        };

        fetchData();
    }, [settings.updateOnLoad, dispatch]);

    const createBackupDirectory = async () => {
        const directoryPath = joinPaths(ExternalStorageDirectoryPath, "UpdateForge Backups");

        if (!(await exists(directoryPath))) {
            await mkdir(directoryPath);
        }
        return directoryPath;
    };

    const saveBackupToFile = async (jsonData: any) => {
        const date = new Date();
        const filename = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getTime()}.json`;
        const savePath = joinPaths(await createBackupDirectory(), filename);

        try {
            await writeFile(savePath, jsonData);
            toast.show(`Saved File to ${savePath}`);
        } catch (error: any) {
            toast.show(error.name, { type: "danger" });
        }
    };

    const onBackupButtonClicked = async () => {
        try {
            const data = sources;
            const jsonData = JSON.stringify(data, null, 2);

            await saveBackupToFile(jsonData);
        } catch (error: any) {
            toast.show(error.name, { type: "danger" });
        }
    };


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
                        <Switch value={settings.updateOnLoad} onValueChange={(event) => {
                            dispatch(updateSettings({
                                updateOnLoad: event
                            }))
                        }} />
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
                        <TouchableOpacity style={{ ...styles.defaultButton, width: "100%" }} onPress={onBackupButtonClicked}>
                            <Text style={{
                                color: "#fff"
                            }}>Backup</Text>
                            <Icon name="archive" color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ ...styles.defaultButton, width: "100%" }}>
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
                        <TouchableOpacity style={{ ...styles.defaultButton, width: "100%" }}>
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