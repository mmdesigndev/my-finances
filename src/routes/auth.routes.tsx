import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import { SignIn } from '../screens/SignIn'

const Stack = createStackNavigator()

// Public routes
export function AuthRoutes() {
  
  return (
    <Stack.Navigator
      headerMode="none"
    >
      <Stack.Screen name="signIn" component={SignIn}/>
    </Stack.Navigator>
  )
}