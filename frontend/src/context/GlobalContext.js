
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import * as transactionApi from '../api/transaction';
import * as budgetApi from '../api/budget';

// Create context
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const { userToken } = useAuth();

    // Transactions state
    const [transactions, setTransactions] = useState([]);
    const [transactionSummary, setTransactionSummary] = useState(null);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [transactionsError, setTransactionsError] = useState(null);

    // Budgets state
    const [budgets, setBudgets] = useState([]);
    const [budgetStatus, setBudgetStatus] = useState([]);
    const [budgetsLoading, setBudgetsLoading] = useState(false);
    const [budgetsError, setBudgetsError] = useState(null);

    // Load transactions when authenticated
    useEffect(() => {
        if (userToken) {
            fetchTransactions();
            fetchTransactionSummary();
        } else {
            setTransactions([]);
            setTransactionSummary(null);
        }
    }, [userToken]);

    // Load budgets when authenticated
    useEffect(() => {
        if (userToken) {
            fetchBudgets();
            fetchBudgetStatus();
        } else {
            setBudgets([]);
            setBudgetStatus([]);
        }
    }, [userToken]);

    // Fetch transactions
    const fetchTransactions = async (filters = {}) => {
        if (!userToken) return;

        try {
            setTransactionsLoading(true);
            setTransactionsError(null);

            const result = await transactionApi.getTransactions(filters);
            setTransactions(result.data || []);

            return result;
        } catch (e) {
            setTransactionsError(e.error || 'Failed to fetch transactions');
            console.error('Error fetching transactions:', e);
        } finally {
            setTransactionsLoading(false);
        }
    };

    // Fetch transaction summary
    const fetchTransactionSummary = async (period = 'month') => {
        if (!userToken) return;

        try {
            setTransactionsLoading(true);

            const result = await transactionApi.getTransactionSummary(period);
            setTransactionSummary(result.data || null);

            return result;
        } catch (e) {
            console.error('Error fetching transaction summary:', e);
        } finally {
            setTransactionsLoading(false);
        }
    };

    // Create transaction
    const createTransaction = async (transactionData) => {
        try {
            setTransactionsLoading(true);
            setTransactionsError(null);

            const result = await transactionApi.createTransaction(transactionData);

            // Refresh transactions and summary
            await fetchTransactions();
            await fetchTransactionSummary();

            return result;
        } catch (e) {
            setTransactionsError(e.error || 'Failed to create transaction');
            throw e;
        } finally {
            setTransactionsLoading(false);
        }
    };

    // Update transaction
    const updateTransaction = async (id, transactionData) => {
        try {
            setTransactionsLoading(true);
            setTransactionsError(null);

            const result = await transactionApi.updateTransaction(id, transactionData);

            // Refresh transactions and summary
            await fetchTransactions();
            await fetchTransactionSummary();

            return result;
        } catch (e) {
            setTransactionsError(e.error || 'Failed to update transaction');
            throw e;
        } finally {
            setTransactionsLoading(false);
        }
    };

    // Delete transaction
    const deleteTransaction = async (id) => {
        try {
            setTransactionsLoading(true);
            setTransactionsError(null);

            const result = await transactionApi.deleteTransaction(id);

            // Refresh transactions and summary
            await fetchTransactions();
            await fetchTransactionSummary();

            return result;
        } catch (e) {
            setTransactionsError(e.error || 'Failed to delete transaction');
            throw e;
        } finally {
            setTransactionsLoading(false);
        }
    };

    // Fetch budgets
    const fetchBudgets = async () => {
        if (!userToken) return;

        try {
            setBudgetsLoading(true);
            setBudgetsError(null);

            const result = await budgetApi.getBudgets();
            setBudgets(result.data || []);

            return result;
        } catch (e) {
            setBudgetsError(e.error || 'Failed to fetch budgets');
            console.error('Error fetching budgets:', e);
        } finally {
            setBudgetsLoading(false);
        }
    };

    // Fetch budget status
    const fetchBudgetStatus = async () => {
        if (!userToken) return;

        try {
            setBudgetsLoading(true);

            const result = await budgetApi.getBudgetStatus();
            setBudgetStatus(result.data || []);

            return result;
        } catch (e) {
            console.error('Error fetching budget status:', e);
        } finally {
            setBudgetsLoading(false);
        }
    };

    // Create budget
    const createBudget = async (budgetData) => {
        try {
            setBudgetsLoading(true);
            setBudgetsError(null);

            const result = await budgetApi.createBudget(budgetData);

            // Refresh budgets and status
            await fetchBudgets();
            await fetchBudgetStatus();

            return result;
        } catch (e) {
            setBudgetsError(e.error || 'Failed to create budget');
            throw e;
        } finally {
            setBudgetsLoading(false);
        }
    };

    // Update budget
    const updateBudget = async (id, budgetData) => {
        try {
            setBudgetsLoading(true);
            setBudgetsError(null);

            const result = await budgetApi.updateBudget(id, budgetData);

            // Refresh budgets and status
            await fetchBudgets();
            await fetchBudgetStatus();

            return result;
        } catch (e) {
            setBudgetsError(e.error || 'Failed to update budget');
            throw e;
        } finally {
            setBudgetsLoading(false);
        }
    };

    // Delete budget
    const deleteBudget = async (id) => {
        try {
            setBudgetsLoading(true);
            setBudgetsError(null);

            const result = await budgetApi.deleteBudget(id);

            // Refresh budgets and status
            await fetchBudgets();
            await fetchBudgetStatus();

            return result;
        } catch (e) {
            setBudgetsError(e.error || 'Failed to delete budget');
            throw e;
        } finally {
            setBudgetsLoading(false);
        }
    };

    // Refresh all data
    const refreshAllData = async () => {
        if (!userToken) return;

        try {
            setTransactionsLoading(true);
            setBudgetsLoading(true);

            await Promise.all([
                fetchTransactions(),
                fetchTransactionSummary(),
                fetchBudgets(),
                fetchBudgetStatus()
            ]);

            return true;
        } catch (e) {
            console.error('Error refreshing all data:', e);
            return false;
        } finally {
            setTransactionsLoading(false);
            setBudgetsLoading(false);
        }
    };

    return (
        <GlobalContext.Provider value={{
            // Transactions
            transactions,
            transactionSummary,
            transactionsLoading,
            transactionsError,
            fetchTransactions,
            fetchTransactionSummary,
            createTransaction,
            updateTransaction,
            deleteTransaction,

            // Budgets
            budgets,
            budgetStatus,
            budgetsLoading,
            budgetsError,
            fetchBudgets,
            fetchBudgetStatus,
            createBudget,
            updateBudget,
            deleteBudget,

            // General
            refreshAllData
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook to use the global context
export const useGlobal = () => useContext(GlobalContext);