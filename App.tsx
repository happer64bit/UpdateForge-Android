import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppsScreen from './screens/AppsScreen';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://updateforge.vercel.app/api/graphql',
  cache: new InMemoryCache()
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

const FeedScreen = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }} initialRouteName='_Home'>
      <Stack.Screen name='_Home' component={HomeScreen} />
    </Stack.Navigator>
  )
}

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <ApolloProvider client={client}>
        <Tab.Navigator screenOptions={{
          headerShown: false
        }} initialRouteName='Home'>
          <Tab.Screen name='Home' component={FeedScreen} />
          <Tab.Screen name='Store' component={AppsScreen} />
        </Tab.Navigator>
      </ApolloProvider>
    </NavigationContainer>
  )
}