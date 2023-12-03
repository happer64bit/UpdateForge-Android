import { TouchableOpacity, View } from "react-native"
import AppBar from "../components/AppBar"
import { TextInput } from "react-native"
import styles from "../global.style"
import { editSource } from "../state/sourcelist_reducers"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useToast } from "react-native-toast-notifications"
import Icon from 'react-native-vector-icons/Feather'
import { Text } from "react-native-paper"
import { store } from "../state/store"

export default function EditHeaderScreen({ route, navigation }) {
    const { id } = route.params

    const [headers, setHeaders] = useState<{ key: string, value: string }[]>([{ key: "", value: "" }]);
    const [headerErrors, setHeaderErrors] = useState<boolean[]>([false]);

    const dispatch = useDispatch();
    const toast = useToast()

    const validateHeaders = () => {
        const errors = headers.map(header => header.key.trim() === '' || header.value.trim() === '');
        setHeaderErrors(errors);
        return !errors.includes(true);
    };

    const handleAddHeaderClick = () => {
        setHeaders([...headers, { key: "", value: "" }]);
        setHeaderErrors([...headerErrors, false]);
    };

    const handleHeaderInputChange = (index: number, type: 'key' | 'value', value: string) => {
        const updatedHeaders = [...headers];
        updatedHeaders[index][type] = value;
        setHeaders(updatedHeaders);
        setHeaderErrors(headerErrors.map((error, i) => (i === index ? false : error)));
    };

    const handleRemoveHeaderClick = (index: number) => {
        const updatedHeaders = [...headers];
        updatedHeaders.splice(index, 1);
        setHeaders(updatedHeaders);

        const updatedErrors = [...headerErrors];
        updatedErrors.splice(index, 1);
        setHeaderErrors(updatedErrors);
    };

    const handleSubmit = async () => {
        try {
            const isHeaderValid = validateHeaders();

            let formattedHeaders = headers.reduce((acc: any, header) => {
                if (header.key.trim() !== '') {
                    acc[header.key] = header.value;
                }
                return acc;
            }, {});

            if (isHeaderValid) {
                try {
                    
                    if (typeof formattedHeaders == 'object') {
                        dispatch(editSource(id, {
                            headers
                        }))
                        return navigation.pop();
                    }
                } catch (jsonError: any) {
                    throw new Error(jsonError);
                }
            }
        } catch (err: any) {
            return toast.show(`Error: ${err.name}`, {
                type: "danger"
            })
        }
    };

    useEffect(() => {
        const _headers = store.getState().sources.find(source => source.id === id);
    
        if (_headers) {
            setHeaders(_headers.headers || []);
        }
    }, []);    

    return (
        <View>
            <AppBar isBackable navigation={navigation} title="Edit Header"/>
            <View style={{
                    marginTop: 10,
                    padding: 12
                }}>
                    {headers.map((event, index) => (
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            marginVertical: 4
                        }} key={index}>
                            <TextInput placeholder="Key" style={{
                                ...styles.defaultInput,
                                flex: 1,
                                color: "#000"
                            }} defaultValue={event.key} selectionColor={"#000"} onChangeText={(e) => handleHeaderInputChange(index, 'key', e)} />
                            <TextInput placeholder="Value" style={{
                                ...styles.defaultInput,
                                flex: 1,
                                color: "#000"
                            }} defaultValue={event.value} selectionColor={"#000"} onChangeText={(e) => handleHeaderInputChange(index, 'value', e)} />
                            <TouchableOpacity onPress={() => handleRemoveHeaderClick(index)}>
                                <Icon name="trash" size={20} color={"#333"} />
                            </TouchableOpacity>
                            {headerErrors[index] && <Text style={{
                                fontSize: 12,
                                color: "red"
                            }}>Both Key and Value are required</Text>}
                        </View>
                    ))}
                </View>
                <View style={{
                    marginTop: 10,
                    display: "flex",
                    gap: 3,
                    flexDirection: 'row',
                    justifyContent: "flex-end",
                    paddingHorizontal: 12
                }}>
                    <TouchableOpacity style={{
                        ...styles.defaultButton,
                        width: 100
                    }} onPress={handleAddHeaderClick}>
                        <Icon name="plus" color={'#fff'} size={13} />
                        <Text style={{
                            color: "#fff"
                        }}>
                            Add
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        ...styles.defaultButton,
                        width: 100
                    }} onPress={handleSubmit}>
                        <Text style={{
                            color: "#fff"
                        }}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>
        </View>
    )
}