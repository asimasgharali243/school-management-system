// // // // src/screens/Parent/ChildrenListScreen.js
// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //     View,
// // //     Text,
// // //     StyleSheet,
// // //     ScrollView,
// // //     TouchableOpacity,
// // //     Image,
// // //     RefreshControl,
// // //     ActivityIndicator,
// // // } from 'react-native';
// // // import { useSelector, useDispatch } from 'react-redux';
// // // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // import { selectChildren, setChildren } from '../../store/slices/authSlice';
// // // import ChildCard from '../../components/Parent/ChildCard';

// // // const ChildrenListScreen = ({ navigation }) => {
// // //     const theme = useSelector(selectThemeData);
// // //     const children = useSelector(selectChildren);
// // //     const dispatch = useDispatch();
// // //     const [loading, setLoading] = useState(false);
// // //     const [refreshing, setRefreshing] = useState(false);

// // //     // If no children in Redux, fetch them
// // //     useEffect(() => {
// // //         if (!children || children.length === 0) {
// // //             fetchChildren();
// // //         }
// // //     }, []);

// // //     const fetchChildren = async () => {
// // //         setLoading(true);
// // //         // Simulate API call - replace with actual API
// // //         setTimeout(() => {
// // //             const mockChildren = [
// // //                 {
// // //                     reg_Id: 2,
// // //                     reg_No: 1,
// // //                     name: 'ABDUL HADI',
// // //                     image: '',
// // //                     gender: 'Male',
// // //                     class_ID: 1,
// // //                     className: 'RECEPTION',
// // //                     section_ID: 1,
// // //                     sectionName: 'Nile',
// // //                     rollNo: '1',
// // //                     family_Code: 1,
// // //                     campusName: 'RGS',
// // //                     status: 'A',
// // //                 },
// // //                 {
// // //                     reg_Id: 3,
// // //                     reg_No: 2,
// // //                     name: 'MANNAN AHMED',
// // //                     image: '',
// // //                     gender: 'Male',
// // //                     class_ID: 2,
// // //                     className: 'PRE-MONTESSORI',
// // //                     section_ID: 11,
// // //                     sectionName: 'Amazon',
// // //                     rollNo: '',
// // //                     family_Code: 1,
// // //                     campusName: 'RGS',
// // //                     status: 'A',
// // //                 },
// // //             ];
// // //             dispatch(setChildren(mockChildren));
// // //             setLoading(false);
// // //         }, 1000);
// // //     };

// // //     const onRefresh = async () => {
// // //         setRefreshing(true);
// // //         await fetchChildren();
// // //         setRefreshing(false);
// // //     };

// // //     const handleChildPress = (child) => {
// // //         navigation.navigate('ChildDashboard', {
// // //             childId: child.reg_Id,
// // //             childName: child.name,
// // //             childData: child,
// // //         });
// // //     };

// // //     const handleViewAttendance = (child) => {
// // //         navigation.navigate('ChildAttendance', {
// // //             childId: child.reg_Id,
// // //             childName: child.name,
// // //         });
// // //     };

// // //     const handleViewGrades = (child) => {
// // //         navigation.navigate('ChildGrades', {
// // //             childId: child.reg_Id,
// // //             childName: child.name,
// // //         });
// // //     };

// // //     const handleViewDiary = (child) => {
// // //         navigation.navigate('ChildDiary', {
// // //             childId: child.reg_Id,
// // //             childName: child.name,
// // //         });
// // //     };

// // //     if (loading) {
// // //         return (
// // //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// // //                 <ActivityIndicator size="large" color={theme.primary} />
// // //             </View>
// // //         );
// // //     }

// // //     return (
// // //         <ScrollView
// // //             style={[styles.container, { backgroundColor: theme.background }]}
// // //             refreshControl={
// // //                 <RefreshControl
// // //                     refreshing={refreshing}
// // //                     onRefresh={onRefresh}
// // //                     colors={[theme.primary]}
// // //                 />
// // //             }
// // //         >
// // //             {/* Header */}
// // //             <View style={[styles.header, { backgroundColor: theme.primary }]}>
// // //                 <View>
// // //                     <Text style={styles.headerTitle}>My Children</Text>
// // //                     <Text style={styles.headerSubtitle}>
// // //                         {children.length} child{children.length !== 1 ? 'ren' : ''} enrolled
// // //                     </Text>
// // //                 </View>
// // //                 <Icon name="account-group" size={40} color="#FFFFFF" />
// // //             </View>

// // //             {/* Children List */}
// // //             <View style={styles.childrenList}>
// // //                 {children.map((child) => (
// // //                     <ChildCard
// // //                         key={child.reg_Id}
// // //                         child={child}
// // //                         onPress={() => handleChildPress(child)}
// // //                         onViewAttendance={() => handleViewAttendance(child)}
// // //                         onViewGrades={() => handleViewGrades(child)}
// // //                         onViewDiary={() => handleViewDiary(child)}
// // //                         theme={theme}
// // //                     />
// // //                 ))}

// // //                 {children.length === 0 && (
// // //                     <View style={styles.emptyContainer}>
// // //                         <Icon
// // //                             name="account-child-outline"
// // //                             size={60}
// // //                             color={theme.textSecondary}
// // //                         />
// // //                         <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
// // //                             No children found
// // //                         </Text>
// // //                         <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
// // //                             Contact school administration to enroll your child
// // //                         </Text>
// // //                     </View>
// // //                 )}
// // //             </View>

// // //             {/* Quick Info */}
// // //             <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
// // //                 <Icon name="information" size={24} color={theme.primary} />
// // //                 <View style={styles.infoContent}>
// // //                     <Text style={[styles.infoTitle, { color: theme.text }]}>
// // //                         Need Help?
// // //                     </Text>
// // //                     <Text style={[styles.infoText, { color: theme.textSecondary }]}>
// // //                         Contact school office for any queries regarding your child's
// // //                         education
// // //                     </Text>
// // //                 </View>
// // //             </View>
// // //         </ScrollView>
// // //     );
// // // };

// // // const styles = StyleSheet.create({
// // //     container: {
// // //         flex: 1,
// // //     },
// // //     header: {
// // //         flexDirection: 'row',
// // //         justifyContent: 'space-between',
// // //         alignItems: 'center',
// // //         padding: 20,
// // //         paddingTop: 40,
// // //         paddingBottom: 30,
// // //         borderBottomLeftRadius: 20,
// // //         borderBottomRightRadius: 20,
// // //     },
// // //     headerTitle: {
// // //         color: '#FFFFFF',
// // //         fontSize: 28,
// // //         fontWeight: 'bold',
// // //     },
// // //     headerSubtitle: {
// // //         color: '#FFFFFF',
// // //         fontSize: 16,
// // //         opacity: 0.9,
// // //         marginTop: 5,
// // //     },
// // //     childrenList: {
// // //         padding: 15,
// // //         paddingTop: 20,
// // //     },
// // //     emptyContainer: {
// // //         alignItems: 'center',
// // //         paddingVertical: 60,
// // //     },
// // //     emptyText: {
// // //         fontSize: 18,
// // //         fontWeight: '600',
// // //         marginTop: 15,
// // //     },
// // //     emptySubtext: {
// // //         fontSize: 14,
// // //         marginTop: 5,
// // //         textAlign: 'center',
// // //         paddingHorizontal: 40,
// // //     },
// // //     infoCard: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         margin: 15,
// // //         padding: 15,
// // //         borderRadius: 12,
// // //         elevation: 2,
// // //         shadowColor: '#000',
// // //         shadowOffset: { width: 0, height: 1 },
// // //         shadowOpacity: 0.1,
// // //         shadowRadius: 3,
// // //     },
// // //     infoContent: {
// // //         flex: 1,
// // //         marginLeft: 15,
// // //     },
// // //     infoTitle: {
// // //         fontSize: 16,
// // //         fontWeight: '600',
// // //         marginBottom: 5,
// // //     },
// // //     infoText: {
// // //         fontSize: 14,
// // //         lineHeight: 20,
// // //     },
// // // });

// // // export default ChildrenListScreen;

// // // src/screens/Parent/ChildrenListScreen.js
// // import React, { useState, useEffect } from 'react';
// // import {
// //     View,
// //     Text,
// //     StyleSheet,
// //     ScrollView,
// //     TouchableOpacity,
// //     Image,
// //     RefreshControl,
// //     ActivityIndicator,
// //     Alert,
// // } from 'react-native';
// // import { useSelector, useDispatch } from 'react-redux';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import { selectThemeData } from '../../store/slices/themeSlice';
// // import { selectChildren, setChildren, selectCurrentUser } from '../../store/slices/authSlice';
// // import ChildCard from '../../components/Parent/ChildCard';
// // import { useGetChildrenQuery } from '../../store/attendanceApi';

// // const ChildrenListScreen = ({ navigation }) => {
// //     const theme = useSelector(selectThemeData);
// //     const children = useSelector(selectChildren);
// //     const currentUser = useSelector(selectCurrentUser);
// //     const dispatch = useDispatch();
// //     const [refreshing, setRefreshing] = useState(false);
// // console.log('Current children:', children);
// //     // Use RTK Query to fetch children
// //     const {
// //         data: childrenData,
// //         isLoading,
// //         error,
// //         refetch,
// //     } = useGetChildrenQuery(currentUser?.id, {
// //         skip: !currentUser?.id,
// //     });
// // console.log('Fetched children data:', childrenData);
// //     // Update Redux when data is fetched
// //     useEffect(() => {
// //         if (childrenData?.success === true && childrenData?.data) {
// //             const transformedChildren = childrenData.data.map(child => ({
// //                 reg_Id: child.id || child.reg_Id,
// //                 reg_No: child.reg_No,
// //                 name: child.name || child.childName,
// //                 image: child.image || '',
// //                 gender: child.gender,
// //                 class_ID: child.classId || child.class_ID,
// //                 className: child.className,
// //                 section_ID: child.sectionId || child.section_ID,
// //                 sectionName: child.sectionName,
// //                 rollNo: child.rollNo,
// //                 family_Code: child.familyCode,
// //                 campusName: child.campusName,
// //                 status: child.status || 'A',
// //                 dob: child.dob,
// //                 bloodGroup: child.bloodGroup,
// //                 address: child.address,
// //                 admissionNo: child.admissionNo,
// //             }));
// //             dispatch(setChildren(transformedChildren));
// //         }
// //     }, [childrenData, dispatch]);

// //     const onRefresh = async () => {
// //         setRefreshing(true);
// //         await refetch();
// //         setRefreshing(false);
// //     };

// //     const handleChildPress = (child) => {
// //         navigation.navigate('ChildDashboard', {
// //             childId: child.reg_Id,
// //             childName: child.name,
// //             childData: child,
// //         });
// //     };

// //     const handleViewAttendance = (child) => {
// //         navigation.navigate('ChildAttendance', {
// //             childId: child.reg_Id,
// //             childName: child.name,
// //         });
// //     };

// //     const handleViewGrades = (child) => {
// //         navigation.navigate('ChildGrades', {
// //             childId: child.reg_Id,
// //             childName: child.name,
// //         });
// //     };

// //     const handleViewDiary = (child) => {
// //         navigation.navigate('ChildDiary', {
// //             childId: child.reg_Id,
// //             childName: child.name,
// //             childClass: child.className,
// //             childSection: child.sectionName,
// //         });
// //     };

// //     if (isLoading && !children?.length) {
// //         return (
// //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// //                 <ActivityIndicator size="large" color={theme.primary} />
// //                 <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
// //                     Loading children...
// //                 </Text>
// //             </View>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// //                 <Icon name="cloud-off-outline" size={60} color={theme.error} />
// //                 <Text style={[styles.errorText, { color: theme.error }]}>
// //                     Failed to load children
// //                 </Text>
// //                 <TouchableOpacity
// //                     style={[styles.retryButton, { backgroundColor: theme.primary }]}
// //                     onPress={onRefresh}
// //                 >
// //                     <Text style={styles.retryButtonText}>Try Again</Text>
// //                 </TouchableOpacity>
// //             </View>
// //         );
// //     }

// //     return (
// //         <ScrollView
// //             style={[styles.container, { backgroundColor: theme.background }]}
// //             refreshControl={
// //                 <RefreshControl
// //                     refreshing={refreshing}
// //                     onRefresh={onRefresh}
// //                     colors={[theme.primary]}
// //                 />
// //             }
// //         >
// //             {/* Header */}
// //             <View style={[styles.header, { backgroundColor: theme.primary }]}>
// //                 <View>
// //                     <Text style={styles.headerTitle}>My Children</Text>
// //                     <Text style={styles.headerSubtitle}>
// //                         {children?.length || 0} child{children?.length !== 1 ? 'ren' : ''} enrolled
// //                     </Text>
// //                 </View>
// //                 <Icon name="account-group" size={40} color="#FFFFFF" />
// //             </View>

// //             {/* Children List */}
// //             <View style={styles.childrenList}>
// //                 {children?.map((child) => (
// //                     <ChildCard
// //                         key={child.reg_Id}
// //                         child={child}
// //                         onPress={() => handleChildPress(child)}
// //                         onViewAttendance={() => handleViewAttendance(child)}
// //                         onViewGrades={() => handleViewGrades(child)}
// //                         onViewDiary={() => handleViewDiary(child)}
// //                         theme={theme}
// //                     />
// //                 ))}

// //                 {(!children || children.length === 0) && !isLoading && (
// //                     <View style={styles.emptyContainer}>
// //                         <Icon
// //                             name="account-child-outline"
// //                             size={60}
// //                             color={theme.textSecondary}
// //                         />
// //                         <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
// //                             No children found
// //                         </Text>
// //                         <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
// //                             Contact school administration to enroll your child
// //                         </Text>
// //                     </View>
// //                 )}
// //             </View>

// //             {/* Quick Info */}
// //             <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
// //                 <Icon name="information" size={24} color={theme.primary} />
// //                 <View style={styles.infoContent}>
// //                     <Text style={[styles.infoTitle, { color: theme.text }]}>
// //                         Need Help?
// //                     </Text>
// //                     <Text style={[styles.infoText, { color: theme.textSecondary }]}>
// //                         Contact school office for any queries regarding your child's
// //                         education
// //                     </Text>
// //                 </View>
// //             </View>
// //         </ScrollView>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //     },
// //     loadingText: {
// //         marginTop: 20,
// //         fontSize: 16,
// //         textAlign: 'center',
// //     },
// //     errorText: {
// //         marginTop: 20,
// //         fontSize: 16,
// //         textAlign: 'center',
// //     },
// //     retryButton: {
// //         marginTop: 20,
// //         paddingHorizontal: 30,
// //         paddingVertical: 10,
// //         borderRadius: 25,
// //     },
// //     retryButtonText: {
// //         color: '#FFF',
// //         fontSize: 14,
// //         fontWeight: '600',
// //     },
// //     header: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         padding: 20,
// //         paddingTop: 40,
// //         paddingBottom: 30,
// //         borderBottomLeftRadius: 20,
// //         borderBottomRightRadius: 20,
// //     },
// //     headerTitle: {
// //         color: '#FFFFFF',
// //         fontSize: 28,
// //         fontWeight: 'bold',
// //     },
// //     headerSubtitle: {
// //         color: '#FFFFFF',
// //         fontSize: 16,
// //         opacity: 0.9,
// //         marginTop: 5,
// //     },
// //     childrenList: {
// //         padding: 15,
// //         paddingTop: 20,
// //     },
// //     emptyContainer: {
// //         alignItems: 'center',
// //         paddingVertical: 60,
// //     },
// //     emptyText: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         marginTop: 15,
// //     },
// //     emptySubtext: {
// //         fontSize: 14,
// //         marginTop: 5,
// //         textAlign: 'center',
// //         paddingHorizontal: 40,
// //     },
// //     infoCard: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         margin: 15,
// //         padding: 15,
// //         borderRadius: 12,
// //         elevation: 2,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 1 },
// //         shadowOpacity: 0.1,
// //         shadowRadius: 3,
// //     },
// //     infoContent: {
// //         flex: 1,
// //         marginLeft: 15,
// //     },
// //     infoTitle: {
// //         fontSize: 16,
// //         fontWeight: '600',
// //         marginBottom: 5,
// //     },
// //     infoText: {
// //         fontSize: 14,
// //         lineHeight: 20,
// //     },
// // });

// // export default ChildrenListScreen;

// // src/screens/Parent/ChildrenListScreen.js
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     Image,
//     RefreshControl,
//     ActivityIndicator,
//     Alert,
// } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { selectThemeData } from '../../store/slices/themeSlice';
// import { selectChildren, setChildren, selectCurrentUser } from '../../store/slices/authSlice';
// import ChildCard from '../../components/Parent/ChildCard';
// import { useGetChildrenQuery } from '../../store/attendanceApi';

// const ChildrenListScreen = ({ navigation }) => {
//     const theme = useSelector(selectThemeData);
//     const reduxChildren = useSelector(selectChildren);
//     const currentUser = useSelector(selectCurrentUser);
//     const dispatch = useDispatch();
//     const [refreshing, setRefreshing] = useState(false);
    
//     // Check if children exist in Redux store
//     const hasChildrenInStore = useMemo(() => {
//         return reduxChildren && Array.isArray(reduxChildren) && reduxChildren.length > 0;
//     }, [reduxChildren]);

//     console.log('📦 Children in Redux store:', {
//         count: reduxChildren?.length || 0,
//         hasChildren: hasChildrenInStore,
//         firstChild: reduxChildren?.[0]?.name
//     });

//     // Only fetch from API if children not in store
//     const {
//         data: childrenData,
//         isLoading,
//         error,
//         refetch,
//     } = useGetChildrenQuery(currentUser?.id, {
//         skip: !currentUser?.id || hasChildrenInStore, // Skip if children already in store
//     });

//     console.log('🌐 API Fetch status:', {
//         skip: !currentUser?.id || hasChildrenInStore,
//         isLoading: isLoading,
//         hasData: !!childrenData,
//         error: error
//     });

//     // Update Redux only when API data is fetched (only if store was empty)
//     useEffect(() => {
//         if (childrenData?.success === true && childrenData?.data && !hasChildrenInStore) {
//             console.log('📥 Updating Redux store with API data');
//             const transformedChildren = childrenData.data.map(child => ({
//                 reg_Id: child.reg_Id || child.id,
//                 reg_No: child.reg_No,
//                 name: child.name || child.childName,
//                 image: child.image || '',
//                 gender: child.gender,
//                 class_ID: child.class_ID || child.classId,
//                 className: child.className,
//                 section_ID: child.section_ID || child.sectionId,
//                 sectionName: child.sectionName,
//                 rollNo: child.rollNo,
//                 family_Code: child.family_Code || child.familyCode,
//                 campusName: child.campusName,
//                 status: child.status || 'A',
//                 dob: child.dob,
//                 bloodGroup: child.bloodGroup,
//                 address: child.address,
//                 admissionNo: child.admissionNo,
//                 diaryAccess: child.diaryAccess || 0, // Important: Store diary access
//             }));
//             dispatch(setChildren(transformedChildren));
//         }
//     }, [childrenData, dispatch, hasChildrenInStore]);

//     const onRefresh = async () => {
//         setRefreshing(true);
//         // Force refetch from API on refresh
//         const result = await refetch();
//         if (result.data?.success === true && result.data?.data) {
//             const transformedChildren = result.data.data.map(child => ({
//                 reg_Id: child.reg_Id || child.id,
//                 reg_No: child.reg_No,
//                 name: child.name || child.childName,
//                 image: child.image || '',
//                 gender: child.gender,
//                 class_ID: child.class_ID || child.classId,
//                 className: child.className,
//                 section_ID: child.section_ID || child.sectionId,
//                 sectionName: child.sectionName,
//                 rollNo: child.rollNo,
//                 family_Code: child.family_Code || child.familyCode,
//                 campusName: child.campusName,
//                 status: child.status || 'A',
//                 dob: child.dob,
//                 bloodGroup: child.bloodGroup,
//                 address: child.address,
//                 admissionNo: child.admissionNo,
//                 diaryAccess: child.diaryAccess || 0,
//             }));
//             dispatch(setChildren(transformedChildren));
//         }
//         setRefreshing(false);
//     };

//     const handleChildPress = (child) => {
//         navigation.navigate('ChildDashboard', {
//             childId: child.reg_Id,
//             childName: child.name,
//             childData: child,
//         });
//     };

//     const handleViewAttendance = (child) => {
//         navigation.navigate('ChildAttendance', {
//             childId: child.reg_Id,
//             childName: child.name,
//         });
//     };

//     const handleViewGrades = (child) => {
//         navigation.navigate('ChildGrades', {
//             childId: child.reg_Id,
//             childName: child.name,
//         });
//     };

//     const handleViewDiary = (child) => {
//         // Check if diary access is allowed (1 = allowed, 0 = not allowed)
//         if (child.diaryAccess === 0) {
//             Alert.alert(
//                 'Access Restricted',
//                 'Diary access is currently restricted. Please contact the school administration for more information.',
//                 [{ text: 'OK' }]
//             );
//             return;
//         }
        
//         navigation.navigate('ChildDiary', {
//             childId: child.reg_Id,
//             childName: child.name,
//             childClass: child.className,
//             childSection: child.sectionName,
//         });
//     };

//     // Determine which children to display
//     const displayChildren = useMemo(() => {
//         // First try Redux store, then API data
//         if (hasChildrenInStore) {
//             return reduxChildren;
//         }
//         if (childrenData?.success === true && childrenData?.data) {
//             return childrenData.data.map(child => ({
//                 ...child,
//                 diaryAccess: child.diaryAccess || 0,
//             }));
//         }
//         return [];
//     }, [hasChildrenInStore, reduxChildren, childrenData]);

//     const isLoadingState = isLoading && !hasChildrenInStore && !childrenData;

//     if (isLoadingState) {
//         return (
//             <View style={[styles.container, { backgroundColor: theme.background }]}>
//                 <ActivityIndicator size="large" color={theme.primary} />
//                 <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
//                     Loading children...
//                 </Text>
//             </View>
//         );
//     }

//     if (error && !hasChildrenInStore) {
//         return (
//             <View style={[styles.container, { backgroundColor: theme.background }]}>
//                 <Icon name="cloud-off-outline" size={60} color={theme.error} />
//                 <Text style={[styles.errorText, { color: theme.error }]}>
//                     Failed to load children
//                 </Text>
//                 <TouchableOpacity
//                     style={[styles.retryButton, { backgroundColor: theme.primary }]}
//                     onPress={onRefresh}
//                 >
//                     <Text style={styles.retryButtonText}>Try Again</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <ScrollView
//             style={[styles.container, { backgroundColor: theme.background }]}
//             refreshControl={
//                 <RefreshControl
//                     refreshing={refreshing}
//                     onRefresh={onRefresh}
//                     colors={[theme.primary]}
//                 />
//             }
//         >
//             {/* Header */}
//             <View style={[styles.header, { backgroundColor: theme.primary }]}>
//                 <View>
//                     <Text style={styles.headerTitle}>My Children</Text>
//                     <Text style={styles.headerSubtitle}>
//                         {displayChildren.length} child{displayChildren.length !== 1 ? 'ren' : ''} enrolled
//                     </Text>
//                 </View>
//                 <Icon name="account-group" size={40} color="#FFFFFF" />
//             </View>

//             {/* Children List */}
//             <View style={styles.childrenList}>
//                 {displayChildren.map((child) => (
//                     <ChildCard
//                         key={child.reg_Id}
//                         child={child}
//                         onPress={() => handleChildPress(child)}
//                         onViewAttendance={() => handleViewAttendance(child)}
//                         onViewGrades={() => handleViewGrades(child)}
//                         onViewDiary={() => handleViewDiary(child)}
//                         theme={theme}
//                     />
//                 ))}

//                 {displayChildren.length === 0 && !isLoadingState && (
//                     <View style={styles.emptyContainer}>
//                         <Icon
//                             name="account-child-outline"
//                             size={60}
//                             color={theme.textSecondary}
//                         />
//                         <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
//                             No children found
//                         </Text>
//                         <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
//                             Contact school administration to enroll your child
//                         </Text>
//                     </View>
//                 )}
//             </View>

//             {/* Quick Info */}
//             <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
//                 <Icon name="information" size={24} color={theme.primary} />
//                 <View style={styles.infoContent}>
//                     <Text style={[styles.infoTitle, { color: theme.text }]}>
//                         Need Help?
//                     </Text>
//                     <Text style={[styles.infoText, { color: theme.textSecondary }]}>
//                         Contact school office for any queries regarding your child's
//                         education
//                     </Text>
//                 </View>
//             </View>
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     loadingText: {
//         marginTop: 20,
//         fontSize: 16,
//         textAlign: 'center',
//     },
//     errorText: {
//         marginTop: 20,
//         fontSize: 16,
//         textAlign: 'center',
//     },
//     retryButton: {
//         marginTop: 20,
//         paddingHorizontal: 30,
//         paddingVertical: 10,
//         borderRadius: 25,
//     },
//     retryButtonText: {
//         color: '#FFF',
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 20,
//         paddingTop: 40,
//         paddingBottom: 30,
//         borderBottomLeftRadius: 20,
//         borderBottomRightRadius: 20,
//     },
//     headerTitle: {
//         color: '#FFFFFF',
//         fontSize: 28,
//         fontWeight: 'bold',
//     },
//     headerSubtitle: {
//         color: '#FFFFFF',
//         fontSize: 16,
//         opacity: 0.9,
//         marginTop: 5,
//     },
//     childrenList: {
//         padding: 15,
//         paddingTop: 20,
//     },
//     emptyContainer: {
//         alignItems: 'center',
//         paddingVertical: 60,
//     },
//     emptyText: {
//         fontSize: 18,
//         fontWeight: '600',
//         marginTop: 15,
//     },
//     emptySubtext: {
//         fontSize: 14,
//         marginTop: 5,
//         textAlign: 'center',
//         paddingHorizontal: 40,
//     },
//     infoCard: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         margin: 15,
//         padding: 15,
//         borderRadius: 12,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//     },
//     infoContent: {
//         flex: 1,
//         marginLeft: 15,
//     },
//     infoTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         marginBottom: 5,
//     },
//     infoText: {
//         fontSize: 14,
//         lineHeight: 20,
//     },
// });

// export default ChildrenListScreen;
// src/screens/Parent/ChildrenListScreen.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectThemeData } from '../../store/slices/themeSlice';
import { selectChildren, setChildren, selectCurrentUser } from '../../store/slices/authSlice';
import ChildCard from '../../components/Parent/ChildCard';
import { useGetChildrenQuery } from '../../store/attendanceApi';

const ChildrenListScreen = ({ navigation }) => {
    const theme = useSelector(selectThemeData);
    const reduxChildren = useSelector(selectChildren);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(0); // Used to force refetch
    
    // ALWAYS fetch on first load and when forceRefresh changes
    const {
        data: childrenData,
        isLoading,
        error,
        refetch,
    } = useGetChildrenQuery(currentUser?.id, {
        skip: !currentUser?.id,
    });

    console.log('🌐 API Fetch status:', {
        isLoading: isLoading,
        hasData: !!childrenData,
        error: error,
        forceRefresh: forceRefresh
    });

    // Update Redux when API data is fetched
    useEffect(() => {
        if (childrenData?.success === true && childrenData?.data) {
            console.log('📥 Updating Redux store with API data, count:', childrenData.data.length);
            const transformedChildren = childrenData.data.map(child => ({
                reg_Id: child.reg_Id || child.id,
                reg_No: child.reg_No,
                name: child.name || child.childName,
                image: child.image || '',
                gender: child.gender,
                class_ID: child.class_ID || child.classId,
                className: child.className,
                section_ID: child.section_ID || child.sectionId,
                sectionName: child.sectionName,
                rollNo: child.rollNo,
                family_Code: child.family_Code || child.familyCode,
                campusName: child.campusName,
                status: child.status || 'A',
                dob: child.dob,
                bloodGroup: child.bloodGroup,
                address: child.address,
                admissionNo: child.admissionNo,
                diaryAccess: child.diaryAccess || 0,
            }));
            dispatch(setChildren(transformedChildren));
        }
    }, [childrenData, dispatch]);

    const onRefresh = useCallback(async () => {
        console.log('🔄 Manual refresh triggered');
        setRefreshing(true);
        
        try {
            // Method 1: Use refetch() if available
            if (refetch) {
                const result = await refetch();
                console.log('🔄 Refresh result:', {
                    success: result?.data?.success,
                    dataCount: result?.data?.data?.length
                });
            } else {
                // Method 2: Force refetch by changing a key
                setForceRefresh(prev => prev + 1);
            }
        } catch (error) {
            console.error('🔄 Refresh error:', error);
            // If refetch fails, try force refresh
            setForceRefresh(prev => prev + 1);
        } finally {
            setRefreshing(false);
        }
    }, [refetch]);

    // Force refetch when forceRefresh changes
    useEffect(() => {
        if (forceRefresh > 0 && refetch) {
            refetch();
        }
    }, [forceRefresh, refetch]);

    const handleChildPress = useCallback((child) => {
        navigation.navigate('ChildDashboard', {
            childId: child.reg_Id,
            childName: child.name,
            childData: child,
        });
    }, [navigation]);

    const handleViewAttendance = useCallback((child) => {
        navigation.navigate('ChildAttendance', {
            childId: child.reg_Id,
            childName: child.name,
        });
    }, [navigation]);

    const handleViewGrades = useCallback((child) => {
        navigation.navigate('ChildGrades', {
            childId: child.reg_Id,
            childName: child.name,
            childClassId: child.class_ID,
            childSectionId: child.section_ID,
            childRollNo: child.rollNo,
        });
    }, [navigation]);

    const handleViewDiary = useCallback((child) => {
        if (child.diaryAccess === 0) {
            Alert.alert(
                'Access Restricted',
                'Diary access is currently restricted. Please contact the school administration for more information.',
                [{ text: 'OK' }]
            );
            return;
        }
        
        navigation.navigate('ChildDiary', {
            childId: child.reg_Id,
            childName: child.name,
            childClass: child.className,
            childSection: child.sectionName,
        });
    }, [navigation]);

    // Determine which children to display (prefer Redux store)
    const displayChildren = useMemo(() => {
        if (reduxChildren && Array.isArray(reduxChildren) && reduxChildren.length > 0) {
            return reduxChildren;
        }
        if (childrenData?.success === true && childrenData?.data) {
            return childrenData.data.map(child => ({
                ...child,
                diaryAccess: child.diaryAccess || 0,
            }));
        }
        return [];
    }, [reduxChildren, childrenData]);

    // Show loading only on first load when no data
    if (isLoading && !childrenData && (!reduxChildren || reduxChildren.length === 0)) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                    Loading children...
                </Text>
            </View>
        );
    }

    if (error && (!reduxChildren || reduxChildren.length === 0)) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Icon name="cloud-off-outline" size={60} color={theme.error} />
                <Text style={[styles.errorText, { color: theme.error }]}>
                    Failed to load children
                </Text>
                <TouchableOpacity
                    style={[styles.retryButton, { backgroundColor: theme.primary }]}
                    onPress={onRefresh}
                >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[theme.primary]}
                    tintColor={theme.primary}
                    title="Pull to refresh..."
                    titleColor={theme.textSecondary}
                />
            }
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <View>
                    <Text style={styles.headerTitle}>My Children</Text>
                    <Text style={styles.headerSubtitle}>
                        {displayChildren.length} child{displayChildren.length !== 1 ? 'ren' : ''} enrolled
                    </Text>
                </View>
                <Icon name="account-group" size={40} color="#FFFFFF" />
            </View>

            {/* Children List */}
            <View style={styles.childrenList}>
                {displayChildren.length > 0 ? (
                    displayChildren.map((child) => (
                        <ChildCard
                            key={child.reg_Id}
                            child={child}
                            onPress={() => handleChildPress(child)}
                            onViewAttendance={() => handleViewAttendance(child)}
                            onViewGrades={() => handleViewGrades(child)}
                            onViewDiary={() => handleViewDiary(child)}
                            theme={theme}
                        />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Icon
                            name="account-child-outline"
                            size={60}
                            color={theme.textSecondary}
                        />
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            No children found
                        </Text>
                        <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                            Contact school administration to enroll your child
                        </Text>
                    </View>
                )}
            </View>

            {/* Quick Info */}
            <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
                <Icon name="information" size={24} color={theme.primary} />
                <View style={styles.infoContent}>
                    <Text style={[styles.infoTitle, { color: theme.text }]}>
                        Need Help?
                    </Text>
                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                        Contact school office for any queries regarding your child's education
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    errorText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 25,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
        paddingBottom: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#FFFFFF',
        fontSize: 16,
        opacity: 0.9,
        marginTop: 5,
    },
    childrenList: {
        padding: 15,
        paddingTop: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 15,
        padding: 15,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    infoContent: {
        flex: 1,
        marginLeft: 15,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
    },
});

export default ChildrenListScreen;