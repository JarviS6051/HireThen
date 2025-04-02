// src/components/Header.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';

const Header = ({
    title,
    leftIcon,
    rightIcon,
    onLeftPress,
    onRightPress,
    style,
    titleStyle,
    showProfileMenu = true, // New prop to control profile menu visibility
}) => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    const handleLeftPress = () => {
        if (onLeftPress) {
            onLeftPress();
        } else if (leftIcon === 'arrow-back') {
            navigation.goBack();
        }
    };

    // Toggle profile menu
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    // Handle logout
    const handleLogout = async () => {
        setShowMenu(false);
        await logout();
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user || !user.name) return '?';

        const nameParts = user.name.split(' ');
        if (nameParts.length >= 2) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return nameParts[0][0].toUpperCase();
    };

    return (
        <View style={[styles.header, style]}>
            {leftIcon ? (
                <TouchableOpacity
                    style={styles.leftButton}
                    onPress={handleLeftPress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Icon name={leftIcon} size={24} color={COLORS.dark} />
                </TouchableOpacity>
            ) : (
                <View style={styles.leftButton} />
            )}

            <Text style={[styles.title, titleStyle]} numberOfLines={1}>
                {title}
            </Text>

            {showProfileMenu ? (
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={toggleMenu}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{getUserInitials()}</Text>
                    </View>
                </TouchableOpacity>
            ) : rightIcon ? (
                <TouchableOpacity
                    style={styles.rightButton}
                    onPress={onRightPress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Icon name={rightIcon} size={24} color={COLORS.dark} />
                </TouchableOpacity>
            ) : (
                <View style={styles.rightButton} />
            )}

            {/* Profile Menu Modal */}
            <Modal
                transparent={true}
                visible={showMenu}
                animationType="fade"
                onRequestClose={() => setShowMenu(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowMenu(false)}
                >
                    <View
                        style={[
                            styles.menuContainer,
                            { top: 70, right: 20 } // Position near the avatar
                        ]}
                    >
                        <View style={styles.userInfoContainer}>
                            <View style={styles.largeAvatar}>
                                <Text style={styles.largeAvatarText}>{getUserInitials()}</Text>
                            </View>
                            <View style={styles.userTextContainer}>
                                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                                <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
                            </View>
                        </View>

                        <View style={styles.menuSeparator} />

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setShowMenu(false);
                                navigation.navigate('Dashboard');
                            }}
                        >
                            <Icon name="home-outline" size={20} color={COLORS.dark} />
                            <Text style={styles.menuItemText}>Dashboard</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={handleLogout}
                        >
                            <Icon name="log-out-outline" size={20} color={COLORS.danger} />
                            <Text style={[styles.menuItemText, { color: COLORS.danger }]}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    leftButton: {
        width: 40,
        alignItems: 'flex-start',
    },
    rightButton: {
        width: 40,
        alignItems: 'flex-end',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.dark,
    },
    profileButton: {
        width: 40,
        alignItems: 'flex-end',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    menuContainer: {
        position: 'absolute',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        width: 260,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    userInfoContainer: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    largeAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    largeAvatarText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
    },
    userTextContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.gray,
        marginTop: 2,
    },
    menuSeparator: {
        height: 1,
        backgroundColor: COLORS.lightGray,
        marginHorizontal: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuItemText: {
        marginLeft: 12,
        fontSize: 16,
        color: COLORS.dark,
    },
});

export default Header;