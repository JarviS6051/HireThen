
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useGlobal } from '../../context/GlobalContext';
import { COLORS } from '../../utils/constants';
import Header from '../../components/Header';
import BudgetCard from '../../components/BudgetCard';
import Loader from '../../components/common/Loader';
import Card from '../../components/common/Card';

const BudgetListScreen = () => {
    const navigation = useNavigation();
    const { budgetStatus, budgets, budgetsLoading, fetchBudgetStatus } = useGlobal();

    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'alert', 'ok'

    // Load budget data when the screen mounts
    useEffect(() => {
        loadBudgetData();
    }, []);

    // Load budget status data
    const loadBudgetData = async () => {
        try {
            await fetchBudgetStatus();
        } catch (error) {
            console.error('Error loading budget data:', error);
        }
    };

    // Handle refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        await loadBudgetData();
        setRefreshing(false);
    };

    // Navigate to create/edit screen
    const handleBudgetPress = (budget) => {
        navigation.navigate('BudgetCreate', { budget });
    };

    // Filter budgets based on active filter
    const getFilteredBudgets = () => {
        if (!budgetStatus) return [];

        switch (activeFilter) {
            case 'alert':
                return budgetStatus.filter(budget => budget.isAlertTriggered);
            case 'ok':
                return budgetStatus.filter(budget => !budget.isAlertTriggered);
            default:
                return budgetStatus;
        }
    };

    // Calculate overall budget usage
    const calculateOverallUsage = () => {
        if (!budgetStatus || budgetStatus.length === 0) return { used: 0, total: 0, percent: 0 };

        const total = budgetStatus.reduce((sum, budget) => sum + budget.budget.amount, 0);
        const used = budgetStatus.reduce((sum, budget) => sum + budget.spent, 0);
        const percent = total > 0 ? (used / total) * 100 : 0;

        return { used, total, percent };
    };

    const { used, total, percent } = calculateOverallUsage();
    const filteredBudgets = getFilteredBudgets();

    // Render empty state when no budgets
    const renderEmptyComponent = () => {
        if (budgetsLoading) {
            return <Loader loading text="Loading budgets..." />;
        }

        return (
            <Card style={styles.emptyContainer}>
                <Icon name="wallet-outline" size={48} color={COLORS.gray} />
                <Text style={styles.emptyText}>No budgets found</Text>
                <Text style={styles.emptySubtext}>
                    {activeFilter === 'all'
                        ? "You haven't created any budgets yet"
                        : activeFilter === 'alert'
                            ? "You don't have any budget alerts"
                            : "You don't have any budgets within limits"}
                </Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('BudgetCreate')}
                >
                    <Icon name="add" size={20} color={COLORS.white} />
                    <Text style={styles.addButtonText}>Create Budget</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Budgets"
                rightIcon="add-circle-outline"
                onRightPress={() => navigation.navigate('BudgetCreate')}
            />

            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryTitle}>Overall Budget</Text>
                        <Text style={styles.summaryPercent}>{Math.round(percent)}%</Text>
                    </View>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressBackground}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${Math.min(percent, 100)}%`,
                                        backgroundColor: percent > 80 ? COLORS.danger :
                                            percent > 50 ? COLORS.warning : COLORS.success
                                    }
                                ]}
                            />
                        </View>
                    </View>

                    <View style={styles.summaryDetails}>
                        <Text style={styles.summaryUsed}>
                            Used: ${used.toFixed(2)}
                        </Text>
                        <Text style={styles.summaryTotal}>
                            of ${total.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        activeFilter === 'all' && styles.activeFilterButton,
                    ]}
                    onPress={() => setActiveFilter('all')}
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
                        activeFilter === 'alert' && styles.activeFilterButton,
                    ]}
                    onPress={() => setActiveFilter('alert')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            activeFilter === 'alert' && styles.activeFilterText,
                        ]}
                    >
                        Alerts
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        activeFilter === 'ok' && styles.activeFilterButton,
                    ]}
                    onPress={() => setActiveFilter('ok')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            activeFilter === 'ok' && styles.activeFilterText,
                        ]}
                    >
                        Within Limit
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredBudgets}
                keyExtractor={(item) => item.budget.id}
                renderItem={({ item }) => (
                    <BudgetCard
                        budget={item}
                        onPress={handleBudgetPress}
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
                showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate('BudgetCreate')}
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
    summaryContainer: {
        padding: 16,
        backgroundColor: COLORS.white,
    },
    summaryCard: {
        backgroundColor: COLORS.light,
        borderRadius: 12,
        padding: 16,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark,
    },
    summaryPercent: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
    },
    progressContainer: {
        marginBottom: 12,
    },
    progressBackground: {
        height: 8,
        backgroundColor: COLORS.lightGray,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    summaryDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryUsed: {
        fontSize: 14,
        color: COLORS.dark,
        fontWeight: '500',
    },
    summaryTotal: {
        fontSize: 14,
        color: COLORS.gray,
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
        paddingHorizontal: 12,
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

export default BudgetListScreen;