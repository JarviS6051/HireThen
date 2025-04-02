// src/components/TransactionItem.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';

const TransactionItem = ({ transaction, onPress }) => {
    const { amount, type, category, description, date } = transaction;

    const isIncome = type === 'income';
    const iconName = isIncome ? 'arrow-down-circle' : 'arrow-up-circle';
    const iconColor = isIncome ? COLORS.success : COLORS.danger;
    const amountColor = isIncome ? COLORS.success : COLORS.danger;
    const amountPrefix = isIncome ? '+' : '-';

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress && onPress(transaction)}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Icon name={iconName} size={32} color={iconColor} />
            </View>
            <View style={styles.content}>
                <Text style={styles.category}>{category}</Text>
                {description ? (
                    <Text style={styles.description} numberOfLines={1}>
                        {description}
                    </Text>
                ) : null}
                <Text style={styles.date}>{formatDate(date)}</Text>
            </View>
            <View style={styles.amountContainer}>
                <Text style={[styles.amount, { color: amountColor }]}>
                    {amountPrefix} {formatCurrency(amount)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        marginVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    category: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.dark,
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: COLORS.gray,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default TransactionItem;