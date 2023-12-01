import { View, TextInput } from "react-native";
import styles from "../global.style";
import { gql, useQuery } from "@apollo/client";
import { Text } from "react-native-paper";
import { useEffect, useState } from "react";

const ListItem = ({ event } : { event: any }) => {
    return (
        <View>
            <Text>{JSON.stringify(event)}</Text>
        </View>
    )
}

export default function () {
    const [ hasMore, setHasMore ] = useState<boolean>(true)
    const [ currentPage, setCurrentPage ] = useState<number>(1)

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
            skip: !hasMore
        }
    );

    const loadMore = () => {
        if (!loading && hasMore) {
            refetch({ page: currentPage + 1 });
        }
    };

    useEffect(() => {
        console.log(data)
    }, [loading, data])

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
                {data && data.apps.map((event: any) => (
                    <>
                        <ListItem event={event} key={event.id} />
                        <Text>{JSON.stringify(data)}</Text>
                    </>
                ) )}
            </View>
        </View>
    )
}