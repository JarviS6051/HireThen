
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
    Alert,
    TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import { useGlobal } from '../../context/GlobalContext';
import { COLORS, DEFAULT_CATEGORIES, BUDGET_PERIODS } from '../../utils/constants';
import Header from '../../components/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const BudgetCreateScreen = ({ route }) => {
    const navigation = useNavigation();
    const { createBudget, updateBudget, deleteBudget, budgetsLoading } = useGlobal();

    // Get budget from route params if editing
    const editingBudget = route.params?.budget;
    const isEditing = !!editingBudget;

    // Form state
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [period, setPeriod] = useState('monthly');
    const [alertThreshold, setAlertThreshold] = useState(0.8);

    // Error states
    const [categoryError, setCategoryError] = useState('');
    const [amountError, setAmountError] = useState('');

    // Category selection state
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [customCategory, setCustomCategory] = useState('');
    const [showCustomCategory, setShowCustomCategory] = useState(false);

    // Set form values when editing a budget
    useEffect(() => {
        if (isEditing) {
            setCategory(editingBudget.budget.category);
            setAmount(editingBudget.budget.amount.toString());
            setPeriod(editingBudget.budget.period);
            setAlertThreshold(editingBudget.budget.alertThreshold);
        }
    }, [isEditing, editingBudget]);

    // Handle form submission
    const handleSubmit = async () => {
        // Validate form
        if (!validateForm()) return;

        // Create budget object
        const budgetData = {
            category,
            amount: parseFloat(amount),
            period,
            alertThreshold
        };

        try {
            if (isEditing) {
                await updateBudget(editingBudget.budget.id, budgetData);
            } else {
                await createBudget(budgetData);
            }

            navigation.goBack();
        } catch (error) {
            console.error('Error saving budget:', error);
            Alert.alert('Error', 'Failed to save budget. Please try again.');
        }
    };

    // Validate form inputs
    const validateForm = () => {
        let isValid = true;

        // Validate category
        if (!category.trim()) {
            setCategoryError('Category is required');
            isValid = false;
        } else {
            setCategoryError('');
        }

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

        return isValid;
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

    // Handle delete budget
    const handleDelete = () => {
        Alert.alert(
            'Delete Budget',
            'Are you sure you want to delete this budget?',
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
                            // Debug logging
                            console.log('Budget to delete:', editingBudget);
                            console.log('Budget ID:', editingBudget.budget.id);

                            await deleteBudget(editingBudget.budget.id);
                            navigation.goBack();
                        } catch (error) {
                            // More detailed error handling
                            console.error('Error deleting budget:', error);
                            const errorMsg = error.error || 'Failed to delete budget. Please try again.';
                            Alert.alert('Error', errorMsg);
                        }
                    }
                }
            ]
        );
    };

    // Get expense categories for picker
    const getCategories = () => {
        return DEFAULT_CATEGORIES.expense || [];
    };

    // Format the slider value as percentage
    const formatThreshold = (value) => {
        return `${Math.round(value * 100)}%`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={isEditing ? 'Edit Budget' : 'Create Budget'}
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

                    <View style={styles.periodContainer}>
                        <Text style={styles.labelText}>Budget Period</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={period}
                                onValueChange={(itemValue) => setPeriod(itemValue)}
                                style={styles.picker}
                            >
                                {BUDGET_PERIODS.map((p) => (
                                    <Picker.Item
                                        key={p.value}
                                        label={p.label}
                                        value={p.value}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.thresholdContainer}>
                        <View style={styles.thresholdHeader}>
                            <Text style={styles.labelText}>Alert Threshold</Text>
                            <Text style={styles.thresholdValue}>
                                {formatThreshold(alertThreshold)}
                            </Text>
                        </View>

                        <Slider
                            style={styles.slider}
                            minimumValue={0.1}
                            maximumValue={1}
                            step={0.05}
                            value={alertThreshold}
                            onValueChange={(value) => setAlertThreshold(Number(value))}
                            minimumTrackTintColor={COLORS.primary}
                            maximumTrackTintColor={COLORS.lightGray}
                            thumbTintColor={COLORS.primary}
                        />

                        <Text style={styles.thresholdDescription}>
                            You will be alerted when your spending reaches {formatThreshold(alertThreshold)} of your budget.
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Cancel"
                            type="outline"
                            onPress={() => navigation.goBack()}
                            style={styles.cancelButton}
                        />
                        <Button
                            title={isEditing ? "Update" : "Create"}
                            onPress={handleSubmit}
                            loading={budgetsLoading}
                            disabled={budgetsLoading}
                            style={styles.saveButton}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Loader loading={budgetsLoading} overlay />
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
    periodContainer: {
        marginBottom: 16,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 8,
        backgroundColor: COLORS.light,
    },
    picker: {
        height: 50,
    },
    thresholdContainer: {
        marginBottom: 24,
    },
    thresholdHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    thresholdValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    thresholdDescription: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 4,
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

export default BudgetCreateScreen;