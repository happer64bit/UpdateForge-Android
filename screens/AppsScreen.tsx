import {
  View,
  TextInput,
  FlatList,
  Text,
} from 'react-native';
import styles from '../global.styles';
import {gql, useQuery} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {useToast} from 'react-native-toast-notifications';
import {store} from '../state/store';
import StoreListItem from '../components/StoreListItem';

export default function ({navigation}: any) {
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [list, setList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // @ts-ignore
      setList(store.getState().sources);
    });
    return unsubscribe;
  }, [navigation]);
  const toast = useToast();

  useEffect(() => {
    console.log(searchQuery)
  }, [searchQuery])

  const {loading, data, refetch} = useQuery(
    gql`
      query Query($page: Int!) {
        apps(page: $page) {
          id
          name
          description
          headers
          data
          userId
          headers
          createdAt
        }
      }
    `,
    {
      variables: {page: currentPage},
      notifyOnNetworkStatusChange: true,
      skip: !hasMore,
    },
  );

  const loadMore = () => {
    if (!loading && hasMore) {
      refetch({page: currentPage + 1});
    }
  };

  return (
    <View
      style={{
        padding: 6,
      }}>
      <TextInput
        placeholder="Search App"
        style={{...styles.defaultInput, color: '#000'}}
        selectionColor={'#000'}
        placeholderTextColor={'#000'}
        onChangeText={(event) => setSearchQuery(event)}
        onSubmitEditing={() => navigation.navigate("SearchParamsScreen", {
          query: searchQuery
        })}
      />
      <View
        style={{
          marginTop: 12,
        }}>
        <FlatList
          data={data?.apps || []}
          renderItem={({item}) => (
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
  );
}
