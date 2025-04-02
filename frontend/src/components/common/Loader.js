
import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { COLORS } from '../../utils/constants';

const Loader = ({
    loading = true,
    size = 'large',
    color = COLORS.primary,
    text,
    overlay = false,
    ...props
}) => {
    if (!loading) return null;

    return (
        <View
            style={[
                styles.container,
                overlay && styles.overlay,
                props.style,
            ]}
            {...props}
        >
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.8)',
        zIndex: 999,
    },
    text: {
        marginTop: 10,
        color: COLORS.dark,
        fontSize: 14,
    },
});

export default Loader;