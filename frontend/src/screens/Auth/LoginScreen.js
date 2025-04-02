
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const LoginScreen = ({ navigation }) => {
    const { login, isLoading, error } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Clear error when inputs change
    const handleEmailChange = (value) => {
        setEmail(value);
        setEmailError('');
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        setPasswordError('');
    };

    // Validate inputs
    const validateInputs = () => {
        let isValid = true;

        // Email validation
        if (!email.trim()) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email');
            isValid = false;
        }

        // Password validation
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    };

    // Handle login
    const handleLogin = async () => {
        if (!validateInputs()) return;

        try {
            await login(email, password);
        } catch (err) {
            console.log('Login error:', err);

            // Set specific error based on response
            if (err.error === 'Invalid credentials') {
                setEmailError('Invalid email or password');
                setPasswordError('Invalid email or password');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Finance Tracker</Text>
                        <Text style={styles.subtitle}>Sign in to manage your finances</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Input
                            label="Email"
                            value={email}
                            onChangeText={handleEmailChange}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            error={emailError}
                            autoCapitalize="none"
                        />

                        <Input
                            label="Password"
                            value={password}
                            onChangeText={handlePasswordChange}
                            placeholder="Enter your password"
                            secureTextEntry
                            error={passwordError}
                        />

                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <Button
                            title="Sign In"
                            onPress={handleLogin}
                            loading={isLoading}
                            disabled={isLoading}
                        />

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.registerLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Loader loading={isLoading} overlay />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.gray,
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 20,
    },
    errorText: {
        color: COLORS.danger,
        marginBottom: 10,
        textAlign: 'center',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    registerText: {
        color: COLORS.gray,
    },
    registerLink: {
        color: COLORS.primary,
        fontWeight: '600',
    },
});

export default LoginScreen;