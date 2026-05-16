// // // screens/Parent/StudentFeeLedgerScreen.js
// // import React, { useState, useCallback, useMemo, useEffect } from 'react';
// // import {
// //     View,
// //     Text,
// //     StyleSheet,
// //     ScrollView,
// //     TouchableOpacity,
// //     ActivityIndicator,
// //     RefreshControl,
// //     Dimensions,
// //     Alert,
// //     Share,
// //     Platform,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import { useSelector } from 'react-redux';
// // import { selectThemeData } from '../../store/slices/themeSlice';
// // import { useGetStudentFeeLedgerQuery } from '../../store/feeApi';
// // import DateTimePicker from '@react-native-community/datetimepicker';

// // const { width: screenWidth } = Dimensions.get('window');

// // const StudentFeeLedgerScreen = ({ route, navigation }) => {
// //     const theme = useSelector(selectThemeData);
// //     const { studentId, studentName, studentData } = route.params || {};

// //     // Date range state - default last 6 months to current date
// //     const getDefaultFromDate = () => {
// //         const date = new Date();
// //         date.setMonth(date.getMonth() - 6);
// //         return date;
// //     };

// //     const [fromDate, setFromDate] = useState(getDefaultFromDate());
// //     const [toDate, setToDate] = useState(new Date());
// //     const [showFromPicker, setShowFromPicker] = useState(false);
// //     const [showToPicker, setShowToPicker] = useState(false);
// //     const [refreshing, setRefreshing] = useState(false);

// //     // Fetch fee ledger data
// //     const {
// //         data: ledgerData = [],
// //         isLoading,
// //         isFetching,
// //         error,
// //         refetch,
// //     } = useGetStudentFeeLedgerQuery({
// //         studentRegistrationId: studentId,
// //         fromDate: fromDate.toISOString().split('T')[0],
// //         toDate: toDate.toISOString().split('T')[0],
// //     }, {
// //         skip: !studentId,
// //     });

// //     // Process ledger data with running balance
// //     const processedData = useMemo(() => {
// //         if (!ledgerData || !Array.isArray(ledgerData) || ledgerData.length === 0) {
// //             return { transactions: [], openingBalance: 0, closingBalance: 0, totals: { debit: 0, credit: 0, discount: 0 } };
// //         }

// //         let runningBalance = 0;
// //         const transactions = [];
// //         let totalDebit = 0;
// //         let totalCredit = 0;
// //         let totalDiscount = 0;

// //         // First pass to calculate totals
// //         ledgerData.forEach(item => {
// //             const debit = parseFloat(item.Debit) || 0;
// //             const credit = parseFloat(item.Credit) || 0;
// //             const discount = parseFloat(item.Discount) || 0;
            
// //             totalDebit += debit;
// //             totalCredit += credit;
// //             totalDiscount += discount;
// //         });

// //         // Opening balance = Total Debit - Total Credit - Total Discount (for first record perspective)
// //         const openingBalance = totalDebit - totalCredit - totalDiscount;
        
// //         // Reset running balance for transactions
// //         runningBalance = openingBalance;

// //         // Process each transaction
// //         ledgerData.forEach((item, index) => {
// //             const debit = parseFloat(item.Debit) || 0;
// //             const credit = parseFloat(item.Credit) || 0;
// //             const discount = parseFloat(item.Discount) || 0;
            
// //             // Calculate balance for this transaction
// //             runningBalance = runningBalance + debit - credit - discount;
            
// //             // Create remarks from FundName + FeeMonth + FeeYear
// //             const remarks = [item.FundName, item.FeeMonth, item.FeeYear]
// //                 .filter(f => f && f !== 'null' && f !== '')
// //                 .join(' - ');
            
// //             transactions.push({
// //                 id: index,
// //                 date: item.Date || '',
// //                 voucherID: item.VoucherID || '',
// //                 challanNo: item.ChallanNo || '',
// //                 remarks: remarks || '-',
// //                 feeGenerate: debit,
// //                 feePaid: credit,
// //                 discount: discount,
// //                 balance: runningBalance,
// //                 rawData: item,
// //             });
// //         });

// //         return {
// //             transactions,
// //             openingBalance,
// //             closingBalance: transactions.length > 0 ? transactions[transactions.length - 1].balance : openingBalance,
// //             totals: {
// //                 debit: totalDebit,
// //                 credit: totalCredit,
// //                 discount: totalDiscount,
// //             },
// //         };
// //     }, [ledgerData]);

// //     const onRefresh = useCallback(async () => {
// //         setRefreshing(true);
// //         await refetch();
// //         setRefreshing(false);
// //     }, [refetch]);

// //     // Format date for display
// //     const formatDateDisplay = (date) => {
// //         return date.toLocaleDateString('en-GB', {
// //             day: '2-digit',
// //             month: 'short',
// //             year: 'numeric',
// //         });
// //     };

// //     // Format date for API
// //     const formatDateForAPI = (date) => {
// //         return date.toISOString().split('T')[0];
// //     };

// //     // Handle from date change
// //     const onFromDateChange = (event, selectedDate) => {
// //         setShowFromPicker(Platform.OS === 'ios');
// //         if (selectedDate && selectedDate <= toDate) {
// //             setFromDate(selectedDate);
// //         } else if (selectedDate && selectedDate > toDate) {
// //             Alert.alert('Invalid Date', 'From date cannot be after To date');
// //         }
// //     };

// //     // Handle to date change
// //     const onToDateChange = (event, selectedDate) => {
// //         setShowToPicker(Platform.OS === 'ios');
// //         if (selectedDate && selectedDate >= fromDate) {
// //             setToDate(selectedDate);
// //         } else if (selectedDate && selectedDate < fromDate) {
// //             Alert.alert('Invalid Date', 'To date cannot be before From date');
// //         }
// //     };

// //     // Share report
// //     const handleShare = async () => {
// //         try {
// //             let reportText = `📊 *Fee Ledger Report*\n\n`;
// //             reportText += `👤 Student: ${studentName || 'N/A'}\n`;
// //             reportText += `📅 Period: ${formatDateDisplay(fromDate)} - ${formatDateDisplay(toDate)}\n\n`;
// //             reportText += `💰 Opening Balance: ${formatCurrency(processedData.openingBalance)}\n`;
// //             reportText += `📈 Total Fee Generated: ${formatCurrency(processedData.totals.debit)}\n`;
// //             reportText += `💵 Total Fee Paid: ${formatCurrency(processedData.totals.credit)}\n`;
// //             reportText += `🏷️ Total Discount: ${formatCurrency(processedData.totals.discount)}\n`;
// //             reportText += `🔚 Closing Balance: ${formatCurrency(processedData.closingBalance)}\n\n`;
// //             reportText += `*Transaction Details:*\n`;
            
// //             processedData.transactions.forEach((t, idx) => {
// //                 reportText += `\n${idx + 1}. 📅 ${t.date}\n`;
// //                 reportText += `   🧾 Voucher: ${t.voucherID}\n`;
// //                 reportText += `   📝 Remarks: ${t.remarks}\n`;
// //                 reportText += `   💰 Fee: ${formatCurrency(t.feeGenerate)}\n`;
// //                 reportText += `   💵 Paid: ${formatCurrency(t.feePaid)}\n`;
// //                 reportText += `   🏷️ Discount: ${formatCurrency(t.discount)}\n`;
// //                 reportText += `   ⚖️ Balance: ${formatCurrency(t.balance)}\n`;
// //             });
            
// //             await Share.share({
// //                 message: reportText,
// //                 title: 'Fee Ledger Report',
// //             });
// //         } catch (error) {
// //             console.error('Share error:', error);
// //         }
// //     };

// //     // Format currency
// //     const formatCurrency = (amount) => {
// //         if (isNaN(amount)) return 'PKR 0';
// //         return `PKR ${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
// //     };

// //     // Render header section
// //     const renderHeader = () => (
// //         <View style={[styles.headerSection, { backgroundColor: theme.card }]}>
// //             <View style={styles.headerTop}>
              
// //                 <Text style={[styles.headerTitle, { color: theme.text }]}>{studentName || 'Student'}</Text>
// //                 <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
// //                     <Icon name="share-variant" size={22} color={theme.primary} />
// //                 </TouchableOpacity>
// //             </View>
// //          </View>
// //     );

// //     // Render date range picker
// //     const renderDateRangePicker = () => (
// // //         <View style={[styles.dateRangeContainer, { backgroundColor: theme.card }]}>
// // //             <Text style={[styles.sectionLabel, { color: theme.text }]}>Select Date Range</Text>
// // //             <View style={styles.dateRangeRow}>
// // //                <View> <Text style={[styles.dateButtonText, { color: theme.text }]}>
// // //                         From
// // //                     </Text>
// // //                 <TouchableOpacity
// // //                     style={[styles.dateButton, { borderColor: theme.border, backgroundColor: theme.background }]}
// // //                     onPress={() => setShowFromPicker(true)}
// // //                 >
                    
// // //                     <Icon name="calendar" size={18} color={theme.primary} />
                    
// // //                     <Text style={[styles.dateButtonText, { color: theme.text }]}>
// // //                          {formatDateDisplay(fromDate)}
// // //                     </Text>
// // //                 </TouchableOpacity>
// // // </View>
// // // <View>


// // //     <Text style={[styles.dateButtonText, { color: theme.text }]}>
// // //                         To
// // //                     </Text>
// // //                 <TouchableOpacity
// // //                     style={[styles.dateButton, { borderColor: theme.border, backgroundColor: theme.background }]}
// // //                     onPress={() => setShowToPicker(true)}
// // //                 >
// // //                     <Icon name="calendar" size={18} color={theme.primary} />
// // //                     <Text style={[styles.dateButtonText, { color: theme.text }]}>
// // //                          {formatDateDisplay(toDate)}
// // //                     </Text>
// // //                 </TouchableOpacity>
// // //             </View>
// // //             </View>
// // //         </View>
// // <View style={[styles.dateRangeContainer, { backgroundColor: theme.card }]}>
// //         <Text style={[styles.sectionLabel, { color: theme.text }]}>Select Date Range</Text>
        
// //         <View style={styles.dateRangeRow}>
// //             {/* From Date */}
// //             <View style={styles.dateColumn}>
// //                 <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>
// //                     From
// //                 </Text>
// //                 <TouchableOpacity
// //                     style={[styles.dateButton, { 
// //                         borderColor: theme.border, 
// //                         backgroundColor: theme.background 
// //                     }]}
// //                     onPress={() => setShowFromPicker(true)}
// //                 >
// //                     <Icon name="calendar" size={18} color={theme.primary} />
// //                     <Text style={[styles.dateButtonText, { color: theme.text }]}>
// //                         {formatDateDisplay(fromDate)}
// //                     </Text>
// //                 </TouchableOpacity>
// //             </View>

// //             {/* To Date */}
// //             <View style={styles.dateColumn}>
// //                 <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>
// //                     To
// //                 </Text>
// //                 <TouchableOpacity
// //                     style={[styles.dateButton, { 
// //                         borderColor: theme.border, 
// //                         backgroundColor: theme.background 
// //                     }]}
// //                     onPress={() => setShowToPicker(true)}
// //                 >
// //                     <Icon name="calendar" size={18} color={theme.primary} />
// //                     <Text style={[styles.dateButtonText, { color: theme.text }]}>
// //                         {formatDateDisplay(toDate)}
// //                     </Text>
// //                 </TouchableOpacity>
// //             </View>
// //         </View>
// //         </View>
        
// //     );

// //     // Render summary cards
// //     const renderSummaryCards = () => (
// //         <View style={styles.summaryContainer}>
// //             <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
// //                 <Icon name="arrow-right" size={24} color={theme.success} />
// //                 <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Opening Balance</Text>
// //                 <Text style={[styles.summaryValue, { color: theme.success }]}>
// //                     {formatCurrency(processedData.openingBalance)}
// //                 </Text>
// //             </View>

// //             <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
// //                 <Icon name="arrow-left" size={24} color={theme.error} />
// //                 <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Closing Balance</Text>
// //                 <Text style={[styles.summaryValue, { color: theme.error }]}>
// //                     {formatCurrency(processedData.closingBalance)}
// //                 </Text>
// //             </View>

// //             <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
// //                 <Icon name="cash" size={24} color={theme.warning} />
// //                 <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Generated</Text>
// //                 <Text style={[styles.summaryValue, { color: theme.warning }]}>
// //                     {formatCurrency(processedData.totals.debit)}
// //                 </Text>
// //             </View>

// //             <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
// //                 <Icon name="cash-check" size={24} color={theme.primary} />
// //                 <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Paid</Text>
// //                 <Text style={[styles.summaryValue, { color: theme.primary }]}>
// //                     {formatCurrency(processedData.totals.credit)}
// //                 </Text>
// //             </View>

// //             <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
// //                 <Icon name="sale" size={24} color={theme.secondary} />
// //                 <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Discount</Text>
// //                 <Text style={[styles.summaryValue, { color: theme.secondary }]}>
// //                     {formatCurrency(processedData.totals.discount)}
// //                 </Text>
// //             </View>
// //         </View>
// //     );

// //     // Render table header
// //     const renderTableHeader = () => (
// //         <View style={[styles.tableHeader, { backgroundColor: theme.primary }]}>
// //             <Text style={[styles.tableHeaderCell, styles.colDate, { color: '#FFF' }]}>Date</Text>
// //             <Text style={[styles.tableHeaderCell, styles.colVoucher, { color: '#FFF' }]}>Voucher ID</Text>
// //             <Text style={[styles.tableHeaderCell, styles.colChallan, { color: '#FFF' }]}>Challan No</Text>
// //             <Text style={[styles.tableHeaderCell, styles.colRemarks, { color: '#FFF' }]}>Remarks</Text>
// //             <Text style={[styles.tableHeaderCell, styles.colAmount, { color: '#FFF' }]}>Fee (Dr)</Text>
// //             <Text style={[styles.tableHeaderCell, styles.colAmount, { color: '#FFF' }]}>Paid (Cr)</Text>
// //             <Text style={[styles.tableHeaderCell, styles.colAmount, { color: '#FFF' }]}>Discount</Text>
// //             <Text style={[styles.tableHeaderCell, styles.colBalance, { color: '#FFF' }]}>Balance</Text>
// //         </View>
// //     );

// //     // Render transaction row
// //     const renderTransactionRow = (item, index) => (
// //         <View key={item.id} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? theme.card : theme.background }]}>
// //             <Text style={[styles.tableCell, styles.colDate, { color: theme.text }]}>{item.date || '-'}</Text>
// //             <Text style={[styles.tableCell, styles.colVoucher, { color: theme.text }]} numberOfLines={1}>{item.voucherID || '-'}</Text>
// //             <Text style={[styles.tableCell, styles.colChallan, { color: theme.text }]} numberOfLines={1}>{item.challanNo || '-'}</Text>
// //             <Text style={[styles.tableCell, styles.colRemarks, { color: theme.textSecondary }]} numberOfLines={2}>{item.remarks}</Text>
// //             <Text style={[styles.tableCell, styles.colAmount, { color: theme.success }]}>{formatCurrency(item.feeGenerate)}</Text>
// //             <Text style={[styles.tableCell, styles.colAmount, { color: theme.primary }]}>{formatCurrency(item.feePaid)}</Text>
// //             <Text style={[styles.tableCell, styles.colAmount, { color: theme.secondary }]}>{formatCurrency(item.discount)}</Text>
// //             <Text style={[styles.tableCell, styles.colBalance, { color: item.balance > 0 ? theme.error : theme.success, fontWeight: '600' }]}>
// //                 {formatCurrency(item.balance)}
// //             </Text>
// //         </View>
// //     );

// //     // Render footer totals
// //     const renderFooter = () => (
// //         <View style={[styles.tableFooter, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
// //             <View style={styles.footerRow}>
// //                 <Text style={[styles.footerLabel, { color: theme.text }]}>Total:</Text>
// //                 <Text style={[styles.footerValue, { color: theme.success }]}>{formatCurrency(processedData.totals.debit)}</Text>
// //                 <Text style={[styles.footerValue, { color: theme.primary }]}>{formatCurrency(processedData.totals.credit)}</Text>
// //                 <Text style={[styles.footerValue, { color: theme.secondary }]}>{formatCurrency(processedData.totals.discount)}</Text>
// //                 <Text style={[styles.footerValue, { color: processedData.closingBalance > 0 ? theme.error : theme.success, fontWeight: 'bold' }]}>
// //                     {formatCurrency(processedData.closingBalance)}
// //                 </Text>
// //             </View>
// //         </View>
// //     );

// //     // Loading state
// //     if (isLoading && !refreshing) {
// //         return (
// //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// //                 {renderHeader()}
// //                 <View style={styles.loadingContainer}>
// //                     <ActivityIndicator size="large" color={theme.primary} />
// //                     <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
// //                         Loading fee ledger...
// //                     </Text>
// //                 </View>
// //             </View>
// //         );
// //     }

// //     // Error state
// //     if (error) {
// //         return (
// //             <View style={[styles.container, { backgroundColor: theme.background }]}>
// //                 {renderHeader()}
// //                 <View style={styles.errorContainer}>
// //                     <Icon name="alert-circle" size={60} color={theme.error} />
// //                     <Text style={[styles.errorText, { color: theme.text }]}>Failed to load data</Text>
// //                     <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
// //                         Please check your connection and try again
// //                     </Text>
// //                     <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.primary }]} onPress={onRefresh}>
// //                         <Text style={styles.retryButtonText}>Retry</Text>
// //                     </TouchableOpacity>
// //                 </View>
// //             </View>
// //         );
// //     }

// //     return (
// //         <View style={[styles.container, { backgroundColor: theme.background }]}>
// //             {renderHeader()}
            
// //             <ScrollView
// //                 style={styles.contentContainer}
// //                 refreshControl={
// //                     <RefreshControl
// //                         refreshing={refreshing || isFetching}
// //                         onRefresh={onRefresh}
// //                         colors={[theme.primary]}
// //                         tintColor={theme.primary}
// //                     />
// //                 }
// //                 showsVerticalScrollIndicator={false}
// //             >
// //                 {renderDateRangePicker()}
// //                 {renderSummaryCards()}
                
// //                 {processedData.transactions.length > 0 ? (
// //                     <View style={styles.tableContainer}>
// //                         <ScrollView horizontal showsHorizontalScrollIndicator={true}>
// //                             <View>
// //                                 {renderTableHeader()}
// //                                 {processedData.transactions.map((item, idx) => renderTransactionRow(item, idx))}
// //                                 {renderFooter()}
// //                             </View>
// //                         </ScrollView>
// //                     </View>
// //                 ) : (
// //                     <View style={styles.emptyContainer}>
// //                         <Icon name="receipt" size={60} color={theme.textSecondary} />
// //                         <Text style={[styles.emptyTitle, { color: theme.text }]}>No Transactions Found</Text>
// //                         <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
// //                             No fee transactions found for the selected date range
// //                         </Text>
// //                     </View>
// //                 )}
// //             </ScrollView>

// //             {/* Date Pickers */}
// //             {showFromPicker && (
// //                 <DateTimePicker
// //                     value={fromDate}
// //                     mode="date"
// //                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
// //                     onChange={onFromDateChange}
// //                     maximumDate={toDate}
// //                 />
// //             )}
// //             {showToPicker && (
// //                 <DateTimePicker
// //                     value={toDate}
// //                     mode="date"
// //                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
// //                     onChange={onToDateChange}
// //                     minimumDate={fromDate}
// //                     maximumDate={new Date()}
// //                 />
// //             )}
// //         </View>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //     },
// //     contentContainer: {
// //         flex: 1,
// //     },
// //     headerSection: {
// //         paddingHorizontal: 16,
// //         paddingTop: Platform.OS === 'ios' ? 50 : 20,
// //         paddingBottom: 16,
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#e0e0e0',
// //     },
// //     headerTop: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         justifyContent: 'space-between',
// //         marginBottom: 12,
// //     },
// //     backButton: {
// //         padding: 8,
// //     },
// //     headerTitle: {
// //         fontSize: 20,
// //         fontWeight: 'bold',
// //     },
// //     shareButton: {
// //         padding: 8,
// //     },
// //     studentName: {
// //         fontSize: 16,
// //         fontWeight: '500',
// //         textAlign: 'center',
// //     },
// //     dateRangeContainer: {
// //         margin: 16,
// //         padding: 16,
// //         borderRadius: 12,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.05,
// //         shadowRadius: 4,
// //         elevation: 2,
// //     },
// //     sectionLabel: {
// //         fontSize: 14,
// //         fontWeight: '600',
// //         marginBottom: 12,
// //     },
// //     dateRangeRow: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         gap: 12,
// //     },
// //     dateButton: {
// //         flex: 1,
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingHorizontal: 12,
// //         paddingVertical: 10,
// //         borderRadius: 8,
// //         borderWidth: 1,
// //         gap: 8,
// //     },
// //     dateButtonText: {
// //         fontSize: 13,
// //     },
// //     summaryContainer: {
// //         flexDirection: 'row',
// //         flexWrap: 'wrap',
// //         paddingHorizontal: 16,
// //         gap: 12,
// //         marginBottom: 16,
// //     },
// //     summaryCard: {
// //         flex: 1,
// //         minWidth: '30%',
// //         padding: 12,
// //         borderRadius: 12,
// //         alignItems: 'center',
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.05,
// //         shadowRadius: 4,
// //         elevation: 2,
// //     },
// //     summaryLabel: {
// //         fontSize: 11,
// //         marginTop: 8,
// //         marginBottom: 4,
// //     },
// //     summaryValue: {
// //         fontSize: 14,
// //         fontWeight: 'bold',
// //     },
// //     tableContainer: {
// //         marginHorizontal: 16,
// //         marginBottom: 20,
// //         borderRadius: 12,
// //         overflow: 'hidden',
// //     },
// //     tableHeader: {
// //         flexDirection: 'row',
// //         paddingVertical: 12,
// //         paddingHorizontal: 8,
// //     },
// //     tableHeaderCell: {
// //         fontSize: 12,
// //         fontWeight: '600',
// //         textAlign: 'left',
// //     },
// //     tableRow: {
// //         flexDirection: 'row',
// //         paddingVertical: 10,
// //         paddingHorizontal: 8,
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#e0e0e0',
// //     },
// //     tableCell: {
// //         fontSize: 11,
// //         textAlign: 'left',
// //     },
// //     tableFooter: {
// //         paddingVertical: 12,
// //         paddingHorizontal: 8,
// //         borderTopWidth: 2,
// //     },
// //     footerRow: {
// //         flexDirection: 'row',
// //         justifyContent: 'flex-end',
// //         alignItems: 'center',
// //         gap: 16,
// //     },
// //     footerLabel: {
// //         fontSize: 13,
// //         fontWeight: 'bold',
// //         marginRight: 'auto',
// //     },
// //     footerValue: {
// //         fontSize: 13,
// //         fontWeight: '600',
// //         minWidth: 70,
// //         textAlign: 'right',
// //     },
// //     colDate: { width: 90 },
// //     colVoucher: { width: 100 },
// //     colChallan: { width: 90 },
// //     colRemarks: { width: 130 },
// //     colAmount: { width: 80, textAlign: 'right' },
// //     colBalance: { width: 90, textAlign: 'right' },
// //     loadingContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         padding: 40,
// //     },
// //     loadingText: {
// //         marginTop: 20,
// //         fontSize: 16,
// //     },
// //     errorContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         padding: 40,
// //     },
// //     errorText: {
// //         fontSize: 20,
// //         fontWeight: 'bold',
// //         marginTop: 20,
// //         marginBottom: 8,
// //     },
// //     errorSubtext: {
// //         fontSize: 14,
// //         textAlign: 'center',
// //         marginBottom: 24,
// //     },
// //     retryButton: {
// //         paddingHorizontal: 32,
// //         paddingVertical: 12,
// //         borderRadius: 25,
// //     },
// //     retryButtonText: {
// //         color: '#FFF',
// //         fontSize: 16,
// //         fontWeight: '600',
// //     },
// //     emptyContainer: {
// //         alignItems: 'center',
// //         padding: 60,
// //         marginHorizontal: 16,
// //     },
// //     emptyTitle: {
// //         fontSize: 18,
// //         fontWeight: 'bold',
// //         marginTop: 16,
// //         marginBottom: 8,
// //     },
// //     emptyText: {
// //         fontSize: 14,
// //         textAlign: 'center',
// //         lineHeight: 20,
// //     },
// // });

// // export default StudentFeeLedgerScreen;
// // screens/Parent/StudentFeeLedgerScreen.js

// import React, { useState, useMemo, useCallback } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     ActivityIndicator,
//     RefreshControl,
//     Dimensions,
//     Platform,
//     Share,
//     Alert,
//     SafeAreaView,
// } from 'react-native';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import LinearGradient from 'react-native-linear-gradient';

// import { useSelector } from 'react-redux';
// import { selectThemeData } from '../../store/slices/themeSlice';
// import { useGetStudentFeeLedgerQuery } from '../../store/feeApi';

// const { width } = Dimensions.get('window');

// const StudentFeeLedgerScreen = ({ route, navigation }) => {
//     const theme = useSelector(selectThemeData);

//     const {
//         studentId,
//         studentName,
//     } = route.params || {};

//     // =========================
//     // DATE RANGE
//     // =========================

//     const getDefaultFromDate = () => {
//         const d = new Date();
//         d.setMonth(d.getMonth() - 6);
//         return d;
//     };

//     const [fromDate, setFromDate] = useState(getDefaultFromDate());
//     const [toDate, setToDate] = useState(new Date());

//     const [showFromPicker, setShowFromPicker] = useState(false);
//     const [showToPicker, setShowToPicker] = useState(false);

//     const [refreshing, setRefreshing] = useState(false);

//     // =========================
//     // API
//     // =========================

//     const {
//         data: response,
//         isLoading,
//         isFetching,
//         error,
//         refetch,
//     } = useGetStudentFeeLedgerQuery(
//         {
//             studentRegistrationId: studentId,
//             fromDate: fromDate.toISOString().split('T')[0],
//             toDate: toDate.toISOString().split('T')[0],
//         },
//         {
//             skip: !studentId,
//         }
//     );

//     const ledgerData = response || [];

//     // =========================
//     // PROCESS DATA
//     // =========================

//     const processedData = useMemo(() => {

//         if (!Array.isArray(ledgerData) || ledgerData.length === 0) {
//             return {
//                 openingBalance: 0,
//                 closingBalance: 0,
//                 transactions: [],
//                 totals: {
//                     feeGenerated: 0,
//                     feePaid: 0,
//                     discount: 0,
//                 },
//             };
//         }

//         // FIRST RECORD = OPENING BALANCE
//         const firstRecord = ledgerData[0];

//         const openingBalance =
//             (parseFloat(firstRecord?.Debit) || 0)
//             -
//             (parseFloat(firstRecord?.Credit) || 0)
//             -
//             (parseFloat(firstRecord?.Discount) || 0);

//         let runningBalance = openingBalance;

//         let totalFeeGenerated = 0;
//         let totalFeePaid = 0;
//         let totalDiscount = 0;

//         const transactions = ledgerData.map((item, index) => {

//             const debit = parseFloat(item?.Debit) || 0;
//             const credit = parseFloat(item?.Credit) || 0;
//             const discount = parseFloat(item?.Discount) || 0;

//             totalFeeGenerated += debit;
//             totalFeePaid += credit;
//             totalDiscount += discount;

//             // FORMULA
//             // Balance = Debit - Credit - Discount

//             runningBalance =
//                 runningBalance
//                 +
//                 debit
//                 -
//                 credit
//                 -
//                 discount;

//             return {
//                 id: index.toString(),
//                 date: item?.Date || '-',
//                 voucherID: item?.VoucherID || '-',
//                 challanNo: item?.ChallanNo || '-',

//                 remarks: [
//                     item?.FundName,
//                     item?.FeeMonth,
//                     item?.FeeYear,
//                 ]
//                     .filter(Boolean)
//                     .join(' - '),

//                 feeGenerate: debit,
//                 feePaid: credit,
//                 discount: discount,
//                 balance: runningBalance,
//             };
//         });

//         return {
//             openingBalance,
//             closingBalance: runningBalance,

//             transactions,

//             totals: {
//                 feeGenerated: totalFeeGenerated,
//                 feePaid: totalFeePaid,
//                 discount: totalDiscount,
//             },
//         };

//     }, [ledgerData]);

//     // =========================
//     // HELPERS
//     // =========================

//     const formatCurrency = (amount) => {
//         const value = Number(amount || 0);

//         return `PKR ${value.toLocaleString()}`;
//     };

//     const formatDateDisplay = (date) => {
//         return date.toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric',
//         });
//     };

//     const onRefresh = useCallback(async () => {
//         try {
//             setRefreshing(true);
//             await refetch();
//         } finally {
//             setRefreshing(false);
//         }
//     }, [refetch]);

//     // =========================
//     // DATE PICKERS
//     // =========================

//     const onFromDateChange = (_, selectedDate) => {
//         setShowFromPicker(false);

//         if (!selectedDate) return;

//         if (selectedDate > toDate) {
//             Alert.alert('Invalid Date', 'From date cannot be greater than To date');
//             return;
//         }

//         setFromDate(selectedDate);
//     };

//     const onToDateChange = (_, selectedDate) => {
//         setShowToPicker(false);

//         if (!selectedDate) return;

//         if (selectedDate < fromDate) {
//             Alert.alert('Invalid Date', 'To date cannot be less than From date');
//             return;
//         }

//         setToDate(selectedDate);
//     };

//     // =========================
//     // SHARE
//     // =========================

//     const handleShare = async () => {
//         try {

//             let text = `Fee Ledger Report\n\n`;

//             text += `Student: ${studentName}\n`;
//             text += `Opening Balance: ${formatCurrency(processedData.openingBalance)}\n`;
//             text += `Closing Balance: ${formatCurrency(processedData.closingBalance)}\n\n`;

//             processedData.transactions.forEach((item) => {

//                 text += `Date: ${item.date}\n`;
//                 text += `Voucher: ${item.voucherID}\n`;
//                 text += `Fee: ${formatCurrency(item.feeGenerate)}\n`;
//                 text += `Paid: ${formatCurrency(item.feePaid)}\n`;
//                 text += `Discount: ${formatCurrency(item.discount)}\n`;
//                 text += `Balance: ${formatCurrency(item.balance)}\n\n`;

//             });

//             await Share.share({
//                 message: text,
//             });

//         } catch (e) {
//             console.log(e);
//         }
//     };

//     // =========================
//     // LOADING
//     // =========================

//     if (isLoading) {
//         return (
//             <View style={[styles.loaderContainer, { backgroundColor: theme.background }]}>
//                 <ActivityIndicator size="large" color={theme.primary} />
//                 <Text style={[styles.loaderText, { color: theme.text }]}>
//                     Loading Fee Ledger...
//                 </Text>
//             </View>
//         );
//     }

//     // =========================
//     // UI
//     // =========================

//     return (
//         <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>

//             {/* HEADER */}

//             <LinearGradient
//                 colors={[theme.primary, theme.primary + 'CC']}
//                 style={styles.header}
//             >

//                 <View style={styles.headerTop}>

//                     <TouchableOpacity
//                         onPress={() => navigation.goBack()}
//                         style={styles.iconBtn}
//                     >
//                         <Icon name="arrow-left" size={24} color="#FFF" />
//                     </TouchableOpacity>

//                     <Text style={styles.headerTitle}>
//                         Fee Ledger
//                     </Text>

//                     <TouchableOpacity
//                         onPress={handleShare}
//                         style={styles.iconBtn}
//                     >
//                         <Icon name="share-variant" size={22} color="#FFF" />
//                     </TouchableOpacity>

//                 </View>

//                 <View style={styles.studentRow}>
//                     <View style={styles.studentIcon}>
//                         <Icon name="account" size={24} color="#FFF" />
//                     </View>

//                     <View style={{ flex: 1 }}>
//                         <Text style={styles.studentName}>
//                             {studentName || 'Student'}
//                         </Text>

//                         <Text style={styles.studentSub}>
//                             Student Fee Ledger Statement
//                         </Text>
//                     </View>
//                 </View>

//             </LinearGradient>

//             <ScrollView
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={refreshing || isFetching}
//                         onRefresh={onRefresh}
//                         colors={[theme.primary]}
//                     />
//                 }
//                 showsVerticalScrollIndicator={false}
//             >

//                 {/* DATE FILTER */}

//                 <View style={[styles.card, { backgroundColor: theme.card }]}>

//                     <Text style={[styles.sectionTitle, { color: theme.text }]}>
//                         Select Date Range
//                     </Text>

//                     <View style={styles.dateRow}>

//                         <View style={{ flex: 1 }}>
//                             <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>
//                                 From
//                             </Text>

//                             <TouchableOpacity
//                                 style={[
//                                     styles.dateBtn,
//                                     {
//                                         backgroundColor: theme.background,
//                                         borderColor: theme.border,
//                                     }
//                                 ]}
//                                 onPress={() => setShowFromPicker(true)}
//                             >
//                                 <Icon
//                                     name="calendar"
//                                     size={18}
//                                     color={theme.primary}
//                                 />

//                                 <Text style={[styles.dateText, { color: theme.text }]}>
//                                     {formatDateDisplay(fromDate)}
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>

//                         <View style={{ width: 12 }} />

//                         <View style={{ flex: 1 }}>
//                             <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>
//                                 To
//                             </Text>

//                             <TouchableOpacity
//                                 style={[
//                                     styles.dateBtn,
//                                     {
//                                         backgroundColor: theme.background,
//                                         borderColor: theme.border,
//                                     }
//                                 ]}
//                                 onPress={() => setShowToPicker(true)}
//                             >
//                                 <Icon
//                                     name="calendar"
//                                     size={18}
//                                     color={theme.primary}
//                                 />

//                                 <Text style={[styles.dateText, { color: theme.text }]}>
//                                     {formatDateDisplay(toDate)}
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>

//                     </View>

//                 </View>

//                 {/* SUMMARY */}

//                 <View style={styles.summaryRow}>

//                     <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
//                         <Icon name="wallet" size={24} color={theme.warning} />

//                         <Text style={[styles.summaryTitle, { color: theme.textSecondary }]}>
//                             Opening
//                         </Text>

//                         <Text style={[styles.summaryValue, { color: theme.text }]}>
//                             {formatCurrency(processedData.openingBalance)}
//                         </Text>
//                     </View>

//                     <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
//                         <Icon name="cash-plus" size={24} color={theme.success} />

//                         <Text style={[styles.summaryTitle, { color: theme.textSecondary }]}>
//                             Generated
//                         </Text>

//                         <Text style={[styles.summaryValue, { color: theme.success }]}>
//                             {formatCurrency(processedData.totals.feeGenerated)}
//                         </Text>
//                     </View>

//                 </View>

//                 <View style={styles.summaryRow}>

//                     <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
//                         <Icon name="cash-check" size={24} color={theme.primary} />

//                         <Text style={[styles.summaryTitle, { color: theme.textSecondary }]}>
//                             Paid
//                         </Text>

//                         <Text style={[styles.summaryValue, { color: theme.primary }]}>
//                             {formatCurrency(processedData.totals.feePaid)}
//                         </Text>
//                     </View>

//                     <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
//                         <Icon name="sale" size={24} color={theme.error} />

//                         <Text style={[styles.summaryTitle, { color: theme.textSecondary }]}>
//                             Discount
//                         </Text>

//                         <Text style={[styles.summaryValue, { color: theme.error }]}>
//                             {formatCurrency(processedData.totals.discount)}
//                         </Text>
//                     </View>

//                 </View>

//                 {/* TABLE */}

//                 <View
//                     style={[
//                         styles.tableWrapper,
//                         {
//                             backgroundColor: theme.card,
//                         }
//                     ]}
//                 >

//                     <ScrollView horizontal>

//                         <View>

//                             {/* HEADER */}

//                             <View
//                                 style={[
//                                     styles.tableHeader,
//                                     { backgroundColor: theme.primary }
//                                 ]}
//                             >

//                                 <Text style={[styles.headerCell, styles.dateCol]}>
//                                     Date
//                                 </Text>

//                                 <Text style={[styles.headerCell, styles.voucherCol]}>
//                                     Voucher ID
//                                 </Text>

//                                 <Text style={[styles.headerCell, styles.challanCol]}>
//                                     Challan No
//                                 </Text>

//                                 <Text style={[styles.headerCell, styles.remarksCol]}>
//                                     Remarks
//                                 </Text>

//                                 <Text style={[styles.headerCell, styles.amountCol]}>
//                                     Fee Generate
//                                 </Text>

//                                 <Text style={[styles.headerCell, styles.amountCol]}>
//                                     Fee Paid
//                                 </Text>

//                                 <Text style={[styles.headerCell, styles.amountCol]}>
//                                     Discount
//                                 </Text>

//                                 <Text style={[styles.headerCell, styles.balanceCol]}>
//                                     Balance
//                                 </Text>

//                             </View>

//                             {/* OPENING BALANCE */}

//                             <View
//                                 style={[
//                                     styles.openingRow,
//                                     { backgroundColor: theme.warning + '15' }
//                                 ]}
//                             >

//                                 <Text
//                                     style={[
//                                         styles.openingText,
//                                         { color: theme.warning }
//                                     ]}
//                                 >
//                                     Opening Balance
//                                 </Text>

//                                 <Text
//                                     style={[
//                                         styles.openingValue,
//                                         { color: theme.warning }
//                                     ]}
//                                 >
//                                     {formatCurrency(processedData.openingBalance)}
//                                 </Text>

//                             </View>

//                             {/* ROWS */}

//                             {processedData.transactions.map((item, index) => {

//                                 const bg =
//                                     index % 2 === 0
//                                         ? theme.card
//                                         : theme.background;

//                                 return (
//                                     <View
//                                         key={item.id}
//                                         style={[
//                                             styles.row,
//                                             {
//                                                 backgroundColor: bg,
//                                                 borderBottomColor: theme.border,
//                                             }
//                                         ]}
//                                     >

//                                         <Text style={[styles.cell, styles.dateCol, { color: theme.text }]}>
//                                             {item.date}
//                                         </Text>

//                                         <Text style={[styles.cell, styles.voucherCol, { color: theme.text }]}>
//                                             {item.voucherID}
//                                         </Text>

//                                         <Text style={[styles.cell, styles.challanCol, { color: theme.text }]}>
//                                             {item.challanNo}
//                                         </Text>

//                                         <Text style={[styles.cell, styles.remarksCol, { color: theme.textSecondary }]}>
//                                             {item.remarks}
//                                         </Text>

//                                         <Text style={[styles.cell, styles.amountCol, { color: theme.success }]}>
//                                             {formatCurrency(item.feeGenerate)}
//                                         </Text>

//                                         <Text style={[styles.cell, styles.amountCol, { color: theme.primary }]}>
//                                             {formatCurrency(item.feePaid)}
//                                         </Text>

//                                         <Text style={[styles.cell, styles.amountCol, { color: theme.error }]}>
//                                             {formatCurrency(item.discount)}
//                                         </Text>

//                                         <Text
//                                             style={[
//                                                 styles.cell,
//                                                 styles.balanceCol,
//                                                 {
//                                                     color:
//                                                         item.balance > 0
//                                                             ? theme.error
//                                                             : theme.success,

//                                                     fontWeight: '700',
//                                                 }
//                                             ]}
//                                         >
//                                             {formatCurrency(item.balance)}
//                                         </Text>

//                                     </View>
//                                 );

//                             })}

//                             {/* TOTAL */}

//                             <View
//                                 style={[
//                                     styles.totalRow,
//                                     {
//                                         backgroundColor: theme.primary + '10',
//                                         borderTopColor: theme.primary,
//                                     }
//                                 ]}
//                             >

//                                 <Text
//                                     style={[
//                                         styles.totalText,
//                                         {
//                                             color: theme.text,
//                                         }
//                                     ]}
//                                 >
//                                     Total / Closing Balance
//                                 </Text>

//                                 <Text
//                                     style={[
//                                         styles.totalValue,
//                                         {
//                                             color:
//                                                 processedData.closingBalance > 0
//                                                     ? theme.error
//                                                     : theme.success,
//                                         }
//                                     ]}
//                                 >
//                                     {formatCurrency(processedData.closingBalance)}
//                                 </Text>

//                             </View>

//                         </View>

//                     </ScrollView>

//                 </View>

//                 {processedData.transactions.length === 0 && (
//                     <View style={styles.emptyContainer}>
//                         <Icon
//                             name="file-document-outline"
//                             size={70}
//                             color={theme.textSecondary}
//                         />

//                         <Text style={[styles.emptyTitle, { color: theme.text }]}>
//                             No Fee Ledger Found
//                         </Text>

//                         <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
//                             No transactions available in selected date range
//                         </Text>
//                     </View>
//                 )}

//                 <View style={{ height: 40 }} />

//             </ScrollView>

//             {/* DATE PICKERS */}

//             {showFromPicker && (
//                 <DateTimePicker
//                     value={fromDate}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={onFromDateChange}
//                     maximumDate={toDate}
//                 />
//             )}

//             {showToPicker && (
//                 <DateTimePicker
//                     value={toDate}
//                     mode="date"
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={onToDateChange}
//                     minimumDate={fromDate}
//                     maximumDate={new Date()}
//                 />
//             )}

//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({

//     container: {
//         flex: 1,
//     },

//     loaderContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

//     loaderText: {
//         marginTop: 12,
//         fontSize: 15,
//         fontWeight: '600',
//     },

//     header: {
//         paddingHorizontal: 16,
//         paddingTop: Platform.OS === 'ios' ? 10 : 18,
//         paddingBottom: 24,
//         borderBottomLeftRadius: 24,
//         borderBottomRightRadius: 24,
//     },

//     headerTop: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },

//     iconBtn: {
//         width: 42,
//         height: 42,
//         borderRadius: 21,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(255,255,255,0.15)',
//     },

//     headerTitle: {
//         color: '#FFF',
//         fontSize: 20,
//         fontWeight: '700',
//     },

//     studentRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 20,
//     },

//     studentIcon: {
//         width: 54,
//         height: 54,
//         borderRadius: 27,
//         backgroundColor: 'rgba(255,255,255,0.15)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 14,
//     },

//     studentName: {
//         color: '#FFF',
//         fontSize: 18,
//         fontWeight: '700',
//     },

//     studentSub: {
//         color: 'rgba(255,255,255,0.85)',
//         marginTop: 3,
//         fontSize: 13,
//     },

//     card: {
//         margin: 16,
//         marginBottom: 10,
//         padding: 16,
//         borderRadius: 18,
//         elevation: 3,
//     },

//     sectionTitle: {
//         fontSize: 15,
//         fontWeight: '700',
//         marginBottom: 14,
//     },

//     dateRow: {
//         flexDirection: 'row',
//     },

//     dateLabel: {
//         fontSize: 12,
//         marginBottom: 8,
//         fontWeight: '600',
//     },

//     dateBtn: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         paddingVertical: 12,
//         paddingHorizontal: 12,
//         borderRadius: 14,
//     },

//     dateText: {
//         marginLeft: 8,
//         fontSize: 13,
//         fontWeight: '600',
//     },

//     summaryRow: {
//         flexDirection: 'row',
//         paddingHorizontal: 16,
//         marginTop: 6,
//         justifyContent: 'space-between',
//     },

//     summaryCard: {
//         width: width * 0.44,
//         borderRadius: 18,
//         padding: 16,
//         elevation: 2,
//     },

//     summaryTitle: {
//         marginTop: 12,
//         fontSize: 12,
//     },

//     summaryValue: {
//         marginTop: 6,
//         fontSize: 16,
//         fontWeight: '700',
//     },

//     tableWrapper: {
//         margin: 16,
//         borderRadius: 18,
//         overflow: 'hidden',
//     },

//     tableHeader: {
//         flexDirection: 'row',
//         paddingVertical: 14,
//         paddingHorizontal: 8,
//     },

//     headerCell: {
//         color: '#FFF',
//         fontSize: 12,
//         fontWeight: '700',
//     },

//     row: {
//         flexDirection: 'row',
//         paddingVertical: 12,
//         paddingHorizontal: 8,
//         borderBottomWidth: 1,
//     },

//     cell: {
//         fontSize: 11,
//     },

//     openingRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingHorizontal: 14,
//         paddingVertical: 12,
//     },

//     openingText: {
//         fontSize: 13,
//         fontWeight: '700',
//     },

//     openingValue: {
//         fontSize: 14,
//         fontWeight: '800',
//     },

//     totalRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: 16,
//         paddingHorizontal: 14,
//         borderTopWidth: 2,
//     },

//     totalText: {
//         fontSize: 14,
//         fontWeight: '700',
//     },

//     totalValue: {
//         fontSize: 15,
//         fontWeight: '800',
//     },

//     dateCol: {
//         width: 100,
//     },

//     voucherCol: {
//         width: 120,
//     },

//     challanCol: {
//         width: 120,
//     },

//     remarksCol: {
//         width: 220,
//     },

//     amountCol: {
//         width: 110,
//         textAlign: 'right',
//     },

//     balanceCol: {
//         width: 120,
//         textAlign: 'right',
//     },

//     emptyContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingTop: 70,
//         paddingHorizontal: 30,
//     },

//     emptyTitle: {
//         marginTop: 20,
//         fontSize: 20,
//         fontWeight: '700',
//     },

//     emptySub: {
//         marginTop: 8,
//         textAlign: 'center',
//         lineHeight: 22,
//     },

// });

// export default StudentFeeLedgerScreen;
import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    Platform,
    
    Alert,
    SafeAreaView,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../store/slices/themeSlice';
import { useGetStudentFeeLedgerQuery } from '../../store/feeApi';

const { width } = Dimensions.get('window');

const StudentFeeLedgerScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);

    const {
        studentId,
        studentName,
    } = route.params || {};

    // =========================
    // DATE RANGE
    // =========================

    const getDefaultFromDate = () => {
        const d = new Date();
        d.setMonth(d.getMonth() - 6);
        return d;
    };
const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const [fromDate, setFromDate] = useState(getDefaultFromDate());
    const [toDate, setToDate] = useState(new Date());

    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    // =========================
    // API
    // =========================

    const {
        data: response,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetStudentFeeLedgerQuery(
        {
            studentRegistrationId: studentId,
            fromDate: fromDate.toISOString().split('T')[0],
            toDate: toDate.toISOString().split('T')[0],
        },
        {
            skip: !studentId,
        }
    );

    const ledgerData = response || [];

    // =========================
    // PROCESS DATA
    // =========================

    const processedData = useMemo(() => {

        if (!Array.isArray(ledgerData) || ledgerData.length === 0) {
            return {
                openingBalance: 0,
                closingBalance: 0,
                transactions: [],
            };
        }

        // FIRST RECORD = OPENING BALANCE
        const firstRecord = ledgerData[0];

        const openingBalance =
            (parseFloat(firstRecord?.Debit) || 0)
            -
            (parseFloat(firstRecord?.Credit) || 0)
            -
            (parseFloat(firstRecord?.Discount) || 0);

        let runningBalance = openingBalance;

        const transactions = ledgerData.map((item, index) => {

            const debit = parseFloat(item?.Debit) || 0;
            const credit = parseFloat(item?.Credit) || 0;
            const discount = parseFloat(item?.Discount) || 0;

            // Formula: Balance = Debit - Credit - Discount
            runningBalance = runningBalance + debit - credit - discount;

            return {
                id: index.toString(),
                date: item?.Date || '-',
                voucherID: item?.VoucherID || '-',
                challanNo: item?.ChallanNo || '-',

                remarks: [
                    item?.FundName,
                    item?.FeeMonth,
                    item?.FeeYear,
                ]
                    .filter(Boolean)
                    .join(' - '),

                feeGenerate: debit,
                feePaid: credit,
                discount: discount,
                balance: runningBalance,
            };
        });

        return {
            openingBalance,
            closingBalance: runningBalance,
            transactions,
        };

    }, [ledgerData]);

    // =========================
    // HELPERS
    // =========================

    const formatCurrency = (amount) => {
        const value = Number(amount || 0);
        return `PKR ${value.toLocaleString()}`;
    };

    const formatDateDisplay = (date) => {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            await refetch();
        } finally {
            setRefreshing(false);
        }
    }, [refetch]);

    // =========================
    // DATE PICKERS
    // =========================

    const onFromDateChange = (_, selectedDate) => {
        setShowFromPicker(false);

        if (!selectedDate) return;

        if (selectedDate > toDate) {
            Alert.alert('Invalid Date', 'From date cannot be greater than To date');
            return;
        }

        setFromDate(selectedDate);
    };

    const onToDateChange = (_, selectedDate) => {
        setShowToPicker(false);

        if (!selectedDate) return;

        if (selectedDate < fromDate) {
            Alert.alert('Invalid Date', 'To date cannot be less than From date');
            return;
        }

        setToDate(selectedDate);
    };

    // =========================
    // SHARE
    // =========================

   const handleShare = async () => {
    if (processedData.transactions.length === 0) {
        Alert.alert('No Data', 'No transactions available to generate PDF');
        return;
    }

    try {
        setIsGeneratingPDF(true);

        // Generate HTML for PDF with horizontal table
        const htmlContent = generatePDFHTML();
        
        const sanitizeFileName = (name) => {
            return name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
        };
        
        const fileName = sanitizeFileName(`FeeLedger_${studentName}_${formatDateDisplay(fromDate)}_to_${formatDateDisplay(toDate)}`);
        const timestamp = Date.now();
        const finalFileName = `${fileName}_${timestamp}`;
        
        const options = {
            html: htmlContent,
            fileName: finalFileName,
            directory: 'Documents',
        };
        
        const pdf = await RNHTMLtoPDF.convert(options);
        
        if (pdf && pdf.filePath) {
            const fileUrl = Platform.OS === 'android' 
                ? `file://${pdf.filePath}` 
                : pdf.filePath;
            
            const shareOptions = {
                url: fileUrl,
                type: 'application/pdf',
                title: 'Fee Ledger Report',
                message: `📊 Fee Ledger Report\n\nStudent: ${studentName}\nPeriod: ${formatDateDisplay(fromDate)} - ${formatDateDisplay(toDate)}`,
            };
            
            await Share.open(shareOptions);
        } else {
            Alert.alert('Error', 'Failed to generate PDF');
        }
    } catch (error) {
        if (error.message !== 'User did not share') {
            console.error('PDF generation error:', error);
            Alert.alert('Error', 'Failed to generate PDF: ' + error.message);
        }
    } finally {
        setIsGeneratingPDF(false);
    }
};


const generatePDFHTML = () => {
    // Generate table rows
    let tableRows = '';
    
    processedData.transactions.forEach((item, index) => {
        const rowBgColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
        
        tableRows += `
            <tr style="background-color: ${rowBgColor};">
                <td style="border: 1px solid #ddd; padding: 10px; font-size: 11px;">${item.date}</td>
                <td style="border: 1px solid #ddd; padding: 10px; font-size: 11px;">${item.voucherID}</td>
                <td style="border: 1px solid #ddd; padding: 10px; font-size: 11px;">${item.challanNo}</td>
                <td style="border: 1px solid #ddd; padding: 10px; font-size: 11px;">${item.remarks || '-'}</td>
                <td style="border: 1px solid #ddd; padding: 10px; font-size: 11px; text-align: right;">${formatCurrency(item.feeGenerate)}</td>
                <td style="border: 1px solid #ddd; padding: 10px; font-size: 11px; text-align: right;">${formatCurrency(item.feePaid)}</td>
                <td style="border: 1px solid #ddd; padding: 10px; font-size: 11px; text-align: right;">${formatCurrency(item.discount)}</td>
                <td style="border: 1px solid #ddd; padding: 10px; font-size: 12px; text-align: right; font-weight: bold; color: ${item.balance > 0 ? '#dc3545' : '#28a745'};">${formatCurrency(item.balance)}</td>
            </tr>
        `;
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Fee Ledger Report - ${studentName}</title>
            <style>
                @page {
                    size: A4 landscape;
                    margin: 10mm;
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: Arial, Helvetica, sans-serif;
                    background: #fff;
                    padding: 20px;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 3px solid #3498db;
                }
                
                .title {
                    font-size: 24px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 10px;
                }
                
                .subtitle {
                    font-size: 14px;
                    color: #7f8c8d;
                    margin-bottom: 5px;
                }
                
                .student-info {
                    background: linear-gradient(135deg, #3498db, #2c3e50);
                    color: white;
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 25px;
                }
                
                .student-name {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                
                .student-details {
                    font-size: 13px;
                    opacity: 0.9;
                }
                
                .summary-cards {
                    display: flex;
                    justify-content: space-between;
                    gap: 15px;
                    margin-bottom: 25px;
                }
                
                .summary-card {
                    flex: 1;
                    background: #f8f9fa;
                    border-radius: 10px;
                    padding: 15px;
                    text-align: center;
                    border: 1px solid #e0e0e0;
                }
                
                .summary-label {
                    font-size: 12px;
                    color: #7f8c8d;
                    margin-bottom: 8px;
                }
                
                .summary-value {
                    font-size: 18px;
                    font-weight: bold;
                }
                
                .summary-value.opening { color: #f39c12; }
                .summary-value.closing { color: #e74c3c; }
                
                .table-container {
                    overflow-x: auto;
                    margin-top: 20px;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                }
                
                th {
                    background: #2c3e50;
                    color: white;
                    padding: 12px 8px;
                    font-weight: bold;
                    text-align: center;
                    border: 1px solid #34495e;
                    white-space: nowrap;
                }
                
                td {
                    border: 1px solid #ddd;
                    padding: 10px 8px;
                }
                
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 10px;
                    color: #95a5a6;
                    border-top: 1px solid #e0e0e0;
                    padding-top: 15px;
                }
                
                .text-right {
                    text-align: right;
                }
                
                .font-bold {
                    font-weight: bold;
                }
                
                .text-success {
                    color: #28a745;
                }
                
                .text-danger {
                    color: #dc3545;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">📊 FEE LEDGER REPORT</div>
                <div class="subtitle">Student Fee Statement</div>
            </div>
            
            <div class="student-info">
                <div class="student-name">${studentName || 'Student'}</div>
                <div class="student-details">
                    Period: ${formatDateDisplay(fromDate)} - ${formatDateDisplay(toDate)}
                </div>
            </div>
            
            <div class="summary-cards">
                <div class="summary-card">
                    <div class="summary-label">💰 Opening Balance</div>
                    <div class="summary-value opening">${formatCurrency(processedData.openingBalance)}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">🔚 Closing Balance</div>
                    <div class="summary-value closing">${formatCurrency(processedData.closingBalance)}</div>
                </div>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Voucher ID</th>
                            <th>Challan No</th>
                            <th>Remarks</th>
                            <th>Fee Generated (Dr)</th>
                            <th>Fee Paid (Cr)</th>
                            <th>Discount</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
            
            <div class="footer">
                Generated on ${new Date().toLocaleString()} | School Management System
            </div>
        </body>
        </html>
    `;
};
    // =========================
    // LOADING
    // =========================

    if (isLoading) {
        return (
            <View style={[styles.loaderContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loaderText, { color: theme.text }]}>
                    Loading Fee Ledger...
                </Text>
            </View>
        );
    }

    // =========================
    // UI
    // =========================

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>

            {/* HEADER */}

            <LinearGradient
                colors={[theme.primary, theme.primary + 'CC']}
                style={styles.header}
            >

                <View style={styles.studentRow}>
                    <View style={styles.studentIcon}>
                        <Icon name="account" size={24} color="#FFF" />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.studentName}>
                            {studentName || 'Student'}
                        </Text>

                        <Text style={styles.studentSub}>
                            Student Fee Ledger Statement
                        </Text>
                    </View>
                       <TouchableOpacity
                        onPress={handleShare}
                        style={styles.iconBtn}
                    >
                        <Icon name="share-variant" size={22} color="#FFF" />
                    </TouchableOpacity>
                </View>

            </LinearGradient>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetching}
                        onRefresh={onRefresh}
                        colors={[theme.primary]}
                    />
                }
                showsVerticalScrollIndicator={false}
            >

                {/* DATE FILTER */}

                {/* <View style={[styles.card, { backgroundColor: theme.card }]}>

                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Select Date Range
                    </Text>

                    <View style={styles.dateRow}>

                        <View style={{ flex: 1 }}>
                            <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>
                                From
                            </Text>

                            <TouchableOpacity
                                style={[
                                    styles.dateBtn,
                                    {
                                        backgroundColor: theme.background,
                                        borderColor: theme.border,
                                    }
                                ]}
                                onPress={() => setShowFromPicker(true)}
                            >
                                <Icon
                                    name="calendar"
                                    size={18}
                                    color={theme.primary}
                                />

                                <Text style={[styles.dateText, { color: theme.text }]}>
                                    {formatDateDisplay(fromDate)}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: 12 }} />

                        <View style={{ flex: 1 }}>
                            <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>
                                To
                            </Text>

                            <TouchableOpacity
                                style={[
                                    styles.dateBtn,
                                    {
                                        backgroundColor: theme.background,
                                        borderColor: theme.border,
                                    }
                                ]}
                                onPress={() => setShowToPicker(true)}
                            >
                                <Icon
                                    name="calendar"
                                    size={18}
                                    color={theme.primary}
                                />

                                <Text style={[styles.dateText, { color: theme.text }]}>
                                    {formatDateDisplay(toDate)}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View> */}

                {/* BALANCE CARDS - Only Opening and Closing */}

                <View style={styles.balanceCardsRow}>

                   

                    <View style={[styles.balanceCard, { backgroundColor: theme.card }]}>
                        <View style={[styles.balanceIconContainer, { backgroundColor: theme.error + '20' }]}>
                            <Icon name="arrow-left" size={28} color={theme.error} />
                        </View>
                        <Text style={[styles.balanceTitle, { color: theme.textSecondary }]}>
                            Dues  
                        </Text>
                        <Text style={[styles.balanceValue, { color: processedData.closingBalance > 0 ? theme.error : theme.success }]}>
                            {formatCurrency(processedData.closingBalance)}
                        </Text>
                    </View>

                </View>

                {/* TABLE - Vertical layout (Column Name | Value) */}

                <View style={[styles.tableWrapper, { backgroundColor: theme.card }]}>

                    <Text style={[styles.tableSectionTitle, { color: theme.text }]}>
                        Transaction Details
                    </Text>

                    {processedData.transactions.map((item, index) => (
                        <View key={item.id} style={[styles.transactionCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
                            
                            <Text style={[styles.transactionHeader, { color: theme.primary, backgroundColor: theme.primary + '10' }]}>
                                Transaction #{index + 1}
                            </Text>

                            <View style={styles.transactionRow}>
                                <Text style={[styles.transactionLabel, { color: theme.textSecondary }]}>Date</Text>
                                <Text style={[styles.transactionValue, { color: theme.text }]}>{item.date}</Text>
                            </View>

                            <View style={styles.transactionRow}>
                                <Text style={[styles.transactionLabel, { color: theme.textSecondary }]}>Voucher ID</Text>
                                <Text style={[styles.transactionValue, { color: theme.text }]}>{item.voucherID}</Text>
                            </View>

                            <View style={styles.transactionRow}>
                                <Text style={[styles.transactionLabel, { color: theme.textSecondary }]}>Challan No</Text>
                                <Text style={[styles.transactionValue, { color: theme.text }]}>{item.challanNo}</Text>
                            </View>

                            <View style={styles.transactionRow}>
                                <Text style={[styles.transactionLabel, { color: theme.textSecondary }]}>Remarks</Text>
                                <Text style={[styles.transactionValue, { color: theme.textSecondary }]}>{item.remarks || '-'}</Text>
                            </View>

                            <View style={styles.transactionRow}>
                                <Text style={[styles.transactionLabel, { color: theme.textSecondary }]}>Fee Generated (Dr)</Text>
                                <Text style={[styles.transactionValue, { color: theme.success, fontWeight: '600' }]}>{formatCurrency(item.feeGenerate)}</Text>
                            </View>

                            <View style={styles.transactionRow}>
                                <Text style={[styles.transactionLabel, { color: theme.textSecondary }]}>Fee Paid (Cr)</Text>
                                <Text style={[styles.transactionValue, { color: theme.primary, fontWeight: '600' }]}>{formatCurrency(item.feePaid)}</Text>
                            </View>

                            <View style={styles.transactionRow}>
                                <Text style={[styles.transactionLabel, { color: theme.textSecondary }]}>Discount</Text>
                                <Text style={[styles.transactionValue, { color: theme.error, fontWeight: '600' }]}>{formatCurrency(item.discount)}</Text>
                            </View>

                            <View style={[styles.transactionRow, styles.transactionRowLast]}>
                                <Text style={[styles.transactionLabel, { color: theme.textSecondary, fontWeight: '700' }]}>Balance</Text>
                                <Text style={[styles.transactionValue, { color: item.balance > 0 ? theme.error : theme.success, fontWeight: '700', fontSize: 15 }]}>
                                    {formatCurrency(item.balance)}
                                </Text>
                            </View>

                        </View>
                    ))}

                    {/* Closing Balance Summary */}
                    {processedData.transactions.length > 0 && (
                        <View style={[styles.closingSummary, { backgroundColor: theme.primary + '10' }]}>
                            <Text style={[styles.closingSummaryLabel, { color: theme.text }]}>Closing Balance</Text>
                            <Text style={[styles.closingSummaryValue, { color: processedData.closingBalance > 0 ? theme.error : theme.success }]}>
                                {formatCurrency(processedData.closingBalance)}
                            </Text>
                        </View>
                    )}

                </View>

                {processedData.transactions.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Icon
                            name="file-document-outline"
                            size={70}
                            color={theme.textSecondary}
                        />

                        <Text style={[styles.emptyTitle, { color: theme.text }]}>
                            No Fee Ledger Found
                        </Text>

                        <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                            No transactions available in selected date range
                        </Text>
                    </View>
                )}

                <View style={{ height: 40 }} />

            </ScrollView>

            {/* DATE PICKERS */}

            {showFromPicker && (
                <DateTimePicker
                    value={fromDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onFromDateChange}
                    maximumDate={toDate}
                />
            )}

            {showToPicker && (
                <DateTimePicker
                    value={toDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onToDateChange}
                    minimumDate={fromDate}
                    maximumDate={new Date()}
                />
            )}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loaderText: {
        marginTop: 12,
        fontSize: 15,
        fontWeight: '600',
    },

    header: {
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 10 : 18,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },

    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    iconBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
    },

    headerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },

    studentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },

    studentIcon: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    studentName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },

    studentSub: {
        color: 'rgba(255,255,255,0.85)',
        marginTop: 3,
        fontSize: 13,
    },

    card: {
        margin: 16,
        marginBottom: 10,
        padding: 16,
        borderRadius: 18,
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 14,
    },

    dateRow: {
        flexDirection: 'row',
    },

    dateLabel: {
        fontSize: 12,
        marginBottom: 8,
        fontWeight: '600',
    },

    dateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 14,
    },

    dateText: {
        marginLeft: 8,
        fontSize: 13,
        fontWeight: '600',
    },

    balanceCardsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginTop: 10,
        marginBottom: 16,
        justifyContent: 'space-between',
        gap: 12,
    },

    balanceCard: {
        flex: 1,
        borderRadius: 18,
        padding: 16,
        alignItems: 'center',
        elevation: 2,
    },

    balanceIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

    balanceTitle: {
        fontSize: 12,
        marginBottom: 6,
    },

    balanceValue: {
        fontSize: 18,
        fontWeight: '700',
    },

    tableWrapper: {
        margin: 16,
        borderRadius: 18,
        overflow: 'hidden',
        padding: 16,
    },

    tableSectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },

    transactionCard: {
        borderRadius: 14,
        marginBottom: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },

    transactionHeader: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },

    transactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e0e0e0',
    },

    transactionRowLast: {
        borderBottomWidth: 0,
        marginBottom: 4,
    },

    transactionLabel: {
        fontSize: 12,
        fontWeight: '500',
    },

    transactionValue: {
        fontSize: 13,
        flex: 1,
        textAlign: 'right',
    },

    closingSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginTop: 8,
    },

    closingSummaryLabel: {
        fontSize: 14,
        fontWeight: '700',
    },

    closingSummaryValue: {
        fontSize: 16,
        fontWeight: '800',
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 70,
        paddingHorizontal: 30,
    },

    emptyTitle: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: '700',
    },

    emptySub: {
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 22,
    },

});

export default StudentFeeLedgerScreen;