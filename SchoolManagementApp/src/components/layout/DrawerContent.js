import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../../store/slices/authSlice';

const DrawerContent = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.drawerHeader}>
                <Image
                    source={user?.avatar ? { uri: user.avatar } : require('../../../assets/default-avatar.png')}
                    style={styles.avatar}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
                    <Text style={styles.userRole}>{user?.role || 'User'}</Text>
                </View>
            </View>

            <DrawerItemList {...props} />

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    userRole: {
        fontSize: 12,
        color: '#999',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginHorizontal: 10,
        marginTop: 20,
        borderRadius: 8,
        backgroundColor: '#FFF5F5',
    },
    logoutText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '500',
    },
});

export default DrawerContent;