import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import SkillsScreen from './screens/SkillsScreen';
import AddSkillScreen from './screens/AddSkillScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Skills" component={SkillsScreen} />
        <Stack.Screen name="AddSkill" component={AddSkillScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
