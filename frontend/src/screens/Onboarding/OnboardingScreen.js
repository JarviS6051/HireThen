
import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Animated, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingItem from './OnboardingItem';
import { COLORS } from '../../utils/constants';

// Import your onboarding images
const onboardingImages = {
    control: require('../../../assets/images/img1.svg'),
    manage: require('../../../assets/images/img2.svg'),
    saving: require('../../../assets/images/img3.svg'),
};

const slides = [
    {
        id: '1',
        image: onboardingImages.control,
        titleStart: 'Simple and easy to',
        titleHighlight: 'control',
        titleEnd: 'your money',
        description: 'Finance must be arranged to set a better lifestyle in the future.',
    },
    {
        id: '2',
        image: onboardingImages.manage,
        titleStart: 'The best App',
        titleHighlight: 'manage',
        titleEnd: 'your Finance',
        description: 'Finance must be arranged to set a better lifestyle in the future.',
    },
    {
        id: '3',
        image: onboardingImages.saving,
        titleStart: 'Achieve your',
        titleHighlight: 'saving',
        titleEnd: 'goals',
        description: 'Finance must be arranged to set a better lifestyle in the future.',
    },
];

const OnboardingScreen = () => {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = async () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            try {
                await AsyncStorage.setItem('@viewedOnboarding', 'true');
                navigation.navigate('Login');
            } catch (err) {
                console.log('Error @setItem: ', err);
            }
        }
    };

    const skip = async () => {
        try {
            await AsyncStorage.setItem('@viewedOnboarding', 'true');
            navigation.navigate('Login');
        } catch (err) {
            console.log('Error @setItem: ', err);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.flatlistContainer}>
                <FlatList
                    data={slides}
                    renderItem={({ item }) => <OnboardingItem item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <View style={styles.indicatorContainer}>
                {slides.map((_, index) => {
                    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [10, 30, 10],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            style={[styles.indicator, { width: dotWidth, opacity }]}
                            key={index}
                        />
                    );
                })}
            </View>

            {currentIndex === slides.length - 1 ? (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.skipButton} onPress={skip}>
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextButton} onPress={scrollTo}>
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const { width } = require('react-native').Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    flatlistContainer: {
        flex: 4,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    indicator: {
        height: 8,
        backgroundColor: COLORS.primary,
        marginHorizontal: 5,
        borderRadius: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        margin: 20,
        paddingBottom: 20,
        justifyContent: 'space-between',
    },
    nextButton: {
        flex: 1,
        height: 50,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    skipButton: {
        flex: 1,
        height: 50,
        borderRadius: 8,
        backgroundColor: COLORS.light,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    skipButtonText: {
        color: COLORS.dark,
        fontSize: 16,
        fontWeight: '600',
    },
    registerButton: {
        flex: 1,
        height: 50,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    registerButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    loginButton: {
        flex: 1,
        height: 50,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default OnboardingScreen;