
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useGlobal } from '../../context/GlobalContext';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import Header from '../../components/Header';
import Card from '../../components/common/Card';
import Chart from '../../components/Chart';
import TransactionItem from '../../components/TransactionItem';
import BudgetCard from '../../components/BudgetCard';
import Loader from '../../components/common/Loader';

const DashboardScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const {
        transactionSummary,
        transactions,
        budgetStatus,
        transactionsLoading,
        budgetsLoading,
        fetchTransactions,
        fetchTransactionSummary,
        fetchBudgetStatus,
        refreshAllData,
    } = useGlobal();

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        await fetchTransactionSummary();
        await fetchTransactions({ limit: 5 });
        await fetchBudgetStatus();
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshAllData();
        setRefreshing(false);
    };

    const handleLogout = async () => {
        await logout();
    };

    // Function to prepare data for the expense by category chart
    const prepareExpenseCategoryData = () => {
        if (!transactionSummary || !transactionSummary.expensesByCategory) return null;

        const colors = [
            '#4C66EE', '#5AC8FA', '#34C759', '#FF9500', '#FF3B30',
            '#5856D6', '#AF52DE', '#FF2D55', '#007AFF', '#8E8E93'
        ];

        return {
            labels: transactionSummary.expensesByCategory.map(item => item._id),
            datasets: [
                {
                    data: transactionSummary.expensesByCategory.map(item => item.total),
                    colors: colors.slice(0, transactionSummary.expensesByCategory.length)
                }
            ]
        };
    };

    // Prepare data for income vs expenses chart
    const prepareIncomeExpensesData = () => {
        if (!transactionSummary) return null;

        return {
            labels: ['Income', 'Expenses'],
            datasets: [
                {
                    data: [
                        transactionSummary.income || 0,
                        transactionSummary.expenses || 0
                    ],
                    color: (opacity = 1) => `rgba(76, 102, 238, ${opacity})`,
                    strokeWidth: 2
                }
            ]
        };
    };

    // Prepare data for pie chart
    const preparePieChartData = () => {
        if (!transactionSummary || !transactionSummary.expensesByCategory || transactionSummary.expensesByCategory.length === 0) {
            return null;
        }

        const colors = [
            '#4C66EE', '#5AC8FA', '#34C759', '#FF9500', '#FF3B30',
            '#5856D6', '#AF52DE', '#FF2D55', '#007AFF', '#8E8E93'
        ];

        return transactionSummary.expensesByCategory.map((item, index) => ({
            name: item._id,
            value: item.total,
            color: colors[index % colors.length],
            legendFontColor: COLORS.dark,
            legendFontSize: 12
        }));
    };

    // Format the period for display
    const formatPeriod = () => {
        if (!transactionSummary || !transactionSummary.dateRange) return '';

        const startDate = new Date(transactionSummary.dateRange.startDate);
        const endDate = new Date(transactionSummary.dateRange.endDate);

        const options = { month: 'short', year: 'numeric' };
        return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
    };

    // Loading state
    const isLoading = transactionsLoading || budgetsLoading;

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Dashboard"
            // rightIcon="log-out-outline"
            // onRightPress={handleLogout}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {isLoading && !refreshing ? (
                    <Loader loading={true} text="Loading dashboard data..." />
                ) : (
                    <>
                        <View style={styles.summaryContainer}>
                            <Text style={styles.periodText}>{formatPeriod()}</Text>

                            <View style={styles.balanceCard}>
                                <Text style={styles.balanceLabel}>Current Balance</Text>
                                <Text style={styles.balanceAmount}>
                                    {formatCurrency(
                                        (transactionSummary?.income || 0) - (transactionSummary?.expenses || 0)
                                    )}
                                </Text>
                            </View>

                            <View style={styles.statsContainer}>
                                <View style={styles.statCard}>
                                    <View style={[styles.statIcon, { backgroundColor: COLORS.success + '20' }]}>
                                        <Icon name="arrow-down" size={20} color={COLORS.success} />
                                    </View>
                                    <View style={styles.statContent}>
                                        <Text style={styles.statLabel}>Income</Text>
                                        <Text style={styles.statAmount}>{formatCurrency(transactionSummary?.income || 0)}</Text>
                                    </View>
                                </View>

                                <View style={styles.statCard}>
                                    <View style={[styles.statIcon, { backgroundColor: COLORS.danger + '20' }]}>
                                        <Icon name="arrow-up" size={20} color={COLORS.danger} />
                                    </View>
                                    <View style={styles.statContent}>
                                        <Text style={styles.statLabel}>Expenses</Text>
                                        <Text style={styles.statAmount}>{formatCurrency(transactionSummary?.expenses || 0)}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Charts Section */}
                        <View style={styles.chartsContainer}>
                            {preparePieChartData() && (
                                <Chart
                                    type="pie"
                                    data={preparePieChartData()}
                                    title="Expenses by Category"
                                    height={220}
                                />
                            )}

                            {prepareIncomeExpensesData() && (
                                <Chart
                                    type="bar"
                                    data={prepareIncomeExpensesData()}
                                    title="Income vs Expenses"
                                    height={220}
                                />
                            )}
                        </View>

                        {/* Budget Alerts Section */}
                        {budgetStatus && budgetStatus.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Budget Alerts</Text>
                                </View>

                                {budgetStatus
                                    .filter(budget => budget.isAlertTriggered)
                                    .slice(0, 2)
                                    .map(budget => (
                                        <BudgetCard
                                            key={budget.budget.id}
                                            budget={budget}
                                            onPress={() => navigation.navigate('Budgets')}
                                        />
                                    ))}

                                {budgetStatus.filter(budget => budget.isAlertTriggered).length > 2 && (
                                    <TouchableOpacity
                                        style={styles.viewAllButton}
                                        onPress={() => navigation.navigate('Budgets')}
                                    >
                                        <Text style={styles.viewAllText}>View All Budgets</Text>
                                        <Icon name="chevron-forward" size={16} color={COLORS.primary} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {/* Recent Transactions Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
                                    <Text style={styles.viewAllLink}>View All</Text>
                                </TouchableOpacity>
                            </View>

                            {transactions && transactions.length > 0 ? (
                                transactions.slice(0, 5).map(transaction => (
                                    <TransactionItem
                                        key={transaction._id}
                                        transaction={transaction}
                                        onPress={() => navigation.navigate('Transactions', {
                                            screen: 'TransactionCreate',
                                            params: { transaction }
                                        })}
                                    />
                                ))
                            ) : (
                                <Card>
                                    <Text style={styles.emptyText}>No transactions yet</Text>
                                </Card>
                            )}

                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => navigation.navigate('Transactions', {
                                    screen: 'TransactionCreate'
                                })}
                            >
                                <Icon name="add" size={24} color={COLORS.white} />
                                <Text style={styles.addButtonText}>Add Transaction</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    summaryContainer: {
        marginBottom: 24,
    },
    periodText: {
        fontSize: 14,
        color: COLORS.gray,
        textAlign: 'center',
        marginBottom: 12,
    },
    balanceCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    balanceLabel: {
        fontSize: 14,
        color: COLORS.white + 'CC',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statContent: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.gray,
        marginBottom: 4,
    },
    statAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark,
    },
    chartsContainer: {
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.dark,
    },
    viewAllLink: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '500',
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.gray,
        fontSize: 14,
        padding: 16,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        marginTop: 8,
    },
    viewAllText: {
        color: COLORS.primary,
        fontWeight: '500',
        marginRight: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
    },
    addButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
});

export default DashboardScreen;