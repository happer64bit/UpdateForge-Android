import { View, TextInput, Image, Button, Touchable, TouchableOpacity } from "react-native";
import styles from "../global.style";
import { gql, useQuery } from "@apollo/client";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";

const ListItem = ({ event }: { event: any }) => {
    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingVertical: 5,
            marginVertical: 10
        }}>
            <View style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: 5
            }}>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 5
                    }}
                    source={{
                        uri: JSON.parse(event.data).icon,
                        method: "GET",
                    }}
                />
                <View>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: "bold"
                    }}>{event.name}</Text>
                    <Text style={{
                        fontSize: 12
                    }}>{event.description.slice(0, 30)}...</Text>
                </View>
            </View>
            <View>
                <TouchableOpacity style={styles.defaultButton}>
                    <Text style={{ color: "#fff" }}>Install</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default function () {
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [currentPage, setCurrentPage] = useState<number>(1)

    const { loading, error, data, refetch } = useQuery(
        gql`
            query Query($page: Int!) {
                apps(page: $page) {
                    id
                    name
                    description
                    headers
                    data
                    userId
                    createdAt
                }
            }
        `,
        {
            variables: { page: currentPage },
            notifyOnNetworkStatusChange: true,
            skip: !hasMore,
        }
    );

    const loadMore = () => {
        if (!loading && hasMore) {
            refetch({ page: currentPage + 1 });
        }
    };

    return (
        <View style={{
            padding: 6
        }}>
            <TextInput placeholder="Search App" style={styles.defaultInput} selectionColor={"#000"} />
            <View style={{
                marginTop: 12
            }}>
                {loading && (
                    <Text>Loading...</Text>
                )}
                {data && data.apps.map((event: any) => <ListItem event={event} key={event.id} />)}
            </View>
        </View>
    )
}