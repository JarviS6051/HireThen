
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import TransactionListScreen from '../screens/Transaction/TransactionListScreen';
import TransactionCreateScreen from '../screens/Transaction/TransactionCreateScreen';
import BudgetListScreen from '../screens/Budget/BudgetListScreen';
import BudgetCreateScreen from '../screens/Budget/BudgetCreateScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Transaction Stack Navigator
const TransactionStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="TransactionList" component={TransactionListScreen} />
            <Stack.Screen name="TransactionCreate" component={TransactionCreateScreen} />
        </Stack.Navigator>
    );
};

// Budget Stack Navigator
const BudgetStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="BudgetList" component={BudgetListScreen} />
            <Stack.Screen name="BudgetCreate" component={BudgetCreateScreen} />
        </Stack.Navigator>
    );
};

// Main Tab Navigator
const AppNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 10,
                    paddingTop: 5,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    } else if (route.name === 'Transactions') {
                        iconName = focused ? 'swap-vertical' : 'swap-vertical-outline';
                    } else if (route.name === 'Budgets') {
                        iconName = focused ? 'wallet' : 'wallet-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    title: "Dashboard",
                }}
            />
            <Tab.Screen
                name="Transactions"
                component={TransactionStack}
                options={{
                    title: "Transactions",
                }}
            />
            <Tab.Screen
                name="Budgets"
                component={BudgetStack}
                options={{
                    title: "Budgets",
                }}
            />
        </Tab.Navigator>
    );
};

export default AppNavigator;