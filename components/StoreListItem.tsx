import { v4 as uuid } from 'uuid';
import { useDispatch } from 'react-redux';
import { addSource } from "../state/sourcelist_reducers";
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from '../global.styles';

const StoreListItem = React.memo(({ event, toast }: { event: any; toast: any }) => {
    const dispatch = useDispatch();

    const onInstallButtonClick = async () => {
        try {
            const res = await fetch(JSON.parse(event.data).channelURL, {
                headers: JSON.parse(event.headers) || {},
            });
            console.log(`IsOk ${res.ok}`);
            if (res.ok) {
                const json = await res.json();

                dispatch(
                    addSource({
                        id: uuid(),
                        source_url: JSON.parse(event.data).channelURL,
                        headers: event.headers,
                        json,
                    }),
                );

                return toast.show('Installed Successfully');
            } else {
                throw new Error('Failed to install');
            }
        } catch (error: any) {
            return toast.show(`Error: ${error.message}`, {
                type: 'danger',
            });
        }
    };

    return (
        <View
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                paddingVertical: 5,
                marginVertical: 10,
            }}>
            <View
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 5,
                }}>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 5,
                    }}
                    source={{
                        uri: JSON.parse(event.data).icon,
                        method: 'GET',
                    }}
                />
                <View>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: "#000"
                        }}>
                        {event.name}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: "#000"
                        }}>
                        {event.description.slice(0, 30)}...
                    </Text>
                </View>
            </View>
            <View>
                <TouchableOpacity
                    style={styles.defaultButton}
                    onPress={onInstallButtonClick}>
                    <Text style={{ color: '#fff' }}>Install</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

export default StoreListItem