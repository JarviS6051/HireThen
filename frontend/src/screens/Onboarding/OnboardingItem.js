
import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { COLORS } from '../../utils/constants';

const OnboardingItem = ({ item }) => {
    const { width } = useWindowDimensions();

    return (
        <View style={[styles.container, { width }]}>
            <Image
                source={item.image}
                style={[styles.image, { width: width * 0.7, resizeMode: 'contain' }]}
            />
            <View style={styles.content}>
                <Text style={styles.title}>
                    {item.titleStart}
                    <Text style={styles.titleHighlight}> {item.titleHighlight} </Text>
                    {item.titleEnd}
                </Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        flex: 0.6,
        justifyContent: 'center',
        marginBottom: 20,
    },
    content: {
        flex: 0.4,
        alignItems: 'center',
    },
    title: {
        fontWeight: '600',
        fontSize: 24,
        marginBottom: 10,
        color: COLORS.dark,
        textAlign: 'center',
    },
    titleHighlight: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    description: {
        fontWeight: '400',
        color: COLORS.gray,
        textAlign: 'center',
        paddingHorizontal: 20,
        fontSize: 15,
        lineHeight: 22,
    },
});

export default OnboardingItem;