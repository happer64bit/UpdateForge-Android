import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppsScreen from './screens/AppsScreen';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Icon from 'react-native-vector-icons/Feather'
import ImportSchemaScreen from './screens/ImportSchemaScreen';
import { Provider } from 'react-redux';
import { persistor, store } from './state/store';
import { PersistGate } from 'redux-persist/integration/react'
import PreviewScreen from './screens/PreviewScreen';
import { ToastProvider } from 'react-native-toast-notifications'
import EditHeaderScreen from './screens/EditHeaderScreen';

const client = new ApolloClient({
  uri: 'https://updateforge.vercel.app/api/graphql',
  cache: new InMemoryCache()
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

const FeedScreen = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: "#fff",
      },
    }} initialRouteName='_Home'>
      <Stack.Screen name='_Home' component={HomeScreen} />
      <Stack.Screen name='ImportSchemaScreen' component={ImportSchemaScreen} />
      <Stack.Screen name='PreviewScreen' component={PreviewScreen} />
      <Stack.Screen name='EditHeaderScreen' component={EditHeaderScreen} />
    </Stack.Navigator>
  )
}

export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <ToastProvider>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <ApolloProvider client={client}>
              <Tab.Navigator screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  elevation: 0,
                }
              }} initialRouteName='Home'>
                <Tab.Screen name='Home' component={FeedScreen} options={{
                  tabBarIcon: () => <Icon name='home' size={18} />,
                  lazy: true,
                  headerTitleStyle: {
                    fontFamily: 'Quicksand'
                  }
                }} />
                <Tab.Screen name='Store' component={AppsScreen} options={{
                  tabBarIcon: () => <Icon name='briefcase' size={18} />,
                  lazy: true
                }} />
                <Tab.Screen name='Settings' component={AppsScreen} options={{
                  tabBarIcon: () => <Icon name='settings' size={18} />,
                  lazy: true
                }} />
              </Tab.Navigator>
            </ApolloProvider>
          </NavigationContainer>
        </PersistGate>
      </ToastProvider>
    </Provider>
  )
}