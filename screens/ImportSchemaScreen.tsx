import { TextInput, TouchableOpacity, View } from "react-native";
import AppBar from "../components/AppBar";
import styles from "../global.style";
import { Text } from "react-native";
import Icon from 'react-native-vector-icons/Feather'
import React, { useReducer, useState } from "react";
import sourceListReducer, { addSource } from "../state/sourcelist_reducers";
import { useDispatch } from "react-redux";
import { v4 as uuid } from 'uuid'
import 'react-native-get-random-values'

export default function ImportSchemaScreen({ navigation }: any) {
    const [headers, setHeaders] = useState<{ key: string, value: string }[]>([{ key: "", value: "" }]);
    const [urlValue, setUrlValue] = useState('');
    const [headerErrors, setHeaderErrors] = useState<boolean[]>([false]);
    const [urlError, setUrlError] = useState<boolean>(false);
    const dispatch = useDispatch();

    const handleUrlInputChange = (e) => {
        setUrlValue(e);
        setUrlError(false);
    };

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
            const isUrlValid = urlValue.trim() !== '';

            let formattedHeaders = headers.reduce((acc: any, header) => {
                if (header.key.trim() !== '') {
                    acc[header.key] = header.value;
                }
                return acc;
            }, {});

            if (isHeaderValid && isUrlValid) {
                const res = await fetch(urlValue, {
                    headers: formattedHeaders,
                });

                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                
                try {
                    const data = await res.json();
                    
                    if (typeof data == 'object') {
                        dispatch(addSource({
                            id: uuid(),
                            source_url: urlValue,
                            headers: formattedHeaders,
                            json: data
                        }))
                        return navigation.pop();
                    }
                } catch (jsonError: any) {
                    throw new Error(jsonError);
                }
            } else {
                setUrlError(!isUrlValid);
            }
        } catch (err: any) {
            console.error(err)
            // toast({
            //     title: err.message,
            //     variant: 'destructive',
            // });
        }
    };

    return (
        <View>
            <AppBar title="Import Schema" isBackable navigation={navigation} />
            <View style={{
                marginTop: 20,
                paddingHorizontal: 20
            }}>
                <TextInput placeholder="https:// or http://" style={{
                    ...styles.defaultInput,
                    fontFamily: "monospace",
                }} selectionColor={"#000"} onChangeText={handleUrlInputChange} />
                <View style={{
                    marginTop: 10
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
                                flex: 1
                            }} defaultValue={event.key} selectionColor={"#000"} onChangeText={(e) => handleHeaderInputChange(index, 'key', e)} />
                            <TextInput placeholder="Value" style={{
                                ...styles.defaultInput,
                                flex: 1
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
                    justifyContent: "flex-end"
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
        </View>
    )
}