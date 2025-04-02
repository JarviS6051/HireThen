
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Header from '../../components/Header';

const RegisterScreen = ({ navigation }) => {
    const { register, isLoading, error } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Clear errors when inputs change
    const handleNameChange = (value) => {
        setName(value);
        setNameError('');
    };

    const handleEmailChange = (value) => {
        setEmail(value);
        setEmailError('');
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        setPasswordError('');

        // Clear confirm password error if passwords now match
        if (value === confirmPassword) {
            setConfirmPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (value) => {
        setConfirmPassword(value);
        setConfirmPasswordError('');

        // Check if passwords match as user types
        if (password && value && password !== value) {
            setConfirmPasswordError('Passwords do not match');
        }
    };

    // Validate inputs
    const validateInputs = () => {
        let isValid = true;

        // Name validation
        if (!name.trim()) {
            setNameError('Name is required');
            isValid = false;
        }

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

        // Confirm password validation
        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        }

        return isValid;
    };

    // Handle register
    const handleRegister = async () => {
        if (!validateInputs()) return;

        try {
            await register(name, email, password);
        } catch (err) {
            console.log('Registration error:', err);

            // Set specific error based on response
            if (err.error === 'User already exists') {
                setEmailError('Email is already registered');
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Create Account"
                leftIcon="arrow-back"
                onLeftPress={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerContainer}>
                        <Text style={styles.subtitle}>
                            Sign up to start tracking your finances
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Input
                            label="Name"
                            value={name}
                            onChangeText={handleNameChange}
                            placeholder="Enter your name"
                            error={nameError}
                        />

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

                        <Input
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={handleConfirmPasswordChange}
                            placeholder="Confirm your password"
                            secureTextEntry
                            error={confirmPasswordError}
                        />

                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <Button
                            title="Create Account"
                            onPress={handleRegister}
                            loading={isLoading}
                            disabled={isLoading}
                        />

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Sign In</Text>
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
    },
    headerContainer: {
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.gray,
        marginBottom: 20,
    },
    formContainer: {
        marginBottom: 20,
    },
    errorText: {
        color: COLORS.danger,
        marginBottom: 10,
        textAlign: 'center',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    loginText: {
        color: COLORS.gray,
    },
    loginLink: {
        color: COLORS.primary,
        fontWeight: '600',
    },
});

export default RegisterScreen;