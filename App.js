import {StyleSheet, Text, View} from 'react-native';
import React,{useEffect}from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import Login from './Screens/Login';
import Home from './Screens/Home';

import Chat from './Screens/Chat';
import { NotificationListner, requestUserPermission } from './src/utils/pushnotification_helper';

const App = props => {
  const Stack = createNativeStackNavigator();
useEffect(() => {
 requestUserPermission();
 NotificationListner();


}, [])

  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator name="Home">
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{headerShown: false}}
         
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </NativeBaseProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
