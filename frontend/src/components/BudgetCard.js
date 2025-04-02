
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../utils/constants';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const BudgetCard = ({ budget, onPress }) => {
    const {
        budget: { category, amount, period, alertThreshold },
        spent,
        remaining,
        percentUsed,
        isAlertTriggered
    } = budget;

    const progressColor = isAlertTriggered ? COLORS.danger :
        percentUsed > 50 ? COLORS.warning : COLORS.success;

    const periodLabel = period.charAt(0).toUpperCase() + period.slice(1);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress && onPress(budget)}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <Text style={styles.category}>{category}</Text>
                <View style={styles.periodBadge}>
                    <Text style={styles.periodText}>{periodLabel}</Text>
                </View>
            </View>

            <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Budget:</Text>
                <Text style={styles.amountValue}>{formatCurrency(amount)}</Text>
            </View>

            <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Spent:</Text>
                <Text style={styles.amountValue}>{formatCurrency(spent)}</Text>
            </View>

            <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Remaining:</Text>
                <Text style={[
                    styles.amountValue,
                    { color: remaining < 0 ? COLORS.danger : COLORS.dark }
                ]}>
                    {formatCurrency(remaining)}
                </Text>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${Math.min(percentUsed, 100)}%`,
                                backgroundColor: progressColor
                            }
                        ]}
                    />
                </View>
                <Text style={styles.percentText}>{formatPercentage(percentUsed)}</Text>
            </View>

            {isAlertTriggered && (
                <View style={styles.alertContainer}>
                    <Icon name="alert-circle" size={16} color={COLORS.danger} />
                    <Text style={styles.alertText}>
                        Budget Alert: You've used {formatPercentage(percentUsed)} of your budget
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    category: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark,
    },
    periodBadge: {
        backgroundColor: COLORS.light,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    periodText: {
        fontSize: 12,
        color: COLORS.dark,
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    amountLabel: {
        fontSize: 14,
        color: COLORS.gray,
    },
    amountValue: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.dark,
    },
    progressContainer: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBackground: {
        flex: 1,
        height: 8,
        backgroundColor: COLORS.light,
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    percentText: {
        fontSize: 12,
        fontWeight: '500',
        width: 40,
        textAlign: 'right',
    },
    alertContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        padding: 8,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 4,
    },
    alertText: {
        fontSize: 12,
        color: COLORS.danger,
        marginLeft: 6,
        flex: 1,
    },
});

export default BudgetCard;