
import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { COLORS } from '../../utils/constants';

const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    error,
    keyboardType = 'default',
    containerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                    inputStyle,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.gray}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize="none"
                {...props}
            />
            {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
        color: COLORS.dark,
    },
    input: {
        height: 50,
        backgroundColor: COLORS.light,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: COLORS.dark,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    inputError: {
        borderColor: COLORS.danger,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 12,
        marginTop: 4,
    },
});

export default Input;