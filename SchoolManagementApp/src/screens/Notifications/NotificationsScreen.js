
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     View,
//     Text,
//     FlatList,
//     StyleSheet,
//     TouchableOpacity,
//     RefreshControl,
//     Alert,
//     ActivityIndicator
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { BASE_URL } from '../../config/constants';
// import { format } from 'date-fns';

// const NotificationsScreen = ({ navigation }) => {
//     const [notifications, setNotifications] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [page, setPage] = useState(1);
//     const [hasMore, setHasMore] = useState(true);
//     const [expandedId, setExpandedId] = useState(null);
//     const token = useSelector(state => state.auth.token);
//     const userId = useSelector(state => state.auth.user?.id);

//     // Helper function to safely parse dataPayload
//     const parseDataPayload = (payload) => {
//         if (!payload) return null;

//         // If it's already an object, check if it has error/raw structure
//         if (typeof payload === 'object' && !Array.isArray(payload)) {
//             // Handle the case where payload has error and raw properties (double-escaped JSON)
//             if (payload.raw && typeof payload.raw === 'string') {
//                 try {
//                     // Unescape the raw string
//                     const unescaped = payload.raw.replace(/\\"/g, '"').replace(/\\n/g, '\n');
//                     return JSON.parse(unescaped);
//                 } catch (e) {
//                     console.log('Failed to parse raw data:', e);
//                     return payload;
//                 }
//             }
//             return payload;
//         }

//         // If it's a string, try to parse it
//         if (typeof payload === 'string') {
//             try {
//                 // First, unescape the string
//                 const unescaped = payload.replace(/\\"/g, '"').replace(/\\n/g, '\n');
//                 return JSON.parse(unescaped);
//             } catch (e) {
//                 console.log('Failed to parse payload string:', e);
//                 return null;
//             }
//         }

//         return payload;
//     };

//     const loadNotifications = useCallback(async (pageNumber = 1, isRefresh = false) => {
//         if (!userId || !token) return;

//         try {
//             if (isRefresh) {
//                 setRefreshing(true);
//             } else {
//                 setLoading(true);
//             }

//             const response = await fetch(
//                 `${BASE_URL}/api/notifications/user/${userId}?page=${pageNumber}&pageSize=20`,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 }
//             );

//             if (response.ok) {
//                 const result = await response.json();

//                 // Parse dataPayload for each notification
//                 const parsedData = (result.data || []).map(notification => {
//                     const parsedPayload = parseDataPayload(notification.dataPayload);
//                     return {
//                         ...notification,
//                         parsedPayload
//                     };
//                 });

//                 console.log('Notifications loaded:', parsedData.length);

//                 if (pageNumber === 1) {
//                     setNotifications(parsedData);
//                 } else {
//                     setNotifications(prev => [...prev, ...parsedData]);
//                 }

//                 setHasMore(result.data && result.data.length === 20);
//                 setPage(pageNumber);
//             }
//         } catch (error) {
//             console.error('Error loading notifications:', error);
//             Alert.alert('Error', 'Failed to load notifications');
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     }, [userId, token]);

//     useEffect(() => {
//         loadNotifications(1);
//         const unsubscribe = navigation.addListener('focus', () => {
//             loadNotifications(1, true);
//         });
//         return unsubscribe;
//     }, [loadNotifications, navigation]);

//     const handleRefresh = () => {
//         loadNotifications(1, true);
//     };

//     const handleLoadMore = () => {
//         if (!loading && hasMore) {
//             loadNotifications(page + 1);
//         }
//     };

//     const markAsRead = async (notificationId) => {
//         try {
//             const response = await fetch(
//                 `${BASE_URL}/api/notifications/${notificationId}/read?userId=${userId}`,
//                 {
//                     method: 'POST',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (response.ok) {
//                 setNotifications(prev =>
//                     prev.map(notif =>
//                         notif.queueID === notificationId
//                             ? { ...notif, status: 'READ' }
//                             : notif
//                     )
//                 );
//             }
//         } catch (error) {
//             console.error('Error marking as read:', error);
//         }
//     };

//     const markAllAsRead = async () => {
//         try {
//             const response = await fetch(
//                 `${BASE_URL}/api/notifications/mark-all-read?userId=${userId}`,
//                 {
//                     method: 'POST',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (response.ok) {
//                 setNotifications(prev =>
//                     prev.map(notif => ({ ...notif, status: 'READ' }))
//                 );
//                 Alert.alert('Success', 'All notifications marked as read');
//             }
//         } catch (error) {
//             console.error('Error marking all as read:', error);
//             Alert.alert('Error', 'Failed to mark all as read');
//         }
//     };

//     const toggleExpand = (id) => {
//         setExpandedId(expandedId === id ? null : id);
//     };

//     const handleNotificationPress = (item) => {
//         if (item.status === 'SENT' || item.status === 'PENDING') {
//             markAsRead(item.queueID);
//         }
//         toggleExpand(item.queueID);
//     };

//     // Format currency
//     const formatCurrency = (amount) => {
//         if (!amount) return 'Rs. 0';
//         return `Rs. ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
//     };

//     // Get status color based on days overdue
//     const getStatusColor = (daysOverdue) => {
//         if (!daysOverdue) return '#4A90E2'; // Due soon
//         if (daysOverdue < 0) return '#4A90E2'; // Due soon (negative means future)
//         if (daysOverdue === 0) return '#FF9800'; // Due today
//         if (daysOverdue <= 3) return '#F44336'; // Overdue 1-3 days (red)
//         if (daysOverdue <= 7) return '#FF5722'; // Overdue 4-7 days (orange)
//         return '#9C27B0'; // Overdue >7 days (purple)
//     };

//     // Get status text
//     const getStatusText = (notificationType, daysOverdue) => {
//         if (notificationType) {
//             if (notificationType.includes('DUE_IN')) {
//                 const days = notificationType.split('_')[2];
//                 return `Due in ${days} days`;
//             }
//             if (notificationType.includes('OVERDUE')) {
//                 const days = notificationType.split('_')[1];
//                 return `Overdue by ${days} days`;
//             }
//         }

//         if (daysOverdue !== undefined) {
//             if (daysOverdue < 0) return `Due in ${Math.abs(daysOverdue)} days`;
//             if (daysOverdue === 0) return 'Due today';
//             if (daysOverdue > 0) return `Overdue by ${daysOverdue} days`;
//         }

//         return 'Fee reminder';
//     };

//     // Render compact preview based on notification type
//     const renderCompactPreview = (item) => {
//         const payload = item.parsedPayload || item.dataPayload;
//         if (!payload) return null;

//         const previewItems = [];

//         // Check notification type based on ruleID or category
//         const ruleId = item.ruleID;
//         const category = payload.category || (payload.AllStudents ? 'ATTENDANCE' : '');

//         // Attendance notifications
//         if (ruleId === 2 || ruleId === 3 || category === 'ATTENDANCE' || payload.AllStudents || payload.AllAbsentStudents) {
//             if (payload.StudentName) {
//                 previewItems.push(`👤 ${payload.StudentName}`);
//             }
//             if (payload.RollNumber) {
//                 previewItems.push(`📋 ${payload.RollNumber}`);
//             }
//             if (payload.AbsentDate || payload.AttendanceDate) {
//                 previewItems.push(`📅 ${payload.AbsentDate || payload.AttendanceDate}`);
//             }
//         }
//         // Announcement notifications
//         else if (ruleId === 5 || category === 'TIMING_CHANGE' || payload.effectiveDate) {
//             if (payload.effectiveDate) {
//                 previewItems.push(`📅 Effective: ${payload.effectiveDate}`);
//             }
//             if (payload.newStartTime) {
//                 previewItems.push(`🕒 Starts: ${payload.newStartTime}`);
//             }
//         }
//         // Fee notifications - IMPROVED
//         else if (ruleId === 4 || category === 'FEE' || payload.DueAmount || payload.amount) {
//             const amount = payload.DueAmount || payload.amount;
//             const studentName = payload.StudentName || (payload.studentId ? `Student #${payload.studentId}` : '');
//             const daysOverdue = payload.DaysOverdue !== undefined ? payload.DaysOverdue : payload.daysOverdue;

//             if (studentName) {
//                 previewItems.push(`👤 ${studentName}`);
//             }
//             if (amount) {
//                 previewItems.push(`💰 ${formatCurrency(amount)}`);
//             }
//             if (payload.notificationType) {
//                 const statusText = getStatusText(payload.notificationType, daysOverdue);
//                 previewItems.push(`⏰ ${statusText}`);
//             } else if (daysOverdue !== undefined) {
//                 previewItems.push(`⏰ ${getStatusText(null, daysOverdue)}`);
//             }
//             if (payload.DueDate || payload.dueDate) {
//                 const dueDate = payload.DueDate || payload.dueDate;
//                 previewItems.push(`📅 Due: ${dueDate}`);
//             }
//         }

//         if (previewItems.length === 0) return null;

//         return (
//             <View style={styles.previewContainer}>
//                 <Text style={styles.previewText} numberOfLines={1}>
//                     {previewItems.join(' • ')}
//                 </Text>
//             </View>
//         );
//     };

//     // Render full details based on notification type
//     const renderFullDetails = (item) => {
//         const payload = item.parsedPayload || item.dataPayload;
//         if (!payload) return null;

//         const details = [];
//         const ruleId = item.ruleID;
//         const category = payload.category || (payload.AllStudents ? 'ATTENDANCE' : '');

//         // Attendance Notifications (Rule 2 & 3)
//         if (ruleId === 2 || ruleId === 3 || category === 'ATTENDANCE' || payload.AllStudents || payload.AllAbsentStudents) {
//             if (payload.StudentName) {
//                 details.push(
//                     <View key="name" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Student:</Text>
//                         <Text style={styles.detailValue}>{payload.StudentName}</Text>
//                     </View>
//                 );
//             }
//             if (payload.RollNumber) {
//                 details.push(
//                     <View key="roll" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Roll #:</Text>
//                         <Text style={styles.detailValue}>{payload.RollNumber}</Text>
//                     </View>
//                 );
//             }
//             if (payload.ClassName) {
//                 details.push(
//                     <View key="class" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Class:</Text>
//                         <Text style={styles.detailValue}>{payload.ClassName}</Text>
//                     </View>
//                 );
//             }
//             if (payload.SectionName) {
//                 details.push(
//                     <View key="section" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Section:</Text>
//                         <Text style={styles.detailValue}>{payload.SectionName}</Text>
//                     </View>
//                 );
//             }
//             if (payload.AbsentDate || payload.AttendanceDate || payload.Date) {
//                 details.push(
//                     <View key="date" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Date:</Text>
//                         <Text style={styles.detailValue}>{payload.AbsentDate || payload.AttendanceDate || payload.Date}</Text>
//                     </View>
//                 );
//             }
//             if (payload.Status) {
//                 details.push(
//                     <View key="status" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Status:</Text>
//                         <Text style={styles.detailValue}>{payload.Status}</Text>
//                     </View>
//                 );
//             }
//             if (payload.Remarks && payload.Remarks !== 'Absent') {
//                 details.push(
//                     <View key="remarks" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Remarks:</Text>
//                         <Text style={styles.detailValue}>{payload.Remarks}</Text>
//                     </View>
//                 );
//             }
//             if (payload.StudentCount && payload.StudentCount > 1) {
//                 details.push(
//                     <View key="count" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Total:</Text>
//                         <Text style={styles.detailValue}>{payload.StudentCount} students</Text>
//                     </View>
//                 );
//             }

//             // Student list
//             if (payload.AllAbsentStudents && Array.isArray(payload.AllAbsentStudents)) {
//                 details.push(
//                     <View key="students" style={styles.studentsContainer}>
//                         <Text style={styles.studentsTitle}>Students:</Text>
//                         {payload.AllAbsentStudents.map((student, idx) => (
//                             <View key={idx} style={styles.studentItem}>
//                                 <Text style={styles.studentName}>• {student.Name || student.StudentName}</Text>
//                                 <Text style={styles.studentDetail}>  Roll: {student.RollNumber}</Text>
//                                 {student.Remarks && student.Remarks !== 'Absent' && (
//                                     <Text style={styles.studentDetail}>  Note: {student.Remarks}</Text>
//                                 )}
//                             </View>
//                         ))}
//                     </View>
//                 );
//             } else if (payload.AllStudents && Array.isArray(payload.AllStudents)) {
//                 details.push(
//                     <View key="students" style={styles.studentsContainer}>
//                         <Text style={styles.studentsTitle}>Students:</Text>
//                         {payload.AllStudents.map((student, idx) => (
//                             <View key={idx} style={styles.studentItem}>
//                                 <Text style={styles.studentName}>• {student.Name}</Text>
//                                 <Text style={styles.studentDetail}>  Roll: {student.RollNumber}</Text>
//                                 {student.Remarks && student.Remarks !== 'Absent' && (
//                                     <Text style={styles.studentDetail}>  Note: {student.Remarks}</Text>
//                                 )}
//                             </View>
//                         ))}
//                     </View>
//                 );
//             }
//         }
//         // Announcement Notifications (Rule 5)
//         else if (ruleId === 5 || category === 'TIMING_CHANGE' || payload.effectiveDate) {
//             if (payload.effectiveDate) {
//                 details.push(
//                     <View key="effective" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Effective:</Text>
//                         <Text style={styles.detailValue}>{payload.effectiveDate}</Text>
//                     </View>
//                 );
//             }
//             if (payload.newStartTime) {
//                 details.push(
//                     <View key="start" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Start Time:</Text>
//                         <Text style={styles.detailValue}>{payload.newStartTime}</Text>
//                     </View>
//                 );
//             }
//             if (payload.newEndTime) {
//                 details.push(
//                     <View key="end" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>End Time:</Text>
//                         <Text style={styles.detailValue}>{payload.newEndTime}</Text>
//                     </View>
//                 );
//             }
//             if (payload.category) {
//                 details.push(
//                     <View key="category" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Category:</Text>
//                         <Text style={styles.detailValue}>{payload.category}</Text>
//                     </View>
//                 );
//             }
//         }
//         // Fee Notifications (Rule 4) - IMPROVED
//         else if (ruleId === 4 || category === 'FEE' || payload.DueAmount || payload.amount) {
//             const amount = payload.DueAmount || payload.amount;
//             const remainingAmount = payload.RemainingAmount;
//             const lateFee = payload.LateFee;
//             const totalDue = payload.TotalDue || (amount + (lateFee || 0));
//             const daysOverdue = payload.DaysOverdue !== undefined ? payload.DaysOverdue : payload.daysOverdue;
//             const notificationType = payload.notificationType;

//             // Status indicator
//             const statusColor = getStatusColor(daysOverdue);
//             const statusText = getStatusText(notificationType, daysOverdue);

//             details.push(
//                 <View key="status-header" style={[styles.statusHeader, { backgroundColor: statusColor + '20', borderLeftColor: statusColor }]}>
//                     <Text style={[styles.statusHeaderText, { color: statusColor }]}>
//                         {statusText}
//                     </Text>
//                 </View>
//             );

//             if (payload.StudentName) {
//                 details.push(
//                     <View key="name" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Student:</Text>
//                         <Text style={styles.detailValue}>{payload.StudentName}</Text>
//                     </View>
//                 );
//             }
//             if (payload.RollNumber) {
//                 details.push(
//                     <View key="roll" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Roll #:</Text>
//                         <Text style={styles.detailValue}>{payload.RollNumber}</Text>
//                     </View>
//                 );
//             }
//             if (payload.ClassName) {
//                 details.push(
//                     <View key="class" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Class:</Text>
//                         <Text style={styles.detailValue}>{payload.ClassName}</Text>
//                     </View>
//                 );
//             }
//             if (payload.FeeMonth) {
//                 details.push(
//                     <View key="month" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Month:</Text>
//                         <Text style={styles.detailValue}>{payload.FeeMonth} {payload.FeeYear || ''}</Text>
//                     </View>
//                 );
//             }

//             // Amount details
//             details.push(
//                 <View key="amount-section" style={styles.amountSection}>
//                     <View style={styles.amountRow}>
//                         <Text style={styles.amountLabel}>Due Amount:</Text>
//                         <Text style={styles.amountValue}>{formatCurrency(amount)}</Text>
//                     </View>
//                     {lateFee > 0 && (
//                         <View style={styles.amountRow}>
//                             <Text style={styles.amountLabel}>Late Fee:</Text>
//                             <Text style={[styles.amountValue, styles.lateFee]}>{formatCurrency(lateFee)}</Text>
//                         </View>
//                     )}
//                     <View style={[styles.amountRow, styles.totalRow]}>
//                         <Text style={styles.totalLabel}>Total Due:</Text>
//                         <Text style={styles.totalValue}>{formatCurrency(totalDue)}</Text>
//                     </View>
//                 </View>
//             );

//             if (payload.DueDate || payload.dueDate) {
//                 const dueDate = payload.DueDate || payload.dueDate;
//                 const formattedDate = dueDate.includes('-') ? dueDate : dueDate;
//                 details.push(
//                     <View key="dueDate" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Due Date:</Text>
//                         <Text style={[styles.detailValue, daysOverdue > 0 && styles.overdueDate]}>
//                             {formattedDate} {daysOverdue > 0 && `(${daysOverdue} days overdue)`}
//                         </Text>
//                     </View>
//                 );
//             }

//             if (payload.ChallanNo) {
//                 details.push(
//                     <View key="challan" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Challan No:</Text>
//                         <Text style={styles.detailValue}>{payload.ChallanNo}</Text>
//                     </View>
//                 );
//             }

//             if (payload.notificationType) {
//                 details.push(
//                     <View key="type" style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Reminder Type:</Text>
//                         <Text style={styles.detailValue}>{payload.notificationType.replace(/_/g, ' ')}</Text>
//                     </View>
//                 );
//             }
//         }

//         return details.length > 0 ? details : null;
//     };

//     const renderNotificationItem = ({ item }) => {
//         const isUnread = item.status === 'SENT' || item.status === 'PENDING';
//         const isExpanded = expandedId === item.queueID;
//         const payload = item.parsedPayload || item.dataPayload;

//         // Determine if this is a fee notification for special styling
//         const isFeeNotification = item.ruleID === 4 || (payload && (payload.category === 'FEE' || payload.DueAmount || payload.amount));

//         return (
//             <TouchableOpacity
//                 style={[
//                     styles.item,
//                     isUnread && styles.unreadItem,
//                     isFeeNotification && styles.feeItem
//                 ]}
//                 onPress={() => handleNotificationPress(item)}
//                 activeOpacity={0.7}
//             >
//                 <View style={styles.itemHeader}>
//                     <View style={styles.titleContainer}>
//                         <Text style={[styles.title, isUnread && styles.unreadTitle]} numberOfLines={1}>
//                             {item.title}
//                         </Text>
//                         {isUnread && <View style={styles.unreadDot} />}
//                     </View>
//                     <Text style={styles.time}>
//                         {format(new Date(item.createdTime), 'dd/MM/yy HH:mm')}
//                     </Text>
//                 </View>

//                 <Text style={styles.message} numberOfLines={2}>
//                     {item.message}
//                 </Text>

//                 {payload && renderCompactPreview(item)}

//                 {isExpanded && payload && (
//                     <View style={styles.expandedContainer}>
//                         {renderFullDetails(item)}
//                     </View>
//                 )}

//                 <View style={styles.footer}>
//                     <View style={styles.statusContainer}>
//                         <View style={[styles.statusDot, { backgroundColor: isUnread ? '#4A90E2' : '#999' }]} />
//                         <Text style={styles.statusText}>{item.status}</Text>
//                     </View>
//                     <Icon
//                         name={isExpanded ? 'chevron-up' : 'chevron-down'}
//                         size={18}
//                         color="#666"
//                     />
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     const renderEmptyComponent = () => (
//         <View style={styles.emptyContainer}>
//             <Icon name="bell-off-outline" size={48} color="#CCC" />
//             <Text style={styles.emptyText}>No notifications</Text>
//             <Text style={styles.emptySubtext}>Pull down to refresh</Text>
//         </View>
//     );

//     const unreadCount = notifications.filter(n => n.status === 'SENT' || n.status === 'PENDING').length;

//     if (loading && page === 1) {
//         return (
//             <View style={styles.centered}>
//                 <ActivityIndicator size="large" color="#4A90E2" />
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <View style={styles.headerLeft}>
//                     <Text style={styles.headerTitle}>Notifications</Text>
//                     {unreadCount > 0 && (
//                         <View style={styles.badge}>
//                             <Text style={styles.badgeText}>{unreadCount}</Text>
//                         </View>
//                     )}
//                 </View>
//                 {unreadCount > 0 && (
//                     <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
//                         <Icon name="check-all" size={18} color="#4A90E2" />
//                         <Text style={styles.markAllText}>Mark all read</Text>
//                     </TouchableOpacity>
//                 )}
//             </View>

//             <FlatList
//                 data={notifications}
//                 renderItem={renderNotificationItem}
//                 keyExtractor={item => item.queueID.toString()}
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={refreshing}
//                         onRefresh={handleRefresh}
//                         colors={['#4A90E2']}
//                         tintColor="#4A90E2"
//                     />
//                 }
//                 onEndReached={handleLoadMore}
//                 onEndReachedThreshold={0.5}
//                 ListEmptyComponent={renderEmptyComponent}
//                 contentContainerStyle={styles.list}
//                 showsVerticalScrollIndicator={false}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F8F9FA',
//     },
//     centered: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         backgroundColor: '#FFF',
//         borderBottomWidth: 1,
//         borderBottomColor: '#EFEFEF',
//     },
//     headerLeft: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#333',
//     },
//     badge: {
//         backgroundColor: '#4A90E2',
//         borderRadius: 12,
//         paddingHorizontal: 6,
//         paddingVertical: 2,
//         marginLeft: 8,
//         minWidth: 20,
//         alignItems: 'center',
//     },
//     badgeText: {
//         color: '#FFF',
//         fontSize: 11,
//         fontWeight: '600',
//     },
//     markAllButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 6,
//     },
//     markAllText: {
//         color: '#4A90E2',
//         fontSize: 12,
//         fontWeight: '500',
//         marginLeft: 4,
//     },
//     list: {
//         padding: 8,
//     },
//     item: {
//         backgroundColor: '#FFF',
//         borderRadius: 10,
//         padding: 12,
//         marginBottom: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 2,
//         elevation: 2,
//     },
//     feeItem: {
//         // Slight highlight for fee notifications
//         borderLeftWidth: 2,
//         borderLeftColor: '#FFC107',
//     },
//     unreadItem: {
//         backgroundColor: '#F8FBFF',
//         borderLeftWidth: 3,
//         borderLeftColor: '#4A90E2',
//     },
//     itemHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 6,
//     },
//     titleContainer: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginRight: 8,
//     },
//     title: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#333',
//         flex: 1,
//     },
//     unreadTitle: {
//         fontWeight: '600',
//         color: '#000',
//     },
//     unreadDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         backgroundColor: '#4A90E2',
//         marginLeft: 6,
//     },
//     time: {
//         fontSize: 11,
//         color: '#999',
//     },
//     message: {
//         fontSize: 13,
//         color: '#666',
//         marginBottom: 6,
//     },
//     previewContainer: {
//         backgroundColor: '#F0F7FF',
//         paddingHorizontal: 8,
//         paddingVertical: 4,
//         borderRadius: 4,
//         marginBottom: 6,
//     },
//     previewText: {
//         fontSize: 12,
//         color: '#2C3E50',
//     },
//     expandedContainer: {
//         backgroundColor: '#F9F9F9',
//         padding: 10,
//         borderRadius: 6,
//         marginTop: 6,
//         marginBottom: 6,
//     },
//     detailRow: {
//         flexDirection: 'row',
//         marginBottom: 4,
//     },
//     detailLabel: {
//         fontSize: 12,
//         fontWeight: '500',
//         color: '#555',
//         width: 80,
//     },
//     detailValue: {
//         fontSize: 12,
//         color: '#666',
//         flex: 1,
//     },
//     overdueDate: {
//         color: '#F44336',
//         fontWeight: '500',
//     },
//     statusHeader: {
//         padding: 8,
//         borderRadius: 4,
//         marginBottom: 8,
//         borderLeftWidth: 3,
//     },
//     statusHeaderText: {
//         fontSize: 12,
//         fontWeight: '600',
//         textAlign: 'center',
//     },
//     amountSection: {
//         backgroundColor: '#F5F5F5',
//         padding: 8,
//         borderRadius: 4,
//         marginVertical: 6,
//     },
//     amountRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 2,
//     },
//     amountLabel: {
//         fontSize: 12,
//         color: '#666',
//     },
//     amountValue: {
//         fontSize: 12,
//         fontWeight: '500',
//         color: '#333',
//     },
//     lateFee: {
//         color: '#F44336',
//     },
//     totalRow: {
//         marginTop: 4,
//         paddingTop: 4,
//         borderTopWidth: 1,
//         borderTopColor: '#DDD',
//     },
//     totalLabel: {
//         fontSize: 12,
//         fontWeight: '600',
//         color: '#333',
//     },
//     totalValue: {
//         fontSize: 13,
//         fontWeight: '700',
//         color: '#4A90E2',
//     },
//     studentsContainer: {
//         marginTop: 6,
//     },
//     studentsTitle: {
//         fontSize: 12,
//         fontWeight: '600',
//         color: '#444',
//         marginBottom: 4,
//     },
//     studentItem: {
//         marginLeft: 8,
//         marginBottom: 6,
//     },
//     studentName: {
//         fontSize: 12,
//         fontWeight: '500',
//         color: '#555',
//     },
//     studentDetail: {
//         fontSize: 11,
//         color: '#777',
//         marginLeft: 8,
//     },
//     footer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginTop: 4,
//     },
//     statusContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     statusDot: {
//         width: 6,
//         height: 6,
//         borderRadius: 3,
//         marginRight: 4,
//     },
//     statusText: {
//         fontSize: 10,
//         color: '#888',
//         textTransform: 'uppercase',
//     },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingVertical: 60,
//     },
//     emptyText: {
//         fontSize: 16,
//         color: '#999',
//         marginTop: 12,
//         fontWeight: '500',
//     },
//     emptySubtext: {
//         fontSize: 13,
//         color: '#BBB',
//         marginTop: 4,
//     },
// });

// export default NotificationsScreen;
// src/screens/NotificationsScreen.js - Updated with HTML support

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL } from '../../config/constants';
import { format } from 'date-fns';

const NotificationsScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const token = useSelector(state => state.auth.token);
    const userId = useSelector(state => state.auth.user?.id);

    // Helper to check if content is HTML
    const isHtmlContent = (title, message) => {
        return (title?.includes('<') && title?.includes('>')) ||
               (message?.includes('<') && message?.includes('>'));
    };

    // Helper to strip HTML for preview
    const stripHtml = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    };

    const loadNotifications = useCallback(async (pageNumber = 1, isRefresh = false) => {
        if (!userId || !token) return;

        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await fetch(
                `${BASE_URL}/api/notifications/user/${userId}?page=${pageNumber}&pageSize=20`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                const notificationsData = result.data || [];

                // Process notifications to handle HTML content
                const processedNotifications = notificationsData.map(notification => {
                    const hasHtml = notification.isHtmlContent === true || 
                                   isHtmlContent(notification.title, notification.message);
                    
                    let plainTitle = notification.title;
                    let plainMessage = notification.message;
                    
                    if (hasHtml) {
                        plainTitle = notification.titlePlain || stripHtml(notification.title);
                        plainMessage = notification.messagePlain || stripHtml(notification.message);
                    }
                    
                    return {
                        ...notification,
                        hasHtml,
                        plainTitle,
                        plainMessage,
                    };
                });

                if (pageNumber === 1) {
                    setNotifications(processedNotifications);
                } else {
                    setNotifications(prev => [...prev, ...processedNotifications]);
                }

                setHasMore(notificationsData.length === 20);
                setPage(pageNumber);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
            Alert.alert('Error', 'Failed to load notifications');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userId, token]);

    useEffect(() => {
        loadNotifications(1);
        const unsubscribe = navigation.addListener('focus', () => {
            loadNotifications(1, true);
        });
        return unsubscribe;
    }, [loadNotifications, navigation]);

    const handleRefresh = () => {
        loadNotifications(1, true);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadNotifications(page + 1);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/api/notifications/${notificationId}/read?userId=${userId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(notif =>
                        notif.queueID === notificationId
                            ? { ...notif, status: 'READ' }
                            : notif
                    )
                );
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/api/notifications/mark-all-read?userId=${userId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(notif => ({ ...notif, status: 'READ' }))
                );
                Alert.alert('Success', 'All notifications marked as read');
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
            Alert.alert('Error', 'Failed to mark all as read');
        }
    };

    const handleNotificationPress = (item) => {
        if (item.status === 'SENT' || item.status === 'PENDING') {
            markAsRead(item.queueID);
        }
        
        // Navigate to detail screen
        navigation.navigate('NotificationDetail', {
            notificationId: item.queueID,
            title: item.title,
            message: item.message,
            isHtml: item.hasHtml,
            titleHtml: item.title,
            messageHtml: item.message,
        });
    };

    const renderNotificationItem = ({ item }) => {
        const isUnread = item.status === 'SENT' || item.status === 'PENDING';

        return (
            <TouchableOpacity
                style={[styles.item, isUnread && styles.unreadItem]}
                onPress={() => handleNotificationPress(item)}
                activeOpacity={0.7}
            >
                <View style={styles.itemHeader}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.title, isUnread && styles.unreadTitle]} numberOfLines={1}>
                            {item.plainTitle || item.title}
                        </Text>
                        {isUnread && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.time}>
                        {format(new Date(item.createdTime), 'dd/MM/yy HH:mm')}
                    </Text>
                </View>

                <Text style={styles.message} numberOfLines={2}>
                    {item.plainMessage || item.message}
                </Text>

                {item.hasHtml && (
                    <View style={styles.htmlBadge}>
                        <Icon name="language-html5" size={12} color="#4A90E2" />
                        <Text style={styles.htmlBadgeText}>HTML Content</Text>
                    </View>
                )}

                <View style={styles.footer}>
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, { backgroundColor: isUnread ? '#4A90E2' : '#999' }]} />
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                    <Icon name="chevron-right" size={18} color="#CCC" />
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Icon name="bell-off-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>Pull down to refresh</Text>
        </View>
    );

    const unreadCount = notifications.filter(n => n.status === 'SENT' || n.status === 'PENDING').length;

    if (loading && page === 1) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                        <Icon name="check-all" size={18} color="#4A90E2" />
                        <Text style={styles.markAllText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={notifications}
                renderItem={renderNotificationItem}
                keyExtractor={item => item.queueID?.toString() || Math.random().toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#4A90E2']}
                        tintColor="#4A90E2"
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={notifications.length === 0 ? styles.emptyList : styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    badge: {
        backgroundColor: '#4A90E2',
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 8,
        minWidth: 20,
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
    },
    markAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
    },
    markAllText: {
        color: '#4A90E2',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 4,
    },
    list: {
        padding: 8,
    },
    emptyList: {
        flex: 1,
    },
    item: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    unreadItem: {
        backgroundColor: '#F8FBFF',
        borderLeftWidth: 3,
        borderLeftColor: '#4A90E2',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        flex: 1,
    },
    unreadTitle: {
        fontWeight: '600',
        color: '#000',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4A90E2',
        marginLeft: 6,
    },
    time: {
        fontSize: 11,
        color: '#999',
    },
    message: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    htmlBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    htmlBadgeText: {
        fontSize: 10,
        color: '#4A90E2',
        marginLeft: 4,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    statusText: {
        fontSize: 10,
        color: '#888',
        textTransform: 'uppercase',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
        fontWeight: '500',
    },
    emptySubtext: {
        fontSize: 13,
        color: '#BBB',
        marginTop: 4,
    },
});

export default NotificationsScreen;