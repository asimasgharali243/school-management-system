// // src/components/Parent/ChildCard.js
// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const ChildCard = ({
//     child,
//     onPress,
//     onViewAttendance,
//     onViewGrades,
//     onViewDiary,
//     theme
// }) => {
//     console.log('Rendering ChildCard for:', child);
//     return (
//         <TouchableOpacity
//             style={[styles.container, { backgroundColor: theme.card }]}
//             onPress={onPress}
//             activeOpacity={0.7}
//         >
//             <View style={styles.header}>
//                 <View style={styles.avatarContainer}>
//                     {child.image ? (
//                         <Image source={{ uri: child.image }} style={styles.avatar} />
//                     ) : (
//                         <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
//                             <Icon name="account" size={30} color="#FFFFFF" />
//                         </View>
//                     )}
//                 </View>
//                 <View style={styles.childInfo}>
//                     <Text style={[styles.childName, { color: theme.text }]}>
//                         {child.name}
//                     </Text>
//                     <Text style={[styles.classInfo, { color: theme.textSecondary }]}>
//                         {child.className} • {child.sectionName}
//                     </Text>
//                     <Text style={[styles.rollNo, { color: theme.textSecondary }]}>
//                         Roll No: {child.rollNo || 'N/A'}
//                     </Text>
//                 </View>
//                 <Icon name="chevron-right" size={24} color={theme.textSecondary} />
//             </View>

//             <View style={styles.actions}>
//                 <TouchableOpacity
//                     style={styles.actionButton}
//                     onPress={onViewAttendance}
//                 >
//                     <Icon name="calendar-check" size={18} color={theme.primary} />
//                     <Text style={[styles.actionText, { color: theme.primary }]}>
//                         Attendance
//                     </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={styles.actionButton}
//                     onPress={onViewGrades}
//                 >
//                     <Icon name="school" size={18} color={theme.success} />
//                     <Text style={[styles.actionText, { color: theme.success }]}>
//                         Grades
//                     </Text>
//                 </TouchableOpacity>
// {/* 
//                 <TouchableOpacity
//                     style={styles.actionButton}
//                     onPress={onViewDiary}
//                 >
//                     <Icon name="book" size={18} color={theme.warning} />
//                     <Text style={[styles.actionText, { color: theme.warning }]}>
//                         Diary
//                     </Text>
//                 </TouchableOpacity> */}

//                 {!child.DiaryAccess && (
//     <TouchableOpacity
//         style={styles.actionButton}
//         onPress={onViewDiary}
//     >
//         <Icon name="book" size={18} color={theme.warning} />
//         <Text style={[styles.actionText, { color: theme.warning }]}>
//             Diary
//         </Text>
//     </TouchableOpacity>
// )}
//             </View>
//         </TouchableOpacity>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         padding: 15,
//         borderRadius: 12,
//         marginBottom: 10,
//         elevation: 1,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 2,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     avatarContainer: {
//         marginRight: 15,
//     },
//     avatar: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//     },
//     avatarPlaceholder: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     childInfo: {
//         flex: 1,
//     },
//     childName: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 2,
//     },
//     classInfo: {
//         fontSize: 14,
//         marginBottom: 2,
//     },
//     rollNo: {
//         fontSize: 12,
//     },
//     actions: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         borderTopWidth: 1,
//         borderTopColor: 'rgba(0,0,0,0.05)',
//         paddingTop: 10,
//     },
//     actionButton: {
//         alignItems: 'center',
//         paddingHorizontal: 10,
//     },
//     actionText: {
//         fontSize: 11,
//         marginTop: 4,
//         fontWeight: '600',
//     },
// });

// export default ChildCard;
// src/components/Parent/ChildCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChildCard = ({
    child,
    onPress,
    onViewAttendance,
    onViewGrades,
    onViewDiary,
    theme
}) => {
    
    // Check if diary access is allowed (1 = allowed, 0 = not allowed)
    const hasDiaryAccess = child?.diaryAccess === 1;
    
    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.card }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    {child.image ? (
                        <Image source={{ uri: child.image }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
                            <Icon name="account" size={30} color="#FFFFFF" />
                        </View>
                    )}
                </View>
                <View style={styles.childInfo}>
                    <Text style={[styles.childName, { color: theme.text }]}>
                        {child.name}
                    </Text>
                    <Text style={[styles.classInfo, { color: theme.textSecondary }]}>
                        {child.className} • {child.sectionName}
                    </Text>
                    <Text style={[styles.rollNo, { color: theme.textSecondary }]}>
                        Roll No: {child.rollNo || 'N/A'}
                    </Text>
                </View>
                <Icon name="chevron-right" size={24} color={theme.textSecondary} />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onViewAttendance}
                >
                    <Icon name="calendar-check" size={18} color={theme.primary} />
                    <Text style={[styles.actionText, { color: theme.primary }]}>
                        Attendance
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onViewGrades}
                >
                    <Icon name="school" size={18} color={theme.success} />
                    <Text style={[styles.actionText, { color: theme.success }]}>
                        Grades
                    </Text>
                </TouchableOpacity>

                {/* Diary button - only show if diaryAccess is 1 */}
                {hasDiaryAccess && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={onViewDiary}
                    >
                        <Icon name="book" size={18} color={theme.warning} />
                        <Text style={[styles.actionText, { color: theme.warning }]}>
                            Diary
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarContainer: {
        marginRight: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    childInfo: {
        flex: 1,
    },
    childName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    classInfo: {
        fontSize: 14,
        marginBottom: 2,
    },
    rollNo: {
        fontSize: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: 10,
    },
    actionButton: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    actionText: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: '600',
    },
});

export default ChildCard;