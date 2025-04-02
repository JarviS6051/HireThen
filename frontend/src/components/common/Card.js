
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';

const Card = ({
    children,
    title,
    onPress,
    style,
    contentStyle,
    titleStyle,
    ...props
}) => {
    const CardComponent = onPress ? TouchableOpacity : View;

    return (
        <CardComponent
            style={[styles.card, style]}
            onPress={onPress}
            activeOpacity={0.7}
            {...props}
        >
            {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
            <View style={[styles.content, contentStyle]}>{children}</View>
        </CardComponent>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: COLORS.dark,
    },
    content: {
        flex: 1,
    },
});

export default Card;