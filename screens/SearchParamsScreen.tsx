import React, { useState } from "react";
import { useEffect } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { FlatList, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import styles from '../global.styles';
import StoreListItem from "../components/StoreListItem";
import { useToast } from "react-native-toast-notifications";
import { store } from "../state/store";
import Icon from 'react-native-vector-icons/Feather'

export default function SearchParamsScreen({ route, navigation }: any) {
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [list, setList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const { query } = route.params

    const toast = useToast();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // @ts-ignore
            setList(store.getState().sources);
        });
        return unsubscribe;
    }, [navigation]);

    const { loading, data, refetch, variables } = useQuery(
        gql`
          query Query($query: String!) {
            searchApps(query: $query) {
            id
            name
            description
            headers
            data
            createdAt
            }
          }
        `,
        {
            variables: { query: searchQuery },
            notifyOnNetworkStatusChange: true,
            skip: !hasMore,
        },
    );

    const loadMore = () => {
        if (!loading && hasMore) {
            refetch({ page: currentPage + 1 });
        }
    };

    useEffect(() => {
        console.debug(searchQuery)
    }, [searchQuery])

    return (
        <View
            style={{
                padding: 6,
            }}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                gap: 3,
                alignItems: "center"
            }}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Icon name="arrow-left" color={"#000"} />
                </TouchableOpacity>
                <TextInput
                    placeholder="Search App"
                    style={{ ...styles.defaultInput, color: '#000' }}
                    selectionColor={'#000'}
                    placeholderTextColor={'#000'}
                    onChangeText={(event) => setSearchQuery(event)}
                    onSubmitEditing={() => navigation.navigate("SearchParamsScreen", {
                        params: {
                            query: searchQuery
                        }
                    })}
                    defaultValue={query}
                />
            </View>
            <View
                style={{
                    marginTop: 12,
                }}>
                <FlatList
                    data={data?.searchApps || []}
                    renderItem={({ item }) => (
                        <StoreListItem toast={toast} event={item} key={item.id} />
                    )}
                    keyExtractor={item => item.id.toString()}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={loading ? <Text style={{
                        color: "#000"
                    }}>Loading...</Text> : null}
                />
            </View>
        </View>
    )
}