
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Switch,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useGlobal } from '../../context/GlobalContext';
import { COLORS, TRANSACTION_TYPES, DEFAULT_CATEGORIES, RECURRING_FREQUENCIES } from '../../utils/constants';
import Header from '../../components/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const TransactionCreateScreen = ({ route }) => {
    const navigation = useNavigation();
    const { createTransaction, updateTransaction, deleteTransaction, transactionsLoading } = useGlobal();

    // Get transaction from route params if editing
    const editingTransaction = route.params?.transaction;
    const isEditing = !!editingTransaction;

    // Form state
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringFrequency, setRecurringFrequency] = useState('monthly');

    // Date picker state
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Error states
    const [amountError, setAmountError] = useState('');
    const [categoryError, setCategoryError] = useState('');

    // Category selection modal
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [customCategory, setCustomCategory] = useState('');
    const [showCustomCategory, setShowCustomCategory] = useState(false);

    // Set form values when editing a transaction
    useEffect(() => {
        if (isEditing) {
            setAmount(editingTransaction.amount.toString());
            setType(editingTransaction.type);
            setCategory(editingTransaction.category);
            setDescription(editingTransaction.description || '');
            setDate(new Date(editingTransaction.date));
            setIsRecurring(editingTransaction.isRecurring || false);
            setRecurringFrequency(editingTransaction.recurringFrequency || 'monthly');
        }
    }, [isEditing, editingTransaction]);

    // Handle form submission
    const handleSubmit = async () => {
        // Validate form
        if (!validateForm()) return;

        // Create transaction object
        const transactionData = {
            amount: parseFloat(amount),
            type,
            category,
            description: description.trim(),
            date: date.toISOString(),
            isRecurring,
            recurringFrequency: isRecurring ? recurringFrequency : null
        };

        try {
            if (isEditing) {
                await updateTransaction(editingTransaction._id, transactionData);
            } else {
                await createTransaction(transactionData);
            }

            navigation.goBack();
        } catch (error) {
            console.error('Error saving transaction:', error);
            Alert.alert('Error', 'Failed to save transaction. Please try again.');
        }
    };

    // Validate form inputs
    const validateForm = () => {
        let isValid = true;

        // Validate amount
        if (!amount.trim()) {
            setAmountError('Amount is required');
            isValid = false;
        } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            setAmountError('Please enter a valid amount');
            isValid = false;
        } else {
            setAmountError('');
        }

        // Validate category
        if (!category.trim()) {
            setCategoryError('Category is required');
            isValid = false;
        } else {
            setCategoryError('');
        }

        return isValid;
    };

    // Handle date change
    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    // Handle category selection
    const handleCategorySelect = (selectedCategory) => {
        if (selectedCategory === 'custom') {
            setShowCustomCategory(true);
        } else {
            setCategory(selectedCategory);
            setShowCategoryPicker(false);
            setCategoryError('');
        }
    };

    // Handle custom category submission
    const handleCustomCategorySubmit = () => {
        if (customCategory.trim()) {
            setCategory(customCategory.trim());
            setCustomCategory('');
            setShowCustomCategory(false);
            setShowCategoryPicker(false);
            setCategoryError('');
        }
    };

    // Handle delete transaction
    const handleDelete = () => {
        Alert.alert(
            'Delete Transaction',
            'Are you sure you want to delete this transaction?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTransaction(editingTransaction._id);
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error deleting transaction:', error);
                            Alert.alert('Error', 'Failed to delete transaction. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    // Get categories based on transaction type
    const getCategories = () => {
        return DEFAULT_CATEGORIES[type] || [];
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
                leftIcon="arrow-back"
                onLeftPress={() => navigation.goBack()}
                rightIcon={isEditing ? 'trash-outline' : null}
                onRightPress={isEditing ? handleDelete : null}
                showProfileMenu={false} // Don't show profile menu on these screens
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.typeContainer}>
                        {TRANSACTION_TYPES.map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                style={[
                                    styles.typeButton,
                                    type === item.value && (
                                        item.value === 'income'
                                            ? styles.incomeButton
                                            : styles.expenseButton
                                    )
                                ]}
                                onPress={() => setType(item.value)}
                            >
                                <Text
                                    style={[
                                        styles.typeText,
                                        type === item.value && styles.activeTypeText
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Input
                        label="Amount"
                        value={amount}
                        onChangeText={(text) => {
                            setAmount(text);
                            setAmountError('');
                        }}
                        placeholder="0.00"
                        keyboardType="numeric"
                        error={amountError}
                    />

                    <TouchableOpacity
                        style={[
                            styles.categorySelector,
                            categoryError && styles.inputError
                        ]}
                        onPress={() => setShowCategoryPicker(true)}
                    >
                        <Text style={styles.labelText}>Category</Text>
                        <View style={styles.categoryInputContainer}>
                            <Text style={[
                                styles.categoryText,
                                !category && { color: COLORS.gray }
                            ]}>
                                {category || 'Select a category'}
                            </Text>
                            <Icon name="chevron-down" size={16} color={COLORS.gray} />
                        </View>
                        {categoryError ? (
                            <Text style={styles.errorText}>{categoryError}</Text>
                        ) : null}
                    </TouchableOpacity>

                    {showCategoryPicker && (
                        <View style={styles.pickerContainer}>
                            <View style={styles.pickerHeader}>
                                <Text style={styles.pickerTitle}>Select Category</Text>
                                <TouchableOpacity
                                    onPress={() => setShowCategoryPicker(false)}
                                >
                                    <Icon name="close" size={24} color={COLORS.dark} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.categoriesList}>
                                {getCategories().map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={styles.categoryItem}
                                        onPress={() => handleCategorySelect(cat)}
                                    >
                                        <Text style={[
                                            styles.categoryItemText,
                                            category === cat && styles.selectedCategoryText
                                        ]}>
                                            {cat}
                                        </Text>
                                        {category === cat && (
                                            <Icon name="checkmark" size={18} color={COLORS.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                    style={styles.categoryItem}
                                    onPress={() => handleCategorySelect('custom')}
                                >
                                    <Text style={styles.categoryItemText}>
                                        Add Custom Category
                                    </Text>
                                    <Icon name="add" size={18} color={COLORS.primary} />
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    )}

                    {showCustomCategory && (
                        <View style={styles.customCategoryContainer}>
                            <Input
                                label="Custom Category"
                                value={customCategory}
                                onChangeText={setCustomCategory}
                                placeholder="Enter category name"
                                autoFocus
                            />
                            <View style={styles.customCategoryButtons}>
                                <Button
                                    title="Cancel"
                                    type="outline"
                                    onPress={() => {
                                        setShowCustomCategory(false);
                                        setCustomCategory('');
                                    }}
                                    style={{ flex: 1, marginRight: 8 }}
                                />
                                <Button
                                    title="Add"
                                    onPress={handleCustomCategorySubmit}
                                    disabled={!customCategory.trim()}
                                    style={{ flex: 1 }}
                                />
                            </View>
                        </View>
                    )}

                    <Input
                        label="Description (Optional)"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Add a description"
                        multiline
                        style={{ height: 80 }}
                    />

                    <View style={styles.dateContainer}>
                        <Text style={styles.labelText}>Date</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateText}>
                                {date.toLocaleDateString()}
                            </Text>
                            <Icon name="calendar-outline" size={20} color={COLORS.dark} />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                        />
                    )}

                    <View style={styles.switchContainer}>
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Recurring Transaction</Text>
                            <Switch
                                value={isRecurring}
                                onValueChange={setIsRecurring}
                                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                                thumbColor={COLORS.white}
                            />
                        </View>

                        {isRecurring && (
                            <View style={styles.frequencyContainer}>
                                <Text style={styles.labelText}>Frequency</Text>
                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        selectedValue={recurringFrequency}
                                        onValueChange={(itemValue) => setRecurringFrequency(itemValue)}
                                        style={styles.picker}
                                    >
                                        {RECURRING_FREQUENCIES.map((freq) => (
                                            <Picker.Item
                                                key={freq.value}
                                                label={freq.label}
                                                value={freq.value}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Cancel"
                            type="outline"
                            onPress={() => navigation.goBack()}
                            style={styles.cancelButton}
                        />
                        <Button
                            title={isEditing ? "Update" : "Save"}
                            onPress={handleSubmit}
                            loading={transactionsLoading}
                            disabled={transactionsLoading}
                            style={styles.saveButton}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Loader loading={transactionsLoading} overlay />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        padding: 16,
    },
    typeContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        alignItems: 'center',
    },
    typeText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.dark,
    },
    incomeButton: {
        backgroundColor: COLORS.success + '20',
        borderColor: COLORS.success,
    },
    expenseButton: {
        backgroundColor: COLORS.danger + '20',
        borderColor: COLORS.danger,
    },
    activeTypeText: {
        fontWeight: '600',
    },
    labelText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.dark,
        marginBottom: 8,
    },
    categorySelector: {
        marginBottom: 16,
    },
    categoryInputContainer: {
        height: 50,
        backgroundColor: COLORS.light,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryText: {
        fontSize: 16,
        color: COLORS.dark,
    },
    inputError: {
        borderColor: COLORS.danger,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 12,
        marginTop: 4,
    },
    pickerContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    pickerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark,
    },
    categoriesList: {
        maxHeight: 200,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    categoryItemText: {
        fontSize: 16,
        color: COLORS.dark,
    },
    selectedCategoryText: {
        color: COLORS.primary,
        fontWeight: '500',
    },
    customCategoryContainer: {
        marginBottom: 16,
    },
    customCategoryButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateContainer: {
        marginBottom: 16,
    },
    dateButton: {
        height: 50,
        backgroundColor: COLORS.light,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateText: {
        fontSize: 16,
        color: COLORS.dark,
    },
    switchContainer: {
        marginBottom: 24,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.dark,
    },
    frequencyContainer: {
        marginTop: 8,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 8,
        backgroundColor: COLORS.light,
        marginTop: 4,
    },
    picker: {
        height: 50,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
    },
    saveButton: {
        flex: 1,
        marginLeft: 8,
    },
});

export default TransactionCreateScreen;