import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native';
import styles from '../global.styles';
import {gql, useQuery} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {addSource} from '../state/sourcelist_reducers';
import {useToast} from 'react-native-toast-notifications';
import {v4 as uuid} from 'uuid';
import {useDispatch} from 'react-redux';
import {store} from '../state/store';

const ListItem = React.memo(({event, toast}: {event: any; toast: any}) => {
  const dispatch = useDispatch();

  const onInstallButtonClick = async () => {
    try {
      console.log(`Fetching ${JSON.parse(event.data).channelURL}`);
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
          <Text style={{color: '#fff'}}>Install</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function ({navigation}: any) {
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setList(store.getState().sources);
    });
    console.log(list);
    return unsubscribe;
  }, [navigation]);
  const toast = useToast();

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
      />
      <View
        style={{
          marginTop: 12,
        }}>
        <FlatList
          data={data?.apps || []}
          renderItem={({item}) => (
            <ListItem toast={toast} event={item} key={item.id} />
          )}
          keyExtractor={item => item.id.toString()}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={loading ? <Text>Loading...</Text> : null}
        />
      </View>
    </View>
  );
}
