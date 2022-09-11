import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import Login from './../screens/Login';
import Signup from './../screens/Singup';
import Photo from '../screens/Photo';

const Stack = createStackNavigator();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen options={{ headerShown: false }} name="Photo" component={Photo} /> */}
        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="Signup" component={Signup} />
        <Stack.Screen options={{ headerShown: false }} name="Photo" component={Photo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
