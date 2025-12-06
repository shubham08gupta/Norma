import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import LogScreen from '../screens/LogScreen';
import SearchScreen from '../screens/SearchScreen';
import { Ionicons } from '@expo/vector-icons'; // Expo comes with vector icons

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Log') {
                            iconName = focused ? 'add-circle' : 'add-circle-outline';
                        } else if (route.name === 'Search') {
                            iconName = focused ? 'search' : 'search-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#007AFF',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Log" component={LogScreen} />
                <Tab.Screen name="Search" component={SearchScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
