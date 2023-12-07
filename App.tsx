import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen.tsx';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AppsScreen from './screens/AppsScreen.tsx';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import Icon from 'react-native-vector-icons/Feather';
import ImportSchemaScreen from './screens/ImportSchemaScreen.tsx';
import {Provider} from 'react-redux';
import {persistor, store} from './state/store.ts';
import {PersistGate} from 'redux-persist/integration/react';
import PreviewScreen from './screens/PreviewScreen.tsx';
import {ToastProvider} from 'react-native-toast-notifications';
import EditHeaderScreen from './screens/EditHeaderScreen.tsx';
import ViewMetadataScreen from './screens/ViewMetadataScreen.tsx';
import SettingsScreen from './screens/SettingsScreen.tsx';

const client = new ApolloClient({
  uri: 'https://updateforge.vercel.app/api/graphql',
  cache: new InMemoryCache(),
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const FeedScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#fff',
        },
      }}
      initialRouteName="_Home">
      <Stack.Screen name="_Home" component={HomeScreen} />
      <Stack.Screen name="ImportSchemaScreen" component={ImportSchemaScreen} />
      <Stack.Screen name="PreviewScreen" component={PreviewScreen} />
      <Stack.Screen name="ViewMetadataScreen" component={ViewMetadataScreen} />
      <Stack.Screen name="EditHeaderScreen" component={EditHeaderScreen} />
    </Stack.Navigator>
  );
};

export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          <NavigationContainer>
            <ApolloProvider client={client}>
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarStyle: {
                    elevation: 0,
                    backgroundColor: '#fff',
                  },
                }}
                initialRouteName="Home">
                <Tab.Screen
                  name="Home"
                  component={FeedScreen}
                  options={{
                    tabBarIcon: () => (
                      <Icon name="home" size={18} color={'#000'} />
                    ),
                    lazy: true,
                    headerTitleStyle: {
                      fontFamily: 'Quicksand',
                    },
                  }}
                />
                <Tab.Screen
                  name="Store"
                  component={AppsScreen}
                  options={{
                    tabBarIcon: () => (
                      <Icon name="briefcase" size={18} color={'#000'} />
                    ),
                    lazy: true,
                  }}
                />
                <Tab.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{
                    tabBarIcon: () => (
                      <Icon name="settings" size={18} color={'#000'} />
                    ),
                    lazy: true,
                  }}
                />
              </Tab.Navigator>
            </ApolloProvider>
          </NavigationContainer>
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}
