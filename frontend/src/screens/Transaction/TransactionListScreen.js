
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useGlobal } from '../../context/GlobalContext';
import { COLORS, TRANSACTION_TYPES } from '../../utils/constants';
import Header from '../../components/Header';
import TransactionItem from '../../components/TransactionItem';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';

const TransactionListScreen = ({ route }) => {
    const navigation = useNavigation();
    const { transactions, transactionsLoading, fetchTransactions, transactionSummary, fetchTransactionSummary } = useGlobal();

    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Get filter from route params if available
    useEffect(() => {
        if (route.params?.filter) {
            setActiveFilter(route.params.filter);
        }
    }, [route.params]);

    // Load transactions when the screen mounts or filter changes
    useEffect(() => {
        loadTransactions();
    }, [activeFilter]);

    // Load transactions with the current filter
    const loadTransactions = async (refresh = false) => {
        const newPage = refresh ? 1 : page;

        const filters = {
            page: newPage,
            limit: 20,
        };

        // Add type filter if not 'all'
        if (activeFilter !== 'all') {
            filters.type = activeFilter;
        }

        try {
            const result = await fetchTransactions(filters);

            // Update hasMore based on pagination info
            if (result?.pagination) {
                setHasMore(result.pagination.page < result.pagination.pages);
            } else {
                setHasMore(false);
            }

            // Update page if successful
            setPage(newPage);

            // Also fetch summary for the totals
            if (refresh) {
                await fetchTransactionSummary();
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    };

    // Handle refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        await loadTransactions(true);
        setRefreshing(false);
    };

    // Load more transactions when the end is reached
    const handleLoadMore = () => {
        if (hasMore && !transactionsLoading && !refreshing) {
            setPage(prevPage => prevPage + 1);
            loadTransactions(false);
        }
    };

    // Handle filter change
    const handleFilterChange = (filter) => {
        if (filter !== activeFilter) {
            setActiveFilter(filter);
            setPage(1);
        }
    };

    // Navigate to create/edit screen
    const handleTransactionPress = (transaction) => {
        navigation.navigate('TransactionCreate', { transaction });
    };

    // Calculate income and expense totals from summary or transactions
    const calculateTotals = () => {
        if (transactionSummary) {
            return {
                income: transactionSummary.income || 0,
                expenses: transactionSummary.expenses || 0,
            };
        }

        // Fallback calculation if summary not available
        return transactions.reduce(
            (acc, transaction) => {
                if (transaction.type === 'income') {
                    acc.income += transaction.amount;
                } else {
                    acc.expenses += transaction.amount;
                }
                return acc;
            },
            { income: 0, expenses: 0 }
        );
    };

    const { income, expenses } = calculateTotals();

    // Render empty state when no transactions
    const renderEmptyComponent = () => {
        if (transactionsLoading && page === 1) {
            return <Loader loading text="Loading transactions..." />;
        }

        return (
            <Card style={styles.emptyContainer}>
                <Icon name="receipt-outline" size={48} color={COLORS.gray} />
                <Text style={styles.emptyText}>No transactions found</Text>
                <Text style={styles.emptySubtext}>
                    {activeFilter === 'all'
                        ? "You haven't added any transactions yet"
                        : `You don't have any ${activeFilter} transactions`}
                </Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('TransactionCreate')}
                >
                    <Icon name="add" size={20} color={COLORS.white} />
                    <Text style={styles.addButtonText}>Add Transaction</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    // Render list footer with loading indicator or "load more" button
    const renderFooter = () => {
        if (transactionsLoading && page > 1) {
            return <Loader loading text="Loading more..." />;
        }

        if (hasMore && transactions.length > 0) {
            return (
                <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                    <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>
            );
        }

        return null;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Transactions"
                rightIcon="add-circle-outline"
                onRightPress={() => navigation.navigate('TransactionCreate')}
            />

            <View style={styles.totalContainer}>
                <View style={styles.totalCard}>
                    <Text style={styles.totalLabel}>Income</Text>
                    <Text style={[styles.totalAmount, styles.incomeAmount]}>{income.toFixed(2)}</Text>
                </View>

                <View style={styles.totalCard}>
                    <Text style={styles.totalLabel}>Expenses</Text>
                    <Text style={[styles.totalAmount, styles.expenseAmount]}>{expenses.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        activeFilter === 'all' && styles.activeFilterButton,
                    ]}
                    onPress={() => handleFilterChange('all')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            activeFilter === 'all' && styles.activeFilterText,
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        activeFilter === 'income' && styles.activeFilterButton,
                    ]}
                    onPress={() => handleFilterChange('income')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            activeFilter === 'income' && styles.activeFilterText,
                        ]}
                    >
                        Income
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        activeFilter === 'expense' && styles.activeFilterButton,
                    ]}
                    onPress={() => handleFilterChange('expense')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            activeFilter === 'expense' && styles.activeFilterText,
                        ]}
                    >
                        Expenses
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TransactionItem
                        transaction={item}
                        onPress={handleTransactionPress}
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ListEmptyComponent={renderEmptyComponent}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate('TransactionCreate')}
            >
                <Icon name="add" size={24} color={COLORS.white} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    totalContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    totalCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    totalLabel: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '600',
    },
    incomeAmount: {
        color: COLORS.success,
    },
    expenseAmount: {
        color: COLORS.danger,
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: COLORS.light,
    },
    activeFilterButton: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        color: COLORS.dark,
    },
    activeFilterText: {
        color: COLORS.white,
        fontWeight: '500',
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 24,
        marginTop: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.dark,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.gray,
        textAlign: 'center',
        marginBottom: 24,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    addButtonText: {
        color: COLORS.white,
        fontWeight: '500',
        marginLeft: 6,
    },
    loadMoreButton: {
        backgroundColor: COLORS.light,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    loadMoreText: {
        color: COLORS.primary,
        fontWeight: '500',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});

export default TransactionListScreen;