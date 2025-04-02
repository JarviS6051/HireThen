
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import Loader from '../components/common/Loader';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    const { isLoading, userToken } = useAuth();
    const [isAppReady, setIsAppReady] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setIsAppReady(true);
        }
    }, [isLoading]);

    if (!isAppReady) {
        return <Loader loading={true} overlay text="Loading..." />;
    }

    // Remove the NavigationContainer since Expo Router already provides one
    return (
        <>
            <StatusBar style="auto" />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                {userToken ? (
                    <Stack.Screen
                        name="App"
                        component={AppNavigator}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <Stack.Screen
                        name="Auth"
                        component={AuthNavigator}
                        options={{ headerShown: false }}
                    />
                )}
            </Stack.Navigator>
        </>
    );
};

export default Navigation;