
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '../../utils/constants';

const Button = ({
    title,
    onPress,
    type = 'primary',
    disabled = false,
    loading = false,
    style,
    textStyle,
    ...props
}) => {
    const buttonStyles = [
        styles.button,
        styles[`${type}Button`],
        disabled && styles.disabledButton,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`${type}Text`],
        disabled && styles.disabledText,
        textStyle,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator size="small" color={type === 'outline' ? COLORS.primary : COLORS.white} />
            ) : (
                <Text style={textStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    secondaryButton: {
        backgroundColor: COLORS.secondary,
    },
    dangerButton: {
        backgroundColor: COLORS.danger,
    },
    disabledButton: {
        backgroundColor: COLORS.lightGray,
        borderColor: COLORS.lightGray,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    primaryText: {
        color: COLORS.white,
    },
    outlineText: {
        color: COLORS.primary,
    },
    secondaryText: {
        color: COLORS.white,
    },
    dangerText: {
        color: COLORS.white,
    },
    disabledText: {
        color: COLORS.gray,
    },
});

export default Button;