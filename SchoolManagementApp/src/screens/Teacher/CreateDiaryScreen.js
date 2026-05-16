// // // // // // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // // // // // import {
// // // // // // // // // // //     View,
// // // // // // // // // // //     Text,
// // // // // // // // // // //     StyleSheet,
// // // // // // // // // // //     ScrollView,
// // // // // // // // // // //     TouchableOpacity,
// // // // // // // // // // //     ActivityIndicator,
// // // // // // // // // // //     Alert,
// // // // // // // // // // //     Modal,
// // // // // // // // // // //     FlatList,
// // // // // // // // // // //     Platform,
// // // // // // // // // // //     KeyboardAvoidingView,
// // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // import { useSelector } from 'react-redux';
// // // // // // // // // // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // // // // // // // // // import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// // // // // // // // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // // // // // // // import { selectCurrentUser } from '../../store/slices/authSlice';
// // // // // // // // // // // import {
// // // // // // // // // // //     useGetTeacherClassesQuery,
// // // // // // // // // // //     useGetSubjectsByClassQuery,
// // // // // // // // // // //     useCreateBatchDiaryMutation,
// // // // // // // // // // // } from '../../store/diaryApi';

// // // // // // // // // // // const CreateDiaryScreen = ({ navigation, route }) => {
// // // // // // // // // // //     const theme = useSelector(selectThemeData);
// // // // // // // // // // //     const user = useSelector(selectCurrentUser);
// // // // // // // // // // //     const richTextRef = useRef(null);
    
// // // // // // // // // // //     const editEntry = route.params?.editEntry;

// // // // // // // // // // //     const [formData, setFormData] = useState({
// // // // // // // // // // //         classId: null,
// // // // // // // // // // //         className: '',
// // // // // // // // // // //         sectionIds: [],
// // // // // // // // // // //         sectionNames: [],
// // // // // // // // // // //         subjectId: null,
// // // // // // // // // // //         subjectName: '',
// // // // // // // // // // //         content: editEntry?.content || '',
// // // // // // // // // // //     });
    
// // // // // // // // // // //     const [showClassModal, setShowClassModal] = useState(false);
// // // // // // // // // // //     const [showSectionModal, setShowSectionModal] = useState(false);
// // // // // // // // // // //     const [showSubjectModal, setShowSubjectModal] = useState(false);
// // // // // // // // // // //     const [isSaving, setIsSaving] = useState(false);
// // // // // // // // // // //     const [isPublished, setIsPublished] = useState(editEntry?.isPublished || false);

// // // // // // // // // // //     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
// // // // // // // // // // //     const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsByClassQuery(
// // // // // // // // // // //         { classId: formData.classId, sectionId: formData.sectionIds[0] },
// // // // // // // // // // //         { skip: !formData.classId }
// // // // // // // // // // //     );
// // // // // // // // // // //     const [createBatchDiary] = useCreateBatchDiaryMutation();

// // // // // // // // // // //     const classes = classesData?.data || [];
// // // // // // // // // // //     const subjects = subjectsData?.data || [];
// // // // // // // // // // //     const selectedClass = classes.find(c => c.classId === formData.classId);
// // // // // // // // // // //     const sections = selectedClass?.sections || [];

// // // // // // // // // // //     const handleSave = async (publish = false) => {
// // // // // // // // // // //         if (!formData.classId) {
// // // // // // // // // // //             Alert.alert('Error', 'Please select a class');
// // // // // // // // // // //             return;
// // // // // // // // // // //         }
// // // // // // // // // // //         if (formData.sectionIds.length === 0) {
// // // // // // // // // // //             Alert.alert('Error', 'Please select at least one section');
// // // // // // // // // // //             return;
// // // // // // // // // // //         }
// // // // // // // // // // //         if (!formData.subjectId) {
// // // // // // // // // // //             Alert.alert('Error', 'Please select a subject');
// // // // // // // // // // //             return;
// // // // // // // // // // //         }
// // // // // // // // // // //         if (!formData.content || formData.content === '<p><br></p>') {
// // // // // // // // // // //             Alert.alert('Error', 'Please write some content');
// // // // // // // // // // //             return;
// // // // // // // // // // //         }

// // // // // // // // // // //         setIsSaving(true);
// // // // // // // // // // //         try {
// // // // // // // // // // //             const diaryData = {
// // // // // // // // // // //                 Date: new Date().toISOString().split('T')[0],
// // // // // // // // // // //                 ClassID: formData.classId,
// // // // // // // // // // //                 SectionIds: formData.sectionIds,
// // // // // // // // // // //                 SubjectID: formData.subjectId,
// // // // // // // // // // //                 ClassWork: null,
// // // // // // // // // // //                 HomeWork: formData.content,
// // // // // // // // // // //                 CreatedBy: user?.id || 1,
// // // // // // // // // // //                 isPublished: publish,
// // // // // // // // // // //             };

// // // // // // // // // // //             await createBatchDiary(diaryData).unwrap();
// // // // // // // // // // //             Alert.alert('Success', `Diary ${publish ? 'published' : 'saved as draft'} successfully!`, [
// // // // // // // // // // //                 { text: 'OK', onPress: () => navigation.goBack() }
// // // // // // // // // // //             ]);
// // // // // // // // // // //         } catch (error) {
// // // // // // // // // // //             console.error('Save error:', error);
// // // // // // // // // // //             Alert.alert('Error', error.data?.message || 'Failed to save diary');
// // // // // // // // // // //         } finally {
// // // // // // // // // // //             setIsSaving(false);
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     const handleBack = () => {
// // // // // // // // // // //         if (formData.content && formData.content !== '<p><br></p>') {
// // // // // // // // // // //             Alert.alert(
// // // // // // // // // // //                 'Discard Changes',
// // // // // // // // // // //                 'You have unsaved changes. Are you sure you want to leave?',
// // // // // // // // // // //                 [
// // // // // // // // // // //                     { text: 'Stay', style: 'cancel' },
// // // // // // // // // // //                     { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
// // // // // // // // // // //                 ]
// // // // // // // // // // //             );
// // // // // // // // // // //         } else {
// // // // // // // // // // //             navigation.goBack();
// // // // // // // // // // //         }
// // // // // // // // // // //     };

// // // // // // // // // // //     const renderClassModal = () => (
// // // // // // // // // // //         <Modal visible={showClassModal} transparent animationType="slide" onRequestClose={() => setShowClassModal(false)}>
// // // // // // // // // // //             <View style={styles.modalOverlay}>
// // // // // // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // // // // // //                     <View style={styles.modalHeader}>
// // // // // // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Class</Text>
// // // // // // // // // // //                         <TouchableOpacity onPress={() => setShowClassModal(false)}>
// // // // // // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // // // // // //                         </TouchableOpacity>
// // // // // // // // // // //                     </View>
// // // // // // // // // // //                     <FlatList
// // // // // // // // // // //                         data={classes}
// // // // // // // // // // //                         keyExtractor={(item) => item.classId.toString()}
// // // // // // // // // // //                         renderItem={({ item }) => (
// // // // // // // // // // //                             <TouchableOpacity
// // // // // // // // // // //                                 style={[
// // // // // // // // // // //                                     styles.modalItem,
// // // // // // // // // // //                                     formData.classId === item.classId && { backgroundColor: theme.primary + '20' }
// // // // // // // // // // //                                 ]}
// // // // // // // // // // //                                 onPress={() => {
// // // // // // // // // // //                                     setFormData({
// // // // // // // // // // //                                         ...formData,
// // // // // // // // // // //                                         classId: item.classId,
// // // // // // // // // // //                                         className: item.className,
// // // // // // // // // // //                                         sectionIds: [],
// // // // // // // // // // //                                         sectionNames: [],
// // // // // // // // // // //                                         subjectId: null,
// // // // // // // // // // //                                         subjectName: '',
// // // // // // // // // // //                                     });
// // // // // // // // // // //                                     setShowClassModal(false);
// // // // // // // // // // //                                 }}
// // // // // // // // // // //                             >
// // // // // // // // // // //                                 <Icon name="school" size={20} color={theme.primary} />
// // // // // // // // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // // // // // // // //                                     {item.className}
// // // // // // // // // // //                                 </Text>
// // // // // // // // // // //                                 {formData.classId === item.classId && (
// // // // // // // // // // //                                     <Icon name="check" size={20} color={theme.primary} />
// // // // // // // // // // //                                 )}
// // // // // // // // // // //                             </TouchableOpacity>
// // // // // // // // // // //                         )}
// // // // // // // // // // //                     />
// // // // // // // // // // //                 </View>
// // // // // // // // // // //             </View>
// // // // // // // // // // //         </Modal>
// // // // // // // // // // //     );

// // // // // // // // // // //     const renderSectionModal = () => (
// // // // // // // // // // //         <Modal visible={showSectionModal} transparent animationType="slide" onRequestClose={() => setShowSectionModal(false)}>
// // // // // // // // // // //             <View style={styles.modalOverlay}>
// // // // // // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // // // // // //                     <View style={styles.modalHeader}>
// // // // // // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Sections</Text>
// // // // // // // // // // //                         <TouchableOpacity onPress={() => setShowSectionModal(false)}>
// // // // // // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // // // // // //                         </TouchableOpacity>
// // // // // // // // // // //                     </View>
// // // // // // // // // // //                     <FlatList
// // // // // // // // // // //                         data={sections}
// // // // // // // // // // //                         keyExtractor={(item) => item.sectionId.toString()}
// // // // // // // // // // //                         renderItem={({ item }) => {
// // // // // // // // // // //                             const isSelected = formData.sectionIds.includes(item.sectionId);
// // // // // // // // // // //                             return (
// // // // // // // // // // //                                 <TouchableOpacity
// // // // // // // // // // //                                     style={[styles.modalItem, isSelected && { backgroundColor: theme.primary + '10' }]}
// // // // // // // // // // //                                     onPress={() => {
// // // // // // // // // // //                                         if (isSelected) {
// // // // // // // // // // //                                             setFormData({
// // // // // // // // // // //                                                 ...formData,
// // // // // // // // // // //                                                 sectionIds: formData.sectionIds.filter(id => id !== item.sectionId),
// // // // // // // // // // //                                                 sectionNames: formData.sectionNames.filter(name => name !== item.sectionName),
// // // // // // // // // // //                                             });
// // // // // // // // // // //                                         } else {
// // // // // // // // // // //                                             setFormData({
// // // // // // // // // // //                                                 ...formData,
// // // // // // // // // // //                                                 sectionIds: [...formData.sectionIds, item.sectionId],
// // // // // // // // // // //                                                 sectionNames: [...formData.sectionNames, item.sectionName],
// // // // // // // // // // //                                             });
// // // // // // // // // // //                                         }
// // // // // // // // // // //                                     }}
// // // // // // // // // // //                                 >
// // // // // // // // // // //                                     <Icon 
// // // // // // // // // // //                                         name={isSelected ? "check-box" : "check-box-outline-blank"} 
// // // // // // // // // // //                                         size={22} 
// // // // // // // // // // //                                         color={isSelected ? theme.primary : theme.textSecondary} 
// // // // // // // // // // //                                     />
// // // // // // // // // // //                                     <Text style={[styles.modalItemText, { color: theme.text, marginLeft: 12 }]}>
// // // // // // // // // // //                                         Section {item.sectionName}
// // // // // // // // // // //                                     </Text>
// // // // // // // // // // //                                 </TouchableOpacity>
// // // // // // // // // // //                             );
// // // // // // // // // // //                         }}
// // // // // // // // // // //                     />
// // // // // // // // // // //                     <View style={styles.modalFooter}>
// // // // // // // // // // //                         <TouchableOpacity
// // // // // // // // // // //                             style={[styles.confirmButton, { backgroundColor: theme.primary }]}
// // // // // // // // // // //                             onPress={() => setShowSectionModal(false)}
// // // // // // // // // // //                         >
// // // // // // // // // // //                             <Text style={styles.confirmButtonText}>Confirm ({formData.sectionIds.length} selected)</Text>
// // // // // // // // // // //                         </TouchableOpacity>
// // // // // // // // // // //                     </View>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //             </View>
// // // // // // // // // // //         </Modal>
// // // // // // // // // // //     );

// // // // // // // // // // //     const renderSubjectModal = () => (
// // // // // // // // // // //         <Modal visible={showSubjectModal} transparent animationType="slide" onRequestClose={() => setShowSubjectModal(false)}>
// // // // // // // // // // //             <View style={styles.modalOverlay}>
// // // // // // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // // // // // //                     <View style={styles.modalHeader}>
// // // // // // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Subject</Text>
// // // // // // // // // // //                         <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
// // // // // // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // // // // // //                         </TouchableOpacity>
// // // // // // // // // // //                     </View>
// // // // // // // // // // //                     <FlatList
// // // // // // // // // // //                         data={subjects}
// // // // // // // // // // //                         keyExtractor={(item) => item.subjectId.toString()}
// // // // // // // // // // //                         renderItem={({ item }) => (
// // // // // // // // // // //                             <TouchableOpacity
// // // // // // // // // // //                                 style={[
// // // // // // // // // // //                                     styles.modalItem,
// // // // // // // // // // //                                     formData.subjectId === item.subjectId && { backgroundColor: theme.primary + '20' }
// // // // // // // // // // //                                 ]}
// // // // // // // // // // //                                 onPress={() => {
// // // // // // // // // // //                                     setFormData({
// // // // // // // // // // //                                         ...formData,
// // // // // // // // // // //                                         subjectId: item.subjectId,
// // // // // // // // // // //                                         subjectName: item.subjectName,
// // // // // // // // // // //                                     });
// // // // // // // // // // //                                     setShowSubjectModal(false);
// // // // // // // // // // //                                 }}
// // // // // // // // // // //                             >
// // // // // // // // // // //                                 <View style={[styles.subjectDot, { backgroundColor: item.colorCode || theme.primary }]} />
// // // // // // // // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // // // // // // // //                                     {item.subjectName}
// // // // // // // // // // //                                 </Text>
// // // // // // // // // // //                                 {formData.subjectId === item.subjectId && (
// // // // // // // // // // //                                     <Icon name="check" size={20} color={theme.primary} />
// // // // // // // // // // //                                 )}
// // // // // // // // // // //                             </TouchableOpacity>
// // // // // // // // // // //                         )}
// // // // // // // // // // //                     />
// // // // // // // // // // //                 </View>
// // // // // // // // // // //             </View>
// // // // // // // // // // //         </Modal>
// // // // // // // // // // //     );

// // // // // // // // // // //     if (classesLoading) {
// // // // // // // // // // //         return (
// // // // // // // // // // //             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
// // // // // // // // // // //                 <ActivityIndicator size="large" color={theme.primary} />
// // // // // // // // // // //             </View>
// // // // // // // // // // //         );
// // // // // // // // // // //     }

// // // // // // // // // // //     return (
// // // // // // // // // // //         <KeyboardAvoidingView 
// // // // // // // // // // //             style={[styles.container, { backgroundColor: theme.background }]}
// // // // // // // // // // //             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // // // // // // // // // //             keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
// // // // // // // // // // //         >
// // // // // // // // // // //             {/* Header */}
// // // // // // // // // // //             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // // // // // // // //                 <TouchableOpacity onPress={handleBack}>
// // // // // // // // // // //                     <Icon name="arrow-back" size={24} color={theme.text} />
// // // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // // //                 <Text style={[styles.headerTitle, { color: theme.text }]}>
// // // // // // // // // // //                     {editEntry ? 'Edit Diary' : 'Create New Diary'}
// // // // // // // // // // //                 </Text>
// // // // // // // // // // //                 <View style={{ width: 40 }} />
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
// // // // // // // // // // //                 {/* Class Selection */}
// // // // // // // // // // //                 <View style={[styles.formGroup, { backgroundColor: theme.card }]}>
// // // // // // // // // // //                     <Text style={[styles.label, { color: theme.text }]}>Class *</Text>
// // // // // // // // // // //                     <TouchableOpacity
// // // // // // // // // // //                         style={[styles.selector, { backgroundColor: theme.background, borderColor: theme.border }]}
// // // // // // // // // // //                         onPress={() => setShowClassModal(true)}
// // // // // // // // // // //                     >
// // // // // // // // // // //                         <Text style={[styles.selectorText, { color: formData.classId ? theme.text : theme.textSecondary }]}>
// // // // // // // // // // //                             {formData.className || 'Select Class'}
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                         <Icon name="arrow-drop-down" size={24} color={theme.textSecondary} />
// // // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // // //                 </View>

// // // // // // // // // // //                 {/* Sections Selection */}
// // // // // // // // // // //                 <View style={[styles.formGroup, { backgroundColor: theme.card }]}>
// // // // // // // // // // //                     <Text style={[styles.label, { color: theme.text }]}>Sections *</Text>
// // // // // // // // // // //                     <TouchableOpacity
// // // // // // // // // // //                         style={[styles.selector, { backgroundColor: theme.background, borderColor: theme.border }]}
// // // // // // // // // // //                         onPress={() => formData.classId ? setShowSectionModal(true) : Alert.alert('Info', 'Please select class first')}
// // // // // // // // // // //                     >
// // // // // // // // // // //                         <Text style={[styles.selectorText, { color: formData.sectionIds.length ? theme.text : theme.textSecondary }]}>
// // // // // // // // // // //                             {formData.sectionIds.length ? `${formData.sectionNames.join(', ')}` : 'Select Sections'}
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                         <Icon name="arrow-drop-down" size={24} color={theme.textSecondary} />
// // // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // // //                     {formData.sectionIds.length > 0 && (
// // // // // // // // // // //                         <View style={styles.selectedTags}>
// // // // // // // // // // //                             {formData.sectionNames.map((name, index) => (
// // // // // // // // // // //                                 <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '20' }]}>
// // // // // // // // // // //                                     <Text style={[styles.tagText, { color: theme.primary }]}>Section {name}</Text>
// // // // // // // // // // //                                 </View>
// // // // // // // // // // //                             ))}
// // // // // // // // // // //                         </View>
// // // // // // // // // // //                     )}
// // // // // // // // // // //                 </View>

// // // // // // // // // // //                 {/* Subject Selection */}
// // // // // // // // // // //                 <View style={[styles.formGroup, { backgroundColor: theme.card }]}>
// // // // // // // // // // //                     <Text style={[styles.label, { color: theme.text }]}>Subject *</Text>
// // // // // // // // // // //                     <TouchableOpacity
// // // // // // // // // // //                         style={[styles.selector, { backgroundColor: theme.background, borderColor: theme.border }]}
// // // // // // // // // // //                         onPress={() => formData.sectionIds.length ? setShowSubjectModal(true) : Alert.alert('Info', 'Please select sections first')}
// // // // // // // // // // //                     >
// // // // // // // // // // //                         <Text style={[styles.selectorText, { color: formData.subjectId ? theme.text : theme.textSecondary }]}>
// // // // // // // // // // //                             {formData.subjectName || 'Select Subject'}
// // // // // // // // // // //                         </Text>
// // // // // // // // // // //                         <Icon name="arrow-drop-down" size={24} color={theme.textSecondary} />
// // // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // // //                 </View>

// // // // // // // // // // //                 {/* Rich Text Editor */}
// // // // // // // // // // //                 <View style={[styles.editorContainer, { backgroundColor: theme.card }]}>
// // // // // // // // // // //                     <Text style={[styles.label, { color: theme.text }]}>Diary Content *</Text>
// // // // // // // // // // //                     <View style={[styles.editorWrapper, { borderColor: theme.border }]}>
// // // // // // // // // // //                         <RichToolbar
// // // // // // // // // // //     editor={richTextRef}
// // // // // // // // // // //     actions={[
// // // // // // // // // // //         actions.setBold,
// // // // // // // // // // //         actions.setItalic,
// // // // // // // // // // //         actions.setUnderline,
// // // // // // // // // // //         actions.insertBulletsList,
// // // // // // // // // // //         actions.insertOrderedList,
// // // // // // // // // // //         actions.setAlignLeft,
// // // // // // // // // // //         actions.setAlignCenter,
// // // // // // // // // // //         actions.setAlignRight,
// // // // // // // // // // //         actions.undo,
// // // // // // // // // // //         actions.redo,
// // // // // // // // // // //     ]}
// // // // // // // // // // //     iconMap={{
// // // // // // // // // // //         [actions.setBold]: ({ tintColor }) => (
// // // // // // // // // // //             <Icon name="format-bold" size={22} color={tintColor} />
// // // // // // // // // // //         ),
// // // // // // // // // // //         [actions.setItalic]: ({ tintColor }) => (
// // // // // // // // // // //             <Icon name="format-italic" size={22} color={tintColor} />
// // // // // // // // // // //         ),
// // // // // // // // // // //         [actions.setUnderline]: ({ tintColor }) => (
// // // // // // // // // // //             <Icon name="format-underlined" size={22} color={tintColor} />
// // // // // // // // // // //         ),
// // // // // // // // // // //         [actions.insertBulletsList]: ({ tintColor }) => (
// // // // // // // // // // //             <Icon name="format-list-bulleted" size={22} color={tintColor} />
// // // // // // // // // // //         ),
// // // // // // // // // // //         [actions.insertOrderedList]: ({ tintColor }) => (
// // // // // // // // // // //             <Icon name="format-list-numbered" size={22} color={tintColor} />
// // // // // // // // // // //         ),
// // // // // // // // // // //         [actions.setAlignLeft]: ({ tintColor }) => (
// // // // // // // // // // //             <Icon name="format-align-left" size={22} color={tintColor} />
// // // // // // // // // // //         ),
// // // // // // // // // // //         [actions.setAlignCenter]: ({ tintColor }) => (
// // // // // // // // // // //             <Icon name="format-align-center" size={22} color={tintColor} />
// // // // // // // // // // //         ),
// // // // // // // // // // //         [actions.setAlignRight]: ({ tintColor }) => (
// // // // // // // // // // //             <Icon name="format-align-right" size={22} color={tintColor} />
// // // // // // // // // // //         ),
// // // // // // // // // // //         [actions.undo]: ({ tintColor }) => (
// // // // // // // // // // //             <Icon name="undo" size={22} color={tintColor} />
// // // // // // // // // // //         ),
// // // // // // // // // // //         [actions.redo]: ({ tintColor }) => (
// // // // // // // // // // //             <Icon name="redo" size={22} color={tintColor} />
// // // // // // // // // // //         ),
// // // // // // // // // // //     }}
// // // // // // // // // // //     style={{ backgroundColor: theme.background }}
// // // // // // // // // // // />
// // // // // // // // // // //                         <RichEditor
// // // // // // // // // // //                             ref={richTextRef}
// // // // // // // // // // //                             initialContentHTML={formData.content || ' '}
// // // // // // // // // // //                             onChange={(html) => setFormData({ ...formData, content: html })}
// // // // // // // // // // //                             editorStyle={{
// // // // // // // // // // //                                 backgroundColor: theme.background,
// // // // // // // // // // //                                 color: theme.text,
// // // // // // // // // // //                                 placeholderColor: theme.textSecondary,
// // // // // // // // // // //                                 contentCSS: `body { font-family: -apple-system; font-size: 16px; padding: 10px; }`,
// // // // // // // // // // //                             }}
// // // // // // // // // // //                             placeholder="Write your diary entry here..."
// // // // // // // // // // //                             style={[styles.editor, { backgroundColor: theme.background }]}
// // // // // // // // // // //                         />
// // // // // // // // // // //                     </View>
// // // // // // // // // // //                 </View>

// // // // // // // // // // //                 {/* Action Buttons */}
// // // // // // // // // // //                 <View style={styles.actionsContainer}>
// // // // // // // // // // //                     <TouchableOpacity
// // // // // // // // // // //                         style={[styles.actionButton, { backgroundColor: theme.warning }]}
// // // // // // // // // // //                         onPress={() => handleSave(false)}
// // // // // // // // // // //                         disabled={isSaving}
// // // // // // // // // // //                     >
// // // // // // // // // // //                         {isSaving ? (
// // // // // // // // // // //                             <ActivityIndicator size="small" color="#FFF" />
// // // // // // // // // // //                         ) : (
// // // // // // // // // // //                             <>
// // // // // // // // // // //                                 <Icon name="save" size={20} color="#FFF" />
// // // // // // // // // // //                                 <Text style={styles.actionButtonText}>Save Draft</Text>
// // // // // // // // // // //                             </>
// // // // // // // // // // //                         )}
// // // // // // // // // // //                     </TouchableOpacity>

// // // // // // // // // // //                     <TouchableOpacity
// // // // // // // // // // //                         style={[styles.actionButton, { backgroundColor: theme.success }]}
// // // // // // // // // // //                         onPress={() => handleSave(true)}
// // // // // // // // // // //                         disabled={isSaving}
// // // // // // // // // // //                     >
// // // // // // // // // // //                         {isSaving ? (
// // // // // // // // // // //                             <ActivityIndicator size="small" color="#FFF" />
// // // // // // // // // // //                         ) : (
// // // // // // // // // // //                             <>
// // // // // // // // // // //                                 <Icon name="send" size={20} color="#FFF" />
// // // // // // // // // // //                                 <Text style={styles.actionButtonText}>Publish</Text>
// // // // // // // // // // //                             </>
// // // // // // // // // // //                         )}
// // // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //             </ScrollView>

// // // // // // // // // // //             {renderClassModal()}
// // // // // // // // // // //             {renderSectionModal()}
// // // // // // // // // // //             {renderSubjectModal()}
// // // // // // // // // // //         </KeyboardAvoidingView>
// // // // // // // // // // //     );
// // // // // // // // // // // };

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //     container: {
// // // // // // // // // // //         flex: 1,
// // // // // // // // // // //     },
// // // // // // // // // // //     loadingContainer: {
// // // // // // // // // // //         flex: 1,
// // // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //     },
// // // // // // // // // // //     header: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // // // //         paddingVertical: 12,
// // // // // // // // // // //         borderBottomWidth: 1,
// // // // // // // // // // //     },
// // // // // // // // // // //     headerTitle: {
// // // // // // // // // // //         fontSize: 18,
// // // // // // // // // // //         fontWeight: 'bold',
// // // // // // // // // // //     },
// // // // // // // // // // //     scrollView: {
// // // // // // // // // // //         flex: 1,
// // // // // // // // // // //         padding: 16,
// // // // // // // // // // //     },
// // // // // // // // // // //     formGroup: {
// // // // // // // // // // //         borderRadius: 12,
// // // // // // // // // // //         padding: 16,
// // // // // // // // // // //         marginBottom: 12,
// // // // // // // // // // //         elevation: 2,
// // // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // // //         shadowOffset: { width: 0, height: 1 },
// // // // // // // // // // //         shadowOpacity: 0.05,
// // // // // // // // // // //         shadowRadius: 2,
// // // // // // // // // // //     },
// // // // // // // // // // //     label: {
// // // // // // // // // // //         fontSize: 14,
// // // // // // // // // // //         fontWeight: '600',
// // // // // // // // // // //         marginBottom: 8,
// // // // // // // // // // //     },
// // // // // // // // // // //     selector: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // // //         paddingHorizontal: 12,
// // // // // // // // // // //         paddingVertical: 10,
// // // // // // // // // // //         borderRadius: 8,
// // // // // // // // // // //         borderWidth: 1,
// // // // // // // // // // //     },
// // // // // // // // // // //     selectorText: {
// // // // // // // // // // //         fontSize: 14,
// // // // // // // // // // //     },
// // // // // // // // // // //     selectedTags: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         flexWrap: 'wrap',
// // // // // // // // // // //         marginTop: 8,
// // // // // // // // // // //         gap: 8,
// // // // // // // // // // //     },
// // // // // // // // // // //     tag: {
// // // // // // // // // // //         paddingHorizontal: 10,
// // // // // // // // // // //         paddingVertical: 4,
// // // // // // // // // // //         borderRadius: 16,
// // // // // // // // // // //     },
// // // // // // // // // // //     tagText: {
// // // // // // // // // // //         fontSize: 12,
// // // // // // // // // // //         fontWeight: '500',
// // // // // // // // // // //     },
// // // // // // // // // // //     editorContainer: {
// // // // // // // // // // //         borderRadius: 12,
// // // // // // // // // // //         padding: 16,
// // // // // // // // // // //         marginBottom: 12,
// // // // // // // // // // //         elevation: 2,
// // // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // // //         shadowOffset: { width: 0, height: 1 },
// // // // // // // // // // //         shadowOpacity: 0.05,
// // // // // // // // // // //         shadowRadius: 2,
// // // // // // // // // // //     },
// // // // // // // // // // //     editorWrapper: {
// // // // // // // // // // //         borderRadius: 8,
// // // // // // // // // // //         borderWidth: 1,
// // // // // // // // // // //         overflow: 'hidden',
// // // // // // // // // // //     },
// // // // // // // // // // //     toolbar: {
// // // // // // // // // // //         borderBottomWidth: 1,
// // // // // // // // // // //         minHeight: 50,
// // // // // // // // // // //     },
// // // // // // // // // // //     editor: {
// // // // // // // // // // //         minHeight: 300,
// // // // // // // // // // //         padding: 8,
// // // // // // // // // // //     },
// // // // // // // // // // //     actionsContainer: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         gap: 12,
// // // // // // // // // // //         marginBottom: 30,
// // // // // // // // // // //     },
// // // // // // // // // // //     actionButton: {
// // // // // // // // // // //         flex: 1,
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // // //         paddingVertical: 14,
// // // // // // // // // // //         borderRadius: 10,
// // // // // // // // // // //         gap: 8,
// // // // // // // // // // //     },
// // // // // // // // // // //     actionButtonText: {
// // // // // // // // // // //         color: '#FFF',
// // // // // // // // // // //         fontSize: 14,
// // // // // // // // // // //         fontWeight: '600',
// // // // // // // // // // //     },
// // // // // // // // // // //     modalOverlay: {
// // // // // // // // // // //         flex: 1,
// // // // // // // // // // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // // // // //         justifyContent: 'flex-end',
// // // // // // // // // // //     },
// // // // // // // // // // //     modalContent: {
// // // // // // // // // // //         borderTopLeftRadius: 20,
// // // // // // // // // // //         borderTopRightRadius: 20,
// // // // // // // // // // //         padding: 20,
// // // // // // // // // // //         maxHeight: '70%',
// // // // // // // // // // //     },
// // // // // // // // // // //     modalHeader: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         marginBottom: 16,
// // // // // // // // // // //     },
// // // // // // // // // // //     modalTitle: {
// // // // // // // // // // //         fontSize: 18,
// // // // // // // // // // //         fontWeight: 'bold',
// // // // // // // // // // //     },
// // // // // // // // // // //     modalItem: {
// // // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //         padding: 14,
// // // // // // // // // // //         borderRadius: 10,
// // // // // // // // // // //         marginBottom: 8,
// // // // // // // // // // //     },
// // // // // // // // // // //     modalItemText: {
// // // // // // // // // // //         fontSize: 16,
// // // // // // // // // // //     },
// // // // // // // // // // //     subjectDot: {
// // // // // // // // // // //         width: 12,
// // // // // // // // // // //         height: 12,
// // // // // // // // // // //         borderRadius: 6,
// // // // // // // // // // //     },
// // // // // // // // // // //     modalFooter: {
// // // // // // // // // // //         marginTop: 16,
// // // // // // // // // // //     },
// // // // // // // // // // //     confirmButton: {
// // // // // // // // // // //         paddingVertical: 12,
// // // // // // // // // // //         borderRadius: 8,
// // // // // // // // // // //         alignItems: 'center',
// // // // // // // // // // //     },
// // // // // // // // // // //     confirmButtonText: {
// // // // // // // // // // //         color: '#FFF',
// // // // // // // // // // //         fontSize: 14,
// // // // // // // // // // //         fontWeight: '600',
// // // // // // // // // // //     },
// // // // // // // // // // // });

// // // // // // // // // // // export default CreateDiaryScreen;
// // // // // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // // // // import {
// // // // // // // // // //     View,
// // // // // // // // // //     Text,
// // // // // // // // // //     StyleSheet,
// // // // // // // // // //     ScrollView,
// // // // // // // // // //     TouchableOpacity,
// // // // // // // // // //     ActivityIndicator,
// // // // // // // // // //     Alert,
// // // // // // // // // //     Modal,
// // // // // // // // // //     FlatList,
// // // // // // // // // //     Platform,
// // // // // // // // // //     KeyboardAvoidingView,
// // // // // // // // // //     Dimensions,
// // // // // // // // // // } from 'react-native';
// // // // // // // // // // import { useSelector } from 'react-redux';
// // // // // // // // // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // // // // // // // // import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// // // // // // // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // // // // // // import { selectCurrentUser } from '../../store/slices/authSlice';
// // // // // // // // // // import {
// // // // // // // // // //     useGetTeacherClassesQuery,
// // // // // // // // // //     useGetSubjectsFromClassWiseQuery,
// // // // // // // // // //     useCreateBatchDiaryMutation,
// // // // // // // // // // } from '../../store/diaryApi';

// // // // // // // // // // const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// // // // // // // // // // const CreateDiaryScreen = ({ navigation, route }) => {
// // // // // // // // // //     const theme = useSelector(selectThemeData);
// // // // // // // // // //     const user = useSelector(selectCurrentUser);
// // // // // // // // // //     const richTextRef = useRef(null);
    
// // // // // // // // // //     const editEntry = route.params?.editEntry;

// // // // // // // // // //     const [formData, setFormData] = useState({
// // // // // // // // // //         classId: null,
// // // // // // // // // //         className: '',
// // // // // // // // // //         sectionIds: [],
// // // // // // // // // //         sectionNames: [],
// // // // // // // // // //         subjectId: null,
// // // // // // // // // //         subjectName: '',
// // // // // // // // // //         content: editEntry?.content || '',
// // // // // // // // // //     });
    
// // // // // // // // // //     const [showClassModal, setShowClassModal] = useState(false);
// // // // // // // // // //     const [showSectionModal, setShowSectionModal] = useState(false);
// // // // // // // // // //     const [showSubjectModal, setShowSubjectModal] = useState(false);
// // // // // // // // // //     const [isSaving, setIsSaving] = useState(false);
// // // // // // // // // //     const [selectAllSections, setSelectAllSections] = useState(true);
// // // // // // // // // //     const [editorHeight, setEditorHeight] = useState(400);

// // // // // // // // // //     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
// // // // // // // // // //     const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsFromClassWiseQuery(
// // // // // // // // // //         { classId: formData.classId },
// // // // // // // // // //         { skip: !formData.classId }
// // // // // // // // // //     );
// // // // // // // // // //     const [createBatchDiary] = useCreateBatchDiaryMutation();

// // // // // // // // // //     const classes = classesData?.data || [];
// // // // // // // // // //     const subjects = subjectsData?.data || [];
// // // // // // // // // //     const selectedClass = classes.find(c => c.classId === formData.classId);
// // // // // // // // // //     const sections = selectedClass?.sections || [];

// // // // // // // // // //     // Auto-select all sections when class changes
// // // // // // // // // //     useEffect(() => {
// // // // // // // // // //         if (selectedClass && sections.length > 0 && selectAllSections) {
// // // // // // // // // //             setFormData(prev => ({
// // // // // // // // // //                 ...prev,
// // // // // // // // // //                 sectionIds: sections.map(s => s.sectionId),
// // // // // // // // // //                 sectionNames: sections.map(s => s.sectionName),
// // // // // // // // // //             }));
// // // // // // // // // //         }
// // // // // // // // // //     }, [selectedClass, sections]);

// // // // // // // // // //     const toggleSelectAllSections = () => {
// // // // // // // // // //         if (selectAllSections) {
// // // // // // // // // //             setFormData(prev => ({
// // // // // // // // // //                 ...prev,
// // // // // // // // // //                 sectionIds: [],
// // // // // // // // // //                 sectionNames: [],
// // // // // // // // // //             }));
// // // // // // // // // //             setSelectAllSections(false);
// // // // // // // // // //         } else {
// // // // // // // // // //             setFormData(prev => ({
// // // // // // // // // //                 ...prev,
// // // // // // // // // //                 sectionIds: sections.map(s => s.sectionId),
// // // // // // // // // //                 sectionNames: sections.map(s => s.sectionName),
// // // // // // // // // //             }));
// // // // // // // // // //             setSelectAllSections(true);
// // // // // // // // // //         }
// // // // // // // // // //     };

// // // // // // // // // //     const toggleSection = (section) => {
// // // // // // // // // //         const isSelected = formData.sectionIds.includes(section.sectionId);
        
// // // // // // // // // //         let newSectionIds, newSectionNames;
        
// // // // // // // // // //         if (isSelected) {
// // // // // // // // // //             newSectionIds = formData.sectionIds.filter(id => id !== section.sectionId);
// // // // // // // // // //             newSectionNames = formData.sectionNames.filter(name => name !== section.sectionName);
// // // // // // // // // //         } else {
// // // // // // // // // //             newSectionIds = [...formData.sectionIds, section.sectionId];
// // // // // // // // // //             newSectionNames = [...formData.sectionNames, section.sectionName];
// // // // // // // // // //         }
        
// // // // // // // // // //         setFormData(prev => ({
// // // // // // // // // //             ...prev,
// // // // // // // // // //             sectionIds: newSectionIds,
// // // // // // // // // //             sectionNames: newSectionNames,
// // // // // // // // // //         }));
        
// // // // // // // // // //         setSelectAllSections(newSectionIds.length === sections.length);
// // // // // // // // // //     };

// // // // // // // // // //     const handleSave = async (publish = false) => {
// // // // // // // // // //         if (!formData.classId) {
// // // // // // // // // //             Alert.alert('Error', 'Please select a class');
// // // // // // // // // //             return;
// // // // // // // // // //         }
// // // // // // // // // //         if (formData.sectionIds.length === 0) {
// // // // // // // // // //             Alert.alert('Error', 'Please select at least one section');
// // // // // // // // // //             return;
// // // // // // // // // //         }
// // // // // // // // // //         if (!formData.subjectId) {
// // // // // // // // // //             Alert.alert('Error', 'Please select a subject');
// // // // // // // // // //             return;
// // // // // // // // // //         }
// // // // // // // // // //         if (!formData.content || formData.content === '<p><br></p>' || formData.content === ' ') {
// // // // // // // // // //             Alert.alert('Error', 'Please write some content');
// // // // // // // // // //             return;
// // // // // // // // // //         }

// // // // // // // // // //         setIsSaving(true);
// // // // // // // // // //         try {
// // // // // // // // // //             const diaryData = {
// // // // // // // // // //                 Date: new Date().toISOString().split('T')[0],
// // // // // // // // // //                 ClassID: formData.classId,
// // // // // // // // // //                 SectionIds: formData.sectionIds,
// // // // // // // // // //                 SubjectID: formData.subjectId,
// // // // // // // // // //                 ClassWork: null,
// // // // // // // // // //                 HomeWork: formData.content,
// // // // // // // // // //                 CreatedBy: user?.id || 1,
// // // // // // // // // //                 isPublished: publish,
// // // // // // // // // //             };

// // // // // // // // // //             await createBatchDiary(diaryData).unwrap();
// // // // // // // // // //             Alert.alert('Success', `Diary ${publish ? 'published' : 'saved as draft'} successfully!`, [
// // // // // // // // // //                 { text: 'OK', onPress: () => navigation.goBack() }
// // // // // // // // // //             ]);
// // // // // // // // // //         } catch (error) {
// // // // // // // // // //             console.error('Save error:', error);
// // // // // // // // // //             Alert.alert('Error', error.data?.message || 'Failed to save diary');
// // // // // // // // // //         } finally {
// // // // // // // // // //             setIsSaving(false);
// // // // // // // // // //         }
// // // // // // // // // //     };

// // // // // // // // // //     const handleBack = () => {
// // // // // // // // // //         if (formData.content && formData.content !== '<p><br></p>' && formData.content !== ' ') {
// // // // // // // // // //             Alert.alert(
// // // // // // // // // //                 'Discard Changes',
// // // // // // // // // //                 'You have unsaved changes. Are you sure you want to leave?',
// // // // // // // // // //                 [
// // // // // // // // // //                     { text: 'Stay', style: 'cancel' },
// // // // // // // // // //                     { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
// // // // // // // // // //                 ]
// // // // // // // // // //             );
// // // // // // // // // //         } else {
// // // // // // // // // //             navigation.goBack();
// // // // // // // // // //         }
// // // // // // // // // //     };

// // // // // // // // // //     const renderClassModal = () => (
// // // // // // // // // //         <Modal visible={showClassModal} transparent animationType="slide" onRequestClose={() => setShowClassModal(false)}>
// // // // // // // // // //             <View style={styles.modalOverlay}>
// // // // // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // // // // //                     <View style={styles.modalHeader}>
// // // // // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Class</Text>
// // // // // // // // // //                         <TouchableOpacity onPress={() => setShowClassModal(false)}>
// // // // // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // // // // //                         </TouchableOpacity>
// // // // // // // // // //                     </View>
// // // // // // // // // //                     <FlatList
// // // // // // // // // //                         data={classes}
// // // // // // // // // //                         keyExtractor={(item) => item.classId.toString()}
// // // // // // // // // //                         renderItem={({ item }) => (
// // // // // // // // // //                             <TouchableOpacity
// // // // // // // // // //                                 style={[
// // // // // // // // // //                                     styles.modalItem,
// // // // // // // // // //                                     formData.classId === item.classId && { backgroundColor: theme.primary + '15' }
// // // // // // // // // //                                 ]}
// // // // // // // // // //                                 onPress={() => {
// // // // // // // // // //                                     setFormData({
// // // // // // // // // //                                         ...formData,
// // // // // // // // // //                                         classId: item.classId,
// // // // // // // // // //                                         className: item.className,
// // // // // // // // // //                                         sectionIds: [],
// // // // // // // // // //                                         sectionNames: [],
// // // // // // // // // //                                         subjectId: null,
// // // // // // // // // //                                         subjectName: '',
// // // // // // // // // //                                     });
// // // // // // // // // //                                     setSelectAllSections(true);
// // // // // // // // // //                                     setShowClassModal(false);
// // // // // // // // // //                                 }}
// // // // // // // // // //                             >
// // // // // // // // // //                                 <View style={[styles.modalItemIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // // //                                     <Icon name="school" size={20} color={theme.primary} />
// // // // // // // // // //                                 </View>
// // // // // // // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // // // // // // //                                     {item.className}
// // // // // // // // // //                                 </Text>
// // // // // // // // // //                                 {formData.classId === item.classId && (
// // // // // // // // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // // // // // // // //                                 )}
// // // // // // // // // //                             </TouchableOpacity>
// // // // // // // // // //                         )}
// // // // // // // // // //                     />
// // // // // // // // // //                 </View>
// // // // // // // // // //             </View>
// // // // // // // // // //         </Modal>
// // // // // // // // // //     );

// // // // // // // // // //     const renderSectionModal = () => (
// // // // // // // // // //         <Modal visible={showSectionModal} transparent animationType="slide" onRequestClose={() => setShowSectionModal(false)}>
// // // // // // // // // //             <View style={styles.modalOverlay}>
// // // // // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // // // // //                     <View style={styles.modalHeader}>
// // // // // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Sections</Text>
// // // // // // // // // //                         <TouchableOpacity onPress={() => setShowSectionModal(false)}>
// // // // // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // // // // //                         </TouchableOpacity>
// // // // // // // // // //                     </View>
                    
// // // // // // // // // //                     {/* Select All Option */}
// // // // // // // // // //                     {sections.length > 1 && (
// // // // // // // // // //                         <TouchableOpacity
// // // // // // // // // //                             style={[styles.selectAllButton, { borderBottomColor: theme.border }]}
// // // // // // // // // //                             onPress={toggleSelectAllSections}
// // // // // // // // // //                         >
// // // // // // // // // //                             <Icon 
// // // // // // // // // //                                 name={selectAllSections ? "check-box" : "check-box-outline-blank"} 
// // // // // // // // // //                                 size={22} 
// // // // // // // // // //                                 color={theme.primary} 
// // // // // // // // // //                             />
// // // // // // // // // //                             <Text style={[styles.selectAllText, { color: theme.text }]}>
// // // // // // // // // //                                 {selectAllSections ? 'Deselect All' : 'Select All Sections'}
// // // // // // // // // //                             </Text>
// // // // // // // // // //                         </TouchableOpacity>
// // // // // // // // // //                     )}
                    
// // // // // // // // // //                     <FlatList
// // // // // // // // // //                         data={sections}
// // // // // // // // // //                         keyExtractor={(item) => item.sectionId.toString()}
// // // // // // // // // //                         renderItem={({ item }) => {
// // // // // // // // // //                             const isSelected = formData.sectionIds.includes(item.sectionId);
// // // // // // // // // //                             return (
// // // // // // // // // //                                 <TouchableOpacity
// // // // // // // // // //                                     style={[styles.modalItem, isSelected && { backgroundColor: theme.primary + '10' }]}
// // // // // // // // // //                                     onPress={() => toggleSection(item)}
// // // // // // // // // //                                 >
// // // // // // // // // //                                     <Icon 
// // // // // // // // // //                                         name={isSelected ? "check-box" : "check-box-outline-blank"} 
// // // // // // // // // //                                         size={22} 
// // // // // // // // // //                                         color={isSelected ? theme.primary : theme.textSecondary} 
// // // // // // // // // //                                     />
// // // // // // // // // //                                     <View style={styles.sectionInfo}>
// // // // // // // // // //                                         <Text style={[styles.modalItemText, { color: theme.text, marginLeft: 12 }]}>
// // // // // // // // // //                                             Section {item.sectionName}
// // // // // // // // // //                                         </Text>
// // // // // // // // // //                                         <Text style={[styles.studentCount, { color: theme.textSecondary, marginLeft: 12 }]}>
// // // // // // // // // //                                             {item.totalStudents || 0} students
// // // // // // // // // //                                         </Text>
// // // // // // // // // //                                     </View>
// // // // // // // // // //                                 </TouchableOpacity>
// // // // // // // // // //                             );
// // // // // // // // // //                         }}
// // // // // // // // // //                     />
// // // // // // // // // //                     <View style={styles.modalFooter}>
// // // // // // // // // //                         <TouchableOpacity
// // // // // // // // // //                             style={[styles.confirmButton, { backgroundColor: theme.primary }]}
// // // // // // // // // //                             onPress={() => setShowSectionModal(false)}
// // // // // // // // // //                         >
// // // // // // // // // //                             <Text style={styles.confirmButtonText}>
// // // // // // // // // //                                 Confirm ({formData.sectionIds.length} section{formData.sectionIds.length !== 1 ? 's' : ''})
// // // // // // // // // //                             </Text>
// // // // // // // // // //                         </TouchableOpacity>
// // // // // // // // // //                     </View>
// // // // // // // // // //                 </View>
// // // // // // // // // //             </View>
// // // // // // // // // //         </Modal>
// // // // // // // // // //     );

// // // // // // // // // //     const renderSubjectModal = () => (
// // // // // // // // // //         <Modal visible={showSubjectModal} transparent animationType="slide" onRequestClose={() => setShowSubjectModal(false)}>
// // // // // // // // // //             <View style={styles.modalOverlay}>
// // // // // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // // // // //                     <View style={styles.modalHeader}>
// // // // // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Subject</Text>
// // // // // // // // // //                         <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
// // // // // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // // // // //                         </TouchableOpacity>
// // // // // // // // // //                     </View>
// // // // // // // // // //                     <FlatList
// // // // // // // // // //                         data={subjects}
// // // // // // // // // //                         keyExtractor={(item) => item.subjectId.toString()}
// // // // // // // // // //                         renderItem={({ item }) => (
// // // // // // // // // //                             <TouchableOpacity
// // // // // // // // // //                                 style={[
// // // // // // // // // //                                     styles.modalItem,
// // // // // // // // // //                                     formData.subjectId === item.subjectId && { backgroundColor: theme.primary + '15' }
// // // // // // // // // //                                 ]}
// // // // // // // // // //                                 onPress={() => {
// // // // // // // // // //                                     setFormData({
// // // // // // // // // //                                         ...formData,
// // // // // // // // // //                                         subjectId: item.subjectId,
// // // // // // // // // //                                         subjectName: item.subjectName,
// // // // // // // // // //                                     });
// // // // // // // // // //                                     setShowSubjectModal(false);
// // // // // // // // // //                                 }}
// // // // // // // // // //                             >
// // // // // // // // // //                                 <View style={[styles.subjectDot, { backgroundColor: item.colorCode || theme.primary }]} />
// // // // // // // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // // // // // // //                                     {item.subjectName}
// // // // // // // // // //                                 </Text>
// // // // // // // // // //                                 {formData.subjectId === item.subjectId && (
// // // // // // // // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // // // // // // // //                                 )}
// // // // // // // // // //                             </TouchableOpacity>
// // // // // // // // // //                         )}
// // // // // // // // // //                     />
// // // // // // // // // //                 </View>
// // // // // // // // // //             </View>
// // // // // // // // // //         </Modal>
// // // // // // // // // //     );

// // // // // // // // // //     if (classesLoading) {
// // // // // // // // // //         return (
// // // // // // // // // //             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
// // // // // // // // // //                 <ActivityIndicator size="large" color={theme.primary} />
// // // // // // // // // //             </View>
// // // // // // // // // //         );
// // // // // // // // // //     }

// // // // // // // // // //     return (
// // // // // // // // // //         <KeyboardAvoidingView 
// // // // // // // // // //             style={[styles.container, { backgroundColor: theme.background }]}
// // // // // // // // // //             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // // // // // // // // //             keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
// // // // // // // // // //         >
// // // // // // // // // //             {/* Header */}
// // // // // // // // // //             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // // // // // // //                 <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
// // // // // // // // // //                     <Icon name="arrow-back" size={24} color={theme.text} />
// // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // //                 <Text style={[styles.headerTitle, { color: theme.text }]}>
// // // // // // // // // //                     {editEntry ? 'Edit Diary' : 'Create Diary'}
// // // // // // // // // //                 </Text>
// // // // // // // // // //                 <View style={styles.headerButton} />
// // // // // // // // // //             </View>

// // // // // // // // // //             <ScrollView 
// // // // // // // // // //                 style={styles.scrollView} 
// // // // // // // // // //                 showsVerticalScrollIndicator={false}
// // // // // // // // // //                 contentContainerStyle={styles.scrollContent}
// // // // // // // // // //             >
// // // // // // // // // //                 {/* Selection Cards Row */}
// // // // // // // // // //                 <View style={styles.selectionRow}>
// // // // // // // // // //                     {/* Class Selection Card */}
// // // // // // // // // //                     <TouchableOpacity
// // // // // // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // // // // // //                         onPress={() => setShowClassModal(true)}
// // // // // // // // // //                         activeOpacity={0.7}
// // // // // // // // // //                     >
// // // // // // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // // //                             <Icon name="school" size={22} color={theme.primary} />
// // // // // // // // // //                         </View>
// // // // // // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Class</Text>
// // // // // // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // // // // // //                             {formData.className || 'Select'}
// // // // // // // // // //                         </Text>
// // // // // // // // // //                     </TouchableOpacity>

// // // // // // // // // //                     {/* Sections Selection Card */}
// // // // // // // // // //                     <TouchableOpacity
// // // // // // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // // // // // //                         onPress={() => formData.classId ? setShowSectionModal(true) : Alert.alert('Info', 'Please select class first')}
// // // // // // // // // //                         activeOpacity={0.7}
// // // // // // // // // //                     >
// // // // // // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // // //                             <Icon name="groups" size={22} color={theme.primary} />
// // // // // // // // // //                         </View>
// // // // // // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Sections</Text>
// // // // // // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // // // // // //                             {formData.sectionIds.length ? `${formData.sectionIds.length} selected` : 'Select'}
// // // // // // // // // //                         </Text>
// // // // // // // // // //                     </TouchableOpacity>

// // // // // // // // // //                     {/* Subject Selection Card */}
// // // // // // // // // //                     <TouchableOpacity
// // // // // // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // // // // // //                         onPress={() => formData.sectionIds.length ? setShowSubjectModal(true) : Alert.alert('Info', 'Please select sections first')}
// // // // // // // // // //                         activeOpacity={0.7}
// // // // // // // // // //                     >
// // // // // // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // // //                             <Icon name="book" size={22} color={theme.primary} />
// // // // // // // // // //                         </View>
// // // // // // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Subject</Text>
// // // // // // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // // // // // //                             {formData.subjectName || 'Select'}
// // // // // // // // // //                         </Text>
// // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // //                 </View>

// // // // // // // // // //                 {/* Selected Sections Tags */}
// // // // // // // // // //                 {formData.sectionIds.length > 0 && (
// // // // // // // // // //                     <View style={[styles.tagsContainer, { backgroundColor: theme.card }]}>
// // // // // // // // // //                         <Text style={[styles.tagsLabel, { color: theme.textSecondary }]}>Selected Sections:</Text>
// // // // // // // // // //                         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
// // // // // // // // // //                             {formData.sectionNames.map((name, index) => (
// // // // // // // // // //                                 <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // // //                                     <Text style={[styles.tagText, { color: theme.primary }]}>Sec {name}</Text>
// // // // // // // // // //                                 </View>
// // // // // // // // // //                             ))}
// // // // // // // // // //                         </ScrollView>
// // // // // // // // // //                     </View>
// // // // // // // // // //                 )}

// // // // // // // // // //                 {/* Rich Text Editor */}
// // // // // // // // // //                 <View style={[styles.editorCard, { backgroundColor: theme.card }]}>
// // // // // // // // // //                     <View style={styles.editorHeader}>
// // // // // // // // // //                         <Icon name="edit-note" size={20} color={theme.primary} />
// // // // // // // // // //                         <Text style={[styles.editorTitle, { color: theme.text }]}>Diary Content</Text>
// // // // // // // // // //                     </View>
                    
// // // // // // // // // //                     <View style={[styles.editorWrapper, { borderColor: theme.border }]}>
// // // // // // // // // //                         <RichToolbar
// // // // // // // // // //                             editor={richTextRef}
// // // // // // // // // //                             actions={[
// // // // // // // // // //                                 actions.setBold,
// // // // // // // // // //                                 actions.setItalic,
// // // // // // // // // //                                 actions.setUnderline,
// // // // // // // // // //                                 actions.insertBulletsList,
// // // // // // // // // //                                 actions.insertOrderedList,
// // // // // // // // // //                                 actions.setAlignLeft,
// // // // // // // // // //                                 actions.setAlignCenter,
// // // // // // // // // //                                 actions.setAlignRight,
// // // // // // // // // //                                 actions.undo,
// // // // // // // // // //                                 actions.redo,
// // // // // // // // // //                             ]}
// // // // // // // // // //                             iconMap={{
// // // // // // // // // //                                 [actions.setBold]: ({ tintColor }) => <Icon name="format-bold" size={20} color={tintColor} />,
// // // // // // // // // //                                 [actions.setItalic]: ({ tintColor }) => <Icon name="format-italic" size={20} color={tintColor} />,
// // // // // // // // // //                                 [actions.setUnderline]: ({ tintColor }) => <Icon name="format-underlined" size={20} color={tintColor} />,
// // // // // // // // // //                                 [actions.insertBulletsList]: ({ tintColor }) => <Icon name="format-list-bulleted" size={20} color={tintColor} />,
// // // // // // // // // //                                 [actions.insertOrderedList]: ({ tintColor }) => <Icon name="format-list-numbered" size={20} color={tintColor} />,
// // // // // // // // // //                                 [actions.setAlignLeft]: ({ tintColor }) => <Icon name="format-align-left" size={20} color={tintColor} />,
// // // // // // // // // //                                 [actions.setAlignCenter]: ({ tintColor }) => <Icon name="format-align-center" size={20} color={tintColor} />,
// // // // // // // // // //                                 [actions.setAlignRight]: ({ tintColor }) => <Icon name="format-align-right" size={20} color={tintColor} />,
// // // // // // // // // //                                 [actions.undo]: ({ tintColor }) => <Icon name="undo" size={20} color={tintColor} />,
// // // // // // // // // //                                 [actions.redo]: ({ tintColor }) => <Icon name="redo" size={20} color={tintColor} />,
// // // // // // // // // //                             }}
// // // // // // // // // //                             style={[styles.toolbar, { backgroundColor: theme.background, borderBottomColor: theme.border }]}
// // // // // // // // // //                         />
// // // // // // // // // //                         <RichEditor
// // // // // // // // // //                             ref={richTextRef}
// // // // // // // // // //                             initialContentHTML={formData.content || '<p><br></p>'}
// // // // // // // // // //                             onChange={(html) => setFormData({ ...formData, content: html })}
// // // // // // // // // //                             editorStyle={{
// // // // // // // // // //                                 backgroundColor: theme.background,
// // // // // // // // // //                                 color: theme.text,
// // // // // // // // // //                                 placeholderColor: theme.textSecondary,
// // // // // // // // // //                                 contentCSS: `body { 
// // // // // // // // // //                                     font-family: -apple-system; 
// // // // // // // // // //                                     font-size: 16px; 
// // // // // // // // // //                                     padding: 16px; 
// // // // // // // // // //                                     line-height: 1.5;
// // // // // // // // // //                                 }`,
// // // // // // // // // //                             }}
// // // // // // // // // //                             placeholder="Write your diary entry here..."
// // // // // // // // // //                             style={[styles.editor, { backgroundColor: theme.background, height: editorHeight }]}
// // // // // // // // // //                             onLoadEnd={() => setEditorHeight(450)}
// // // // // // // // // //                         />
// // // // // // // // // //                     </View>
// // // // // // // // // //                 </View>

// // // // // // // // // //                 {/* Action Buttons */}
// // // // // // // // // //                 <View style={styles.actionsContainer}>
// // // // // // // // // //                     <TouchableOpacity
// // // // // // // // // //                         style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15' }]}
// // // // // // // // // //                         onPress={() => handleSave(false)}
// // // // // // // // // //                         disabled={isSaving}
// // // // // // // // // //                     >
// // // // // // // // // //                         {isSaving ? (
// // // // // // // // // //                             <ActivityIndicator size="small" color={theme.warning} />
// // // // // // // // // //                         ) : (
// // // // // // // // // //                             <>
// // // // // // // // // //                                 <Icon name="save" size={20} color={theme.warning} />
// // // // // // // // // //                                 <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>
// // // // // // // // // //                             </>
// // // // // // // // // //                         )}
// // // // // // // // // //                     </TouchableOpacity>

// // // // // // // // // //                     <TouchableOpacity
// // // // // // // // // //                         style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
// // // // // // // // // //                         onPress={() => handleSave(true)}
// // // // // // // // // //                         disabled={isSaving}
// // // // // // // // // //                     >
// // // // // // // // // //                         {isSaving ? (
// // // // // // // // // //                             <ActivityIndicator size="small" color="#FFF" />
// // // // // // // // // //                         ) : (
// // // // // // // // // //                             <>
// // // // // // // // // //                                 <Icon name="send" size={20} color="#FFF" />
// // // // // // // // // //                                 <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>
// // // // // // // // // //                             </>
// // // // // // // // // //                         )}
// // // // // // // // // //                     </TouchableOpacity>
// // // // // // // // // //                 </View>
// // // // // // // // // //             </ScrollView>

// // // // // // // // // //             {renderClassModal()}
// // // // // // // // // //             {renderSectionModal()}
// // // // // // // // // //             {renderSubjectModal()}
// // // // // // // // // //         </KeyboardAvoidingView>
// // // // // // // // // //     );
// // // // // // // // // // };

// // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // //     container: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //     },
// // // // // // // // // //     loadingContainer: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //     },
// // // // // // // // // //     header: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // // //         paddingVertical: 14,
// // // // // // // // // //         borderBottomWidth: 1,
// // // // // // // // // //     },
// // // // // // // // // //     headerButton: {
// // // // // // // // // //         width: 40,
// // // // // // // // // //         height: 40,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //     },
// // // // // // // // // //     headerTitle: {
// // // // // // // // // //         fontSize: 18,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //     },
// // // // // // // // // //     scrollView: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //     },
// // // // // // // // // //     scrollContent: {
// // // // // // // // // //         padding: 16,
// // // // // // // // // //         paddingBottom: 30,
// // // // // // // // // //     },
// // // // // // // // // //     selectionRow: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         gap: 12,
// // // // // // // // // //         marginBottom: 16,
// // // // // // // // // //     },
// // // // // // // // // //     selectionCard: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         paddingVertical: 14,
// // // // // // // // // //         paddingHorizontal: 8,
// // // // // // // // // //         borderRadius: 12,
// // // // // // // // // //         borderWidth: 1,
// // // // // // // // // //         elevation: 1,
// // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // //         shadowOffset: { width: 0, height: 1 },
// // // // // // // // // //         shadowOpacity: 0.05,
// // // // // // // // // //         shadowRadius: 2,
// // // // // // // // // //     },
// // // // // // // // // //     cardIcon: {
// // // // // // // // // //         width: 44,
// // // // // // // // // //         height: 44,
// // // // // // // // // //         borderRadius: 22,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         marginBottom: 8,
// // // // // // // // // //     },
// // // // // // // // // //     cardLabel: {
// // // // // // // // // //         fontSize: 11,
// // // // // // // // // //         marginBottom: 2,
// // // // // // // // // //     },
// // // // // // // // // //     cardValue: {
// // // // // // // // // //         fontSize: 12,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //         textAlign: 'center',
// // // // // // // // // //     },
// // // // // // // // // //     tagsContainer: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         paddingHorizontal: 12,
// // // // // // // // // //         paddingVertical: 10,
// // // // // // // // // //         borderRadius: 10,
// // // // // // // // // //         marginBottom: 16,
// // // // // // // // // //         gap: 8,
// // // // // // // // // //     },
// // // // // // // // // //     tagsLabel: {
// // // // // // // // // //         fontSize: 12,
// // // // // // // // // //     },
// // // // // // // // // //     tagsScroll: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //     },
// // // // // // // // // //     tag: {
// // // // // // // // // //         paddingHorizontal: 10,
// // // // // // // // // //         paddingVertical: 4,
// // // // // // // // // //         borderRadius: 16,
// // // // // // // // // //         marginRight: 6,
// // // // // // // // // //     },
// // // // // // // // // //     tagText: {
// // // // // // // // // //         fontSize: 11,
// // // // // // // // // //         fontWeight: '500',
// // // // // // // // // //     },
// // // // // // // // // //     editorCard: {
// // // // // // // // // //         borderRadius: 16,
// // // // // // // // // //         overflow: 'hidden',
// // // // // // // // // //         elevation: 2,
// // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // // // // //         shadowOpacity: 0.08,
// // // // // // // // // //         shadowRadius: 4,
// // // // // // // // // //         marginBottom: 20,
// // // // // // // // // //     },
// // // // // // // // // //     editorHeader: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         padding: 14,
// // // // // // // // // //         gap: 8,
// // // // // // // // // //     },
// // // // // // // // // //     editorTitle: {
// // // // // // // // // //         fontSize: 14,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //     },
// // // // // // // // // //     editorWrapper: {
// // // // // // // // // //         borderTopWidth: 1,
// // // // // // // // // //     },
// // // // // // // // // //     toolbar: {
// // // // // // // // // //         borderBottomWidth: 1,
// // // // // // // // // //         minHeight: 48,
// // // // // // // // // //         paddingHorizontal: 8,
// // // // // // // // // //     },
// // // // // // // // // //     editor: {
// // // // // // // // // //         minHeight: 450,
// // // // // // // // // //         padding: 0,
// // // // // // // // // //     },
// // // // // // // // // //     actionsContainer: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         gap: 12,
// // // // // // // // // //     },
// // // // // // // // // //     actionButton: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         paddingVertical: 14,
// // // // // // // // // //         borderRadius: 12,
// // // // // // // // // //         gap: 10,
// // // // // // // // // //     },
// // // // // // // // // //     draftButton: {
// // // // // // // // // //         borderWidth: 1,
// // // // // // // // // //         borderColor: 'transparent',
// // // // // // // // // //     },
// // // // // // // // // //     publishButton: {
// // // // // // // // // //         elevation: 2,
// // // // // // // // // //         shadowColor: '#000',
// // // // // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // // // // //         shadowOpacity: 0.1,
// // // // // // // // // //         shadowRadius: 4,
// // // // // // // // // //     },
// // // // // // // // // //     actionButtonText: {
// // // // // // // // // //         fontSize: 15,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //     },
// // // // // // // // // //     modalOverlay: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // // // //         justifyContent: 'flex-end',
// // // // // // // // // //     },
// // // // // // // // // //     modalContent: {
// // // // // // // // // //         borderTopLeftRadius: 24,
// // // // // // // // // //         borderTopRightRadius: 24,
// // // // // // // // // //         padding: 20,
// // // // // // // // // //         maxHeight: '75%',
// // // // // // // // // //     },
// // // // // // // // // //     modalHeader: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         marginBottom: 20,
// // // // // // // // // //     },
// // // // // // // // // //     modalTitle: {
// // // // // // // // // //         fontSize: 20,
// // // // // // // // // //         fontWeight: 'bold',
// // // // // // // // // //     },
// // // // // // // // // //     selectAllButton: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         paddingVertical: 12,
// // // // // // // // // //         marginBottom: 8,
// // // // // // // // // //         borderBottomWidth: 1,
// // // // // // // // // //         gap: 12,
// // // // // // // // // //     },
// // // // // // // // // //     selectAllText: {
// // // // // // // // // //         fontSize: 15,
// // // // // // // // // //         fontWeight: '500',
// // // // // // // // // //     },
// // // // // // // // // //     modalItem: {
// // // // // // // // // //         flexDirection: 'row',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //         padding: 14,
// // // // // // // // // //         borderRadius: 12,
// // // // // // // // // //         marginBottom: 8,
// // // // // // // // // //         gap: 12,
// // // // // // // // // //     },
// // // // // // // // // //     modalItemIcon: {
// // // // // // // // // //         width: 40,
// // // // // // // // // //         height: 40,
// // // // // // // // // //         borderRadius: 20,
// // // // // // // // // //         justifyContent: 'center',
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //     },
// // // // // // // // // //     modalItemText: {
// // // // // // // // // //         fontSize: 15,
// // // // // // // // // //     },
// // // // // // // // // //     sectionInfo: {
// // // // // // // // // //         flex: 1,
// // // // // // // // // //     },
// // // // // // // // // //     studentCount: {
// // // // // // // // // //         fontSize: 11,
// // // // // // // // // //         marginTop: 2,
// // // // // // // // // //     },
// // // // // // // // // //     subjectDot: {
// // // // // // // // // //         width: 12,
// // // // // // // // // //         height: 12,
// // // // // // // // // //         borderRadius: 6,
// // // // // // // // // //     },
// // // // // // // // // //     modalFooter: {
// // // // // // // // // //         marginTop: 16,
// // // // // // // // // //     },
// // // // // // // // // //     confirmButton: {
// // // // // // // // // //         paddingVertical: 14,
// // // // // // // // // //         borderRadius: 12,
// // // // // // // // // //         alignItems: 'center',
// // // // // // // // // //     },
// // // // // // // // // //     confirmButtonText: {
// // // // // // // // // //         color: '#FFF',
// // // // // // // // // //         fontSize: 15,
// // // // // // // // // //         fontWeight: '600',
// // // // // // // // // //     },
// // // // // // // // // // });

// // // // // // // // // // export default CreateDiaryScreen;
// // // // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // // // import {
// // // // // // // // //     View,
// // // // // // // // //     Text,
// // // // // // // // //     StyleSheet,
// // // // // // // // //     ScrollView,
// // // // // // // // //     TouchableOpacity,
// // // // // // // // //     ActivityIndicator,
// // // // // // // // //     Alert,
// // // // // // // // //     Modal,
// // // // // // // // //     FlatList,
// // // // // // // // //     Platform,
// // // // // // // // //     KeyboardAvoidingView,
// // // // // // // // //     Dimensions,
// // // // // // // // // } from 'react-native';
// // // // // // // // // import { useSelector } from 'react-redux';
// // // // // // // // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // // // // // // // import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// // // // // // // // // import * as ImagePicker from 'expo-image-picker';
// // // // // // // // // import * as ImageManipulator from 'expo-image-manipulator';
// // // // // // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // // // // // import { selectCurrentUser } from '../../store/slices/authSlice';
// // // // // // // // // import {
// // // // // // // // //     useGetTeacherClassesQuery,
// // // // // // // // //     useGetSubjectsFromClassWiseQuery,
// // // // // // // // //     useCreateBatchDiaryMutation,
// // // // // // // // // } from '../../store/diaryApi';

// // // // // // // // // const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// // // // // // // // // const CreateDiaryScreen = ({ navigation, route }) => {
// // // // // // // // //     const theme = useSelector(selectThemeData);
// // // // // // // // //     const user = useSelector(selectCurrentUser);
// // // // // // // // //     const richTextRef = useRef(null);
    
// // // // // // // // //     const editEntry = route.params?.editEntry;

// // // // // // // // //     const [formData, setFormData] = useState({
// // // // // // // // //         classId: null,
// // // // // // // // //         className: '',
// // // // // // // // //         sectionIds: [],
// // // // // // // // //         sectionNames: [],
// // // // // // // // //         subjectId: null,
// // // // // // // // //         subjectName: '',
// // // // // // // // //         content: editEntry?.content || '<p><br></p>',
// // // // // // // // //     });
    
// // // // // // // // //     const [showClassModal, setShowClassModal] = useState(false);
// // // // // // // // //     const [showSectionModal, setShowSectionModal] = useState(false);
// // // // // // // // //     const [showSubjectModal, setShowSubjectModal] = useState(false);
// // // // // // // // //     const [isSaving, setIsSaving] = useState(false);
// // // // // // // // //     const [selectAllSections, setSelectAllSections] = useState(true);
// // // // // // // // //     const [editorHeight, setEditorHeight] = useState(1000);
// // // // // // // // //     const [uploadingImage, setUploadingImage] = useState(false);

// // // // // // // // //     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
// // // // // // // // //     const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsFromClassWiseQuery(
// // // // // // // // //         { classId: formData.classId },
// // // // // // // // //         { skip: !formData.classId }
// // // // // // // // //     );


// // // // // // // // //     console.log('Subjects for class', classesData, subjectsData);

// // // // // // // // //     const [createBatchDiary] = useCreateBatchDiaryMutation();

// // // // // // // // //     const classes = classesData?.data || [];
// // // // // // // // //     const subjects = subjectsData?.data || [];
// // // // // // // // //     const selectedClass = classes.find(c => c.classId === formData.classId);
// // // // // // // // //     const sections = selectedClass?.sections || [];
// // // // // // // // // console.log('Selected class sections subjects', selectedClass   , sections, subjects);
// // // // // // // // //     // Auto-select all sections when class changes
// // // // // // // // //     useEffect(() => {
// // // // // // // // //         if (selectedClass && sections.length > 0 && selectAllSections) {
// // // // // // // // //             setFormData(prev => ({
// // // // // // // // //                 ...prev,
// // // // // // // // //                 sectionIds: sections.map(s => s.sectionId),
// // // // // // // // //                 sectionNames: sections.map(s => s.sectionName),
// // // // // // // // //             }));
// // // // // // // // //         }
// // // // // // // // //     }, [selectedClass, sections]);


// // // // // // // // // useEffect(() => {
// // // // // // // // //     console.log('🔍 Classes Data Full:', JSON.stringify(classesData, null, 2));
// // // // // // // // //     console.log('🔍 Subjects Data:', JSON.stringify(subjectsData, null, 2));
// // // // // // // // //     console.log('🔍 Selected Class:', selectedClass);
// // // // // // // // //     console.log('🔍 Sections:', sections);
// // // // // // // // //     console.log('🔍 Subjects Array:', subjects);
// // // // // // // // // }, [classesData, subjectsData, selectedClass, sections]);

// // // // // // // // // // Also update the render for subjects to show loading/empty states
// // // // // // // // // console.log('Subjects for class', formData.classId, ':', subjects);
// // // // // // // // // console.log('Subjects data raw:', subjectsData);

// // // // // // // // //     // ✅ IMAGE HANDLER - Base64 embedding (no server upload needed)
// // // // // // // // //     const pickAndInsertImage = async () => {
// // // // // // // // //         try {
// // // // // // // // //             // Request permission
// // // // // // // // //             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// // // // // // // // //             if (status !== 'granted') {
// // // // // // // // //                 Alert.alert('Permission Required', 'Please grant camera roll permissions');
// // // // // // // // //                 return;
// // // // // // // // //             }

// // // // // // // // //             // Pick image from gallery
// // // // // // // // //             const result = await ImagePicker.launchImageLibraryAsync({
// // // // // // // // //                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
// // // // // // // // //                 quality: 1,
// // // // // // // // //                 allowsEditing: true,
// // // // // // // // //             });

// // // // // // // // //             if (result.canceled) return;

// // // // // // // // //             const image = result.assets[0];

// // // // // // // // //             // Check file size (max 2MB recommended)
// // // // // // // // //             if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
// // // // // // // // //                 Alert.alert('Image Too Large', 'Please select an image smaller than 2MB');
// // // // // // // // //                 return;
// // // // // // // // //             }

// // // // // // // // //             setUploadingImage(true);

// // // // // // // // //             // ✅ Compress image to Base64 (600px width, 50% quality)
// // // // // // // // //             const manipulatedImage = await ImageManipulator.manipulateAsync(
// // // // // // // // //                 image.uri,
// // // // // // // // //                 [{ resize: { width: 600 } }], // Resize to max 600px width
// // // // // // // // //                 {
// // // // // // // // //                     compress: 0.5, // 50% quality
// // // // // // // // //                     format: ImageManipulator.SaveFormat.JPEG,
// // // // // // // // //                     base64: true, // 👈 THIS IS KEY - converts to Base64
// // // // // // // // //                 }
// // // // // // // // //             );

// // // // // // // // //             // Create Base64 image string
// // // // // // // // //             const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;

// // // // // // // // //             // Insert image into editor with proper styling
// // // // // // // // //             const imageHtml = `<div style="text-align: center; margin: 12px 0;">
// // // // // // // // //                 <img src="${base64Image}" alt="Diary Image" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
// // // // // // // // //             </div>`;

// // // // // // // // //             // Insert at cursor position
// // // // // // // // //             richTextRef.current?.insertHTML(imageHtml);
            
// // // // // // // // //             Alert.alert('Success', 'Image added to diary', [{ text: 'OK' }]);
// // // // // // // // //         } catch (error) {
// // // // // // // // //             console.error('Image pick error:', error);
// // // // // // // // //             Alert.alert('Error', 'Failed to add image');
// // // // // // // // //         } finally {
// // // // // // // // //             setUploadingImage(false);
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     const toggleSelectAllSections = () => {
// // // // // // // // //         if (selectAllSections) {
// // // // // // // // //             setFormData(prev => ({
// // // // // // // // //                 ...prev,
// // // // // // // // //                 sectionIds: [],
// // // // // // // // //                 sectionNames: [],
// // // // // // // // //             }));
// // // // // // // // //             setSelectAllSections(false);
// // // // // // // // //         } else {
// // // // // // // // //             setFormData(prev => ({
// // // // // // // // //                 ...prev,
// // // // // // // // //                 sectionIds: sections.map(s => s.sectionId),
// // // // // // // // //                 sectionNames: sections.map(s => s.sectionName),
// // // // // // // // //             }));
// // // // // // // // //             setSelectAllSections(true);
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     const toggleSection = (section) => {
// // // // // // // // //         const isSelected = formData.sectionIds.includes(section.sectionId);
        
// // // // // // // // //         if (isSelected) {
// // // // // // // // //             setFormData(prev => ({
// // // // // // // // //                 ...prev,
// // // // // // // // //                 sectionIds: prev.sectionIds.filter(id => id !== section.sectionId),
// // // // // // // // //                 sectionNames: prev.sectionNames.filter(name => name !== section.sectionName),
// // // // // // // // //             }));
// // // // // // // // //         } else {
// // // // // // // // //             setFormData(prev => ({
// // // // // // // // //                 ...prev,
// // // // // // // // //                 sectionIds: [...prev.sectionIds, section.sectionId],
// // // // // // // // //                 sectionNames: [...prev.sectionNames, section.sectionName],
// // // // // // // // //             }));
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     const handleSave = async (publish = false) => {
// // // // // // // // //         if (!formData.classId) {
// // // // // // // // //             Alert.alert('Error', 'Please select a class');
// // // // // // // // //             return;
// // // // // // // // //         }
// // // // // // // // //         if (formData.sectionIds.length === 0) {
// // // // // // // // //             Alert.alert('Error', 'Please select at least one section');
// // // // // // // // //             return;
// // // // // // // // //         }
// // // // // // // // //         if (!formData.subjectId) {
// // // // // // // // //             Alert.alert('Error', 'Please select a subject');
// // // // // // // // //             return;
// // // // // // // // //         }
        
// // // // // // // // //         // Get HTML content from editor
// // // // // // // // //         let htmlContent = formData.content;
// // // // // // // // //         if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === ' ') {
// // // // // // // // //             Alert.alert('Error', 'Please write some content');
// // // // // // // // //             return;
// // // // // // // // //         }

// // // // // // // // //         setIsSaving(true);
// // // // // // // // //         try {
// // // // // // // // //             const diaryData = {
// // // // // // // // //                 Date: new Date().toISOString().split('T')[0],
// // // // // // // // //                 ClassID: formData.classId,
// // // // // // // // //                 SectionIds: formData.sectionIds,
// // // // // // // // //                 SubjectID: formData.subjectId,
// // // // // // // // //                 ClassWork: null,
// // // // // // // // //                 HomeWork: htmlContent, // Complete HTML with Base64 images
// // // // // // // // //                 CreatedBy: user?.id || 1,
// // // // // // // // //                 isPublished: publish,
// // // // // // // // //             };

// // // // // // // // //             await createBatchDiary(diaryData).unwrap();
// // // // // // // // //             Alert.alert('Success', `Diary ${publish ? 'published' : 'saved as draft'} successfully!`, [
// // // // // // // // //                 { text: 'OK', onPress: () => navigation.goBack() }
// // // // // // // // //             ]);
// // // // // // // // //         } catch (error) {
// // // // // // // // //             console.error('Save error:', error);
// // // // // // // // //             Alert.alert('Error', error.data?.message || 'Failed to save diary');
// // // // // // // // //         } finally {
// // // // // // // // //             setIsSaving(false);
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     const handleBack = () => {
// // // // // // // // //         const hasContent = formData.content && 
// // // // // // // // //                           formData.content !== '<p><br></p>' && 
// // // // // // // // //                           formData.content !== ' ' &&
// // // // // // // // //                           formData.content.length > 50;
        
// // // // // // // // //         if (hasContent) {
// // // // // // // // //             Alert.alert(
// // // // // // // // //                 'Discard Changes',
// // // // // // // // //                 'You have unsaved changes. Are you sure you want to leave?',
// // // // // // // // //                 [
// // // // // // // // //                     { text: 'Stay', style: 'cancel' },
// // // // // // // // //                     { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
// // // // // // // // //                 ]
// // // // // // // // //             );
// // // // // // // // //         } else {
// // // // // // // // //             navigation.goBack();
// // // // // // // // //         }
// // // // // // // // //     };

// // // // // // // // //     const renderClassModal = () => (
// // // // // // // // //         <Modal visible={showClassModal} transparent animationType="slide" onRequestClose={() => setShowClassModal(false)}>
// // // // // // // // //             <View style={styles.modalOverlay}>
// // // // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // // // //                     <View style={styles.modalHeader}>
// // // // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Class</Text>
// // // // // // // // //                         <TouchableOpacity onPress={() => setShowClassModal(false)}>
// // // // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // // // //                         </TouchableOpacity>
// // // // // // // // //                     </View>
// // // // // // // // //                     <FlatList
// // // // // // // // //                         data={classes}
// // // // // // // // //                         keyExtractor={(item) => item.classId?.toString()}
// // // // // // // // //                         renderItem={({ item }) => (
// // // // // // // // //                             <TouchableOpacity
// // // // // // // // //                                 style={[
// // // // // // // // //                                     styles.modalItem,
// // // // // // // // //                                     formData.classId === item.classId && { backgroundColor: theme.primary + '15' }
// // // // // // // // //                                 ]}
// // // // // // // // //                                 onPress={() => {
// // // // // // // // //                                     setFormData({
// // // // // // // // //                                         ...formData,
// // // // // // // // //                                         classId: item.classId,
// // // // // // // // //                                         className: item.className,
// // // // // // // // //                                         sectionIds: [],
// // // // // // // // //                                         sectionNames: [],
// // // // // // // // //                                         subjectId: null,
// // // // // // // // //                                         subjectName: '',
// // // // // // // // //                                     });
// // // // // // // // //                                     setSelectAllSections(true);
// // // // // // // // //                                     setShowClassModal(false);
// // // // // // // // //                                 }}
// // // // // // // // //                             >
// // // // // // // // //                                 <View style={[styles.modalItemIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // //                                     <Icon name="school" size={20} color={theme.primary} />
// // // // // // // // //                                 </View>
// // // // // // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // // // // // //                                     {item.className}
// // // // // // // // //                                 </Text>
// // // // // // // // //                                 {formData.classId === item.classId && (
// // // // // // // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // // // // // // //                                 )}
// // // // // // // // //                             </TouchableOpacity>
// // // // // // // // //                         )}
// // // // // // // // //                     />
// // // // // // // // //                 </View>
// // // // // // // // //             </View>
// // // // // // // // //         </Modal>
// // // // // // // // //     );

// // // // // // // // //     const renderSectionModal = () => (
// // // // // // // // //         <Modal visible={showSectionModal} transparent animationType="slide" onRequestClose={() => setShowSectionModal(false)}>
// // // // // // // // //             <View style={styles.modalOverlay}>
// // // // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // // // //                     <View style={styles.modalHeader}>
// // // // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Sections</Text>
// // // // // // // // //                         <TouchableOpacity onPress={() => setShowSectionModal(false)}>
// // // // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // // // //                         </TouchableOpacity>
// // // // // // // // //                     </View>
                    
// // // // // // // // //                     {sections.length > 1 && (
// // // // // // // // //                         <TouchableOpacity
// // // // // // // // //                             style={[styles.selectAllButton, { borderBottomColor: theme.border }]}
// // // // // // // // //                             onPress={toggleSelectAllSections}
// // // // // // // // //                         >
// // // // // // // // //                             <Icon 
// // // // // // // // //                                 name={selectAllSections ? "check-box" : "check-box-outline-blank"} 
// // // // // // // // //                                 size={22} 
// // // // // // // // //                                 color={theme.primary} 
// // // // // // // // //                             />
// // // // // // // // //                             <Text style={[styles.selectAllText, { color: theme.text }]}>
// // // // // // // // //                                 {selectAllSections ? 'Deselect All' : 'Select All Sections'}
// // // // // // // // //                             </Text>
// // // // // // // // //                         </TouchableOpacity>
// // // // // // // // //                     )}
                    
// // // // // // // // //                     <FlatList
// // // // // // // // //                         data={sections}
// // // // // // // // //                         keyExtractor={(item) => item.sectionId?.toString()}
// // // // // // // // //                         renderItem={({ item }) => {
// // // // // // // // //                             const isSelected = formData.sectionIds.includes(item.sectionId);
// // // // // // // // //                             return (
// // // // // // // // //                                 <TouchableOpacity
// // // // // // // // //                                     style={[styles.modalItem, isSelected && { backgroundColor: theme.primary + '10' }]}
// // // // // // // // //                                     onPress={() => toggleSection(item)}
// // // // // // // // //                                 >
// // // // // // // // //                                     <Icon 
// // // // // // // // //                                         name={isSelected ? "check-box" : "check-box-outline-blank"} 
// // // // // // // // //                                         size={22} 
// // // // // // // // //                                         color={isSelected ? theme.primary : theme.textSecondary} 
// // // // // // // // //                                     />
// // // // // // // // //                                     <Text style={[styles.modalItemText, { color: theme.text, marginLeft: 12 }]}>
// // // // // // // // //                                         Section {item.sectionName}
// // // // // // // // //                                     </Text>
// // // // // // // // //                                 </TouchableOpacity>
// // // // // // // // //                             );
// // // // // // // // //                         }}
// // // // // // // // //                     />
// // // // // // // // //                     <View style={styles.modalFooter}>
// // // // // // // // //                         <TouchableOpacity
// // // // // // // // //                             style={[styles.confirmButton, { backgroundColor: theme.primary }]}
// // // // // // // // //                             onPress={() => setShowSectionModal(false)}
// // // // // // // // //                         >
// // // // // // // // //                             <Text style={styles.confirmButtonText}>
// // // // // // // // //                                 Confirm ({formData.sectionIds.length} selected)
// // // // // // // // //                             </Text>
// // // // // // // // //                         </TouchableOpacity>
// // // // // // // // //                     </View>
// // // // // // // // //                 </View>
// // // // // // // // //             </View>
// // // // // // // // //         </Modal>
// // // // // // // // //     );

// // // // // // // // //     const renderSubjectModal = () => (
// // // // // // // // //         <Modal visible={showSubjectModal} transparent animationType="slide" onRequestClose={() => setShowSubjectModal(false)}>
// // // // // // // // //             <View style={styles.modalOverlay}>
// // // // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // // // //                     <View style={styles.modalHeader}>
// // // // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Subject</Text>
// // // // // // // // //                         <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
// // // // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // // // //                         </TouchableOpacity>
// // // // // // // // //                     </View>
// // // // // // // // //                     <FlatList
// // // // // // // // //                         data={subjects}
// // // // // // // // //                         keyExtractor={(item) => item.subjectId?.toString()}
// // // // // // // // //                         renderItem={({ item }) => (
// // // // // // // // //                             <TouchableOpacity
// // // // // // // // //                                 style={[
// // // // // // // // //                                     styles.modalItem,
// // // // // // // // //                                     formData.subjectId === item.subjectId && { backgroundColor: theme.primary + '15' }
// // // // // // // // //                                 ]}
// // // // // // // // //                                 onPress={() => {
// // // // // // // // //                                     setFormData({
// // // // // // // // //                                         ...formData,
// // // // // // // // //                                         subjectId: item.subjectId,
// // // // // // // // //                                         subjectName: item.subjectName,
// // // // // // // // //                                     });
// // // // // // // // //                                     setShowSubjectModal(false);
// // // // // // // // //                                 }}
// // // // // // // // //                             >
// // // // // // // // //                                 <View style={[styles.subjectDot, { backgroundColor: item.colorCode || theme.primary }]} />
// // // // // // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // // // // // //                                     {item.subjectName}
// // // // // // // // //                                 </Text>
// // // // // // // // //                                 {formData.subjectId === item.subjectId && (
// // // // // // // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // // // // // // //                                 )}
// // // // // // // // //                             </TouchableOpacity>
// // // // // // // // //                         )}
// // // // // // // // //                     />
// // // // // // // // //                 </View>
// // // // // // // // //             </View>
// // // // // // // // //         </Modal>
// // // // // // // // //     );

// // // // // // // // //     if (classesLoading) {
// // // // // // // // //         return (
// // // // // // // // //             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
// // // // // // // // //                 <ActivityIndicator size="large" color={theme.primary} />
// // // // // // // // //             </View>
// // // // // // // // //         );
// // // // // // // // //     }

// // // // // // // // //     return (
// // // // // // // // //         <KeyboardAvoidingView 
// // // // // // // // //             style={[styles.container, { backgroundColor: theme.background }]}
// // // // // // // // //             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // // // // // // // //             keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
// // // // // // // // //         >
// // // // // // // // //             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // // // // // //                 <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
// // // // // // // // //                     <Icon name="arrow-back" size={24} color={theme.text} />
// // // // // // // // //                 </TouchableOpacity>
// // // // // // // // //                 <Text style={[styles.headerTitle, { color: theme.text }]}>
// // // // // // // // //                     {editEntry ? 'Edit Diary' : 'Create Diary'}
// // // // // // // // //                 </Text>
// // // // // // // // //                 <View style={styles.headerButton} />
// // // // // // // // //             </View>

// // // // // // // // //             <ScrollView 
// // // // // // // // //                 style={styles.scrollView} 
// // // // // // // // //                 showsVerticalScrollIndicator={false}
// // // // // // // // //                 contentContainerStyle={styles.scrollContent}
// // // // // // // // //             >
// // // // // // // // //                 {/* Selection Row */}
// // // // // // // // //                 <View style={styles.selectionRow}>
// // // // // // // // //                     <TouchableOpacity
// // // // // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // // // // //                         onPress={() => setShowClassModal(true)}
// // // // // // // // //                         activeOpacity={0.7}
// // // // // // // // //                     >
// // // // // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // //                             <Icon name="school" size={22} color={theme.primary} />
// // // // // // // // //                         </View>
// // // // // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Class</Text>
// // // // // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // // // // //                             {formData.className || 'Select'}
// // // // // // // // //                         </Text>
// // // // // // // // //                     </TouchableOpacity>

// // // // // // // // //                     <TouchableOpacity
// // // // // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // // // // //                         onPress={() => formData.classId ? setShowSectionModal(true) : Alert.alert('Info', 'Select class first')}
// // // // // // // // //                         activeOpacity={0.7}
// // // // // // // // //                     >
// // // // // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // //                             <Icon name="groups" size={22} color={theme.primary} />
// // // // // // // // //                         </View>
// // // // // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Sections</Text>
// // // // // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // // // // //                             {formData.sectionIds.length ? `${formData.sectionIds.length} selected` : 'Select'}
// // // // // // // // //                         </Text>
// // // // // // // // //                     </TouchableOpacity>

// // // // // // // // //                     <TouchableOpacity
// // // // // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // // // // //                         onPress={() => formData.classId && formData.sectionIds.length ? setShowSubjectModal(true) : Alert.alert('Info', 'Select class & sections first')}
// // // // // // // // //                         activeOpacity={0.7}
// // // // // // // // //                     >
// // // // // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // //                             <Icon name="book" size={22} color={theme.primary} />
// // // // // // // // //                         </View>
// // // // // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Subject</Text>
// // // // // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // // // // //                             {formData.subjectName || 'Select'}
// // // // // // // // //                         </Text>
// // // // // // // // //                     </TouchableOpacity>
// // // // // // // // //                 </View>

// // // // // // // // //                 {/* Selected Sections Tags */}
// // // // // // // // //                 {formData.sectionIds.length > 0 && (
// // // // // // // // //                     <View style={[styles.tagsContainer, { backgroundColor: theme.card }]}>
// // // // // // // // //                         <Text style={[styles.tagsLabel, { color: theme.textSecondary }]}>Selected:</Text>
// // // // // // // // //                         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
// // // // // // // // //                             {formData.sectionNames.map((name, index) => (
// // // // // // // // //                                 <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // // //                                     <Text style={[styles.tagText, { color: theme.primary }]}>Sec {name}</Text>
// // // // // // // // //                                 </View>
// // // // // // // // //                             ))}
// // // // // // // // //                         </ScrollView>
// // // // // // // // //                     </View>
// // // // // // // // //                 )}

// // // // // // // // //                 {/* Rich Text Editor with Image Support */}
// // // // // // // // //                 <View style={[styles.editorCard, { backgroundColor: theme.card }]}>
// // // // // // // // //                     <View style={styles.editorHeader}>
// // // // // // // // //                         <Icon name="edit-note" size={20} color={theme.primary} />
// // // // // // // // //                         <Text style={[styles.editorTitle, { color: theme.text }]}>Diary Content</Text>
// // // // // // // // //                     </View>
                    
// // // // // // // // //                     <View style={[styles.editorWrapper, { borderColor: theme.border }]}>
// // // // // // // // //                         <RichToolbar
// // // // // // // // //                             editor={richTextRef}
// // // // // // // // //                             actions={[
// // // // // // // // //                                 actions.setBold,
// // // // // // // // //                                 actions.setItalic,
// // // // // // // // //                                 actions.setUnderline,
// // // // // // // // //                                 actions.insertBulletsList,
// // // // // // // // //                                 actions.insertOrderedList,
// // // // // // // // //                                 actions.setAlignLeft,
// // // // // // // // //                                 actions.setAlignCenter,
// // // // // // // // //                                 actions.setAlignRight,
// // // // // // // // //                                 actions.insertImage, // 👈 Image button
// // // // // // // // //                                 actions.undo,
// // // // // // // // //                                 actions.redo,
// // // // // // // // //                             ]}
// // // // // // // // //                             iconMap={{
// // // // // // // // //                                 [actions.setBold]: ({ tintColor }) => <Icon name="format-bold" size={20} color={tintColor} />,
// // // // // // // // //                                 [actions.setItalic]: ({ tintColor }) => <Icon name="format-italic" size={20} color={tintColor} />,
// // // // // // // // //                                 [actions.setUnderline]: ({ tintColor }) => <Icon name="format-underlined" size={20} color={tintColor} />,
// // // // // // // // //                                 [actions.insertBulletsList]: ({ tintColor }) => <Icon name="format-list-bulleted" size={20} color={tintColor} />,
// // // // // // // // //                                 [actions.insertOrderedList]: ({ tintColor }) => <Icon name="format-list-numbered" size={20} color={tintColor} />,
// // // // // // // // //                                 [actions.setAlignLeft]: ({ tintColor }) => <Icon name="format-align-left" size={20} color={tintColor} />,
// // // // // // // // //                                 [actions.setAlignCenter]: ({ tintColor }) => <Icon name="format-align-center" size={20} color={tintColor} />,
// // // // // // // // //                                 [actions.setAlignRight]: ({ tintColor }) => <Icon name="format-align-right" size={20} color={tintColor} />,
// // // // // // // // //                                 [actions.insertImage]: ({ tintColor }) => (
// // // // // // // // //                                     <Icon name="image" size={22} color={tintColor} />
// // // // // // // // //                                 ),
// // // // // // // // //                                 [actions.undo]: ({ tintColor }) => <Icon name="undo" size={20} color={tintColor} />,
// // // // // // // // //                                 [actions.redo]: ({ tintColor }) => <Icon name="redo" size={20} color={tintColor} />,
// // // // // // // // //                             }}
// // // // // // // // //                             style={[styles.toolbar, { backgroundColor: theme.background, borderBottomColor: theme.border }]}
// // // // // // // // //                             onPressAddImage={pickAndInsertImage} // 👈 Custom image handler
// // // // // // // // //                         />
// // // // // // // // //                         <RichEditor
// // // // // // // // //                             ref={richTextRef}
// // // // // // // // //                             initialContentHTML={formData.content}
// // // // // // // // //                             onChange={(html) => setFormData({ ...formData, content: html })}
// // // // // // // // //                             editorStyle={{
// // // // // // // // //                                 backgroundColor: theme.background,
// // // // // // // // //                                 color: theme.text,
// // // // // // // // //                                 placeholderColor: theme.textSecondary,
// // // // // // // // //                                 contentCSS: `body { 
// // // // // // // // //                                     font-family: -apple-system; 
// // // // // // // // //                                     font-size: 16px; 
// // // // // // // // //                                     padding: 16px; 
// // // // // // // // //                                     line-height: 1.5;
// // // // // // // // //                                 }
// // // // // // // // //                                 img { 
// // // // // // // // //                                     max-width: 100%; 
// // // // // // // // //                                     height: auto; 
// // // // // // // // //                                     border-radius: 12px; 
// // // // // // // // //                                     margin: 10px 0;
// // // // // // // // //                                     box-shadow: 0 2px 8px rgba(0,0,0,0.1);
// // // // // // // // //                                 }`,
// // // // // // // // //                             }}
// // // // // // // // //                             placeholder="Write your diary entry here... Use the image button to add pictures"
// // // // // // // // //                             style={[styles.editor, { backgroundColor: theme.background, height: editorHeight }]}
// // // // // // // // //                             onLoadEnd={() => setEditorHeight(1500)}
// // // // // // // // //                         />
// // // // // // // // //                     </View>
// // // // // // // // //                 </View>

// // // // // // // // //                 {/* Action Buttons */}
// // // // // // // // //                 <View style={styles.actionsContainer}>
// // // // // // // // //                     <TouchableOpacity
// // // // // // // // //                         style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15' }]}
// // // // // // // // //                         onPress={() => handleSave(false)}
// // // // // // // // //                         disabled={isSaving || uploadingImage}
// // // // // // // // //                     >
// // // // // // // // //                         {isSaving ? (
// // // // // // // // //                             <ActivityIndicator size="small" color={theme.warning} />
// // // // // // // // //                         ) : (
// // // // // // // // //                             <>
// // // // // // // // //                                 <Icon name="save" size={20} color={theme.warning} />
// // // // // // // // //                                 <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>
// // // // // // // // //                             </>
// // // // // // // // //                         )}
// // // // // // // // //                     </TouchableOpacity>

// // // // // // // // //                     <TouchableOpacity
// // // // // // // // //                         style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
// // // // // // // // //                         onPress={() => handleSave(true)}
// // // // // // // // //                         disabled={isSaving || uploadingImage}
// // // // // // // // //                     >
// // // // // // // // //                         {isSaving ? (
// // // // // // // // //                             <ActivityIndicator size="small" color="#FFF" />
// // // // // // // // //                         ) : (
// // // // // // // // //                             <>
// // // // // // // // //                                 <Icon name="send" size={20} color="#FFF" />
// // // // // // // // //                                 <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>
// // // // // // // // //                             </>
// // // // // // // // //                         )}
// // // // // // // // //                     </TouchableOpacity>
// // // // // // // // //                 </View>
// // // // // // // // //             </ScrollView>

// // // // // // // // //             {renderClassModal()}
// // // // // // // // //             {renderSectionModal()}
// // // // // // // // //             {renderSubjectModal()}
// // // // // // // // //         </KeyboardAvoidingView>
// // // // // // // // //     );
// // // // // // // // // };

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //     container: {
// // // // // // // // //         flex: 1,
// // // // // // // // //     },
// // // // // // // // //     loadingContainer: {
// // // // // // // // //         flex: 1,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //     },
// // // // // // // // //     header: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // //         paddingHorizontal: 16,
// // // // // // // // //         paddingVertical: 14,
// // // // // // // // //         borderBottomWidth: 1,
// // // // // // // // //     },
// // // // // // // // //     headerButton: {
// // // // // // // // //         width: 40,
// // // // // // // // //         height: 40,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //     },
// // // // // // // // //     headerTitle: {
// // // // // // // // //         fontSize: 18,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // //     scrollView: {
// // // // // // // // //         flex: 1,
// // // // // // // // //     },
// // // // // // // // //     scrollContent: {
// // // // // // // // //         padding: 16,
// // // // // // // // //         paddingBottom: 30,
// // // // // // // // //     },
// // // // // // // // //     selectionRow: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         gap: 12,
// // // // // // // // //         marginBottom: 16,
// // // // // // // // //     },
// // // // // // // // //     selectionCard: {
// // // // // // // // //         flex: 1,
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         paddingVertical: 14,
// // // // // // // // //         paddingHorizontal: 8,
// // // // // // // // //         borderRadius: 12,
// // // // // // // // //         borderWidth: 1,
// // // // // // // // //     },
// // // // // // // // //     cardIcon: {
// // // // // // // // //         width: 44,
// // // // // // // // //         height: 44,
// // // // // // // // //         borderRadius: 22,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         marginBottom: 8,
// // // // // // // // //     },
// // // // // // // // //     cardLabel: {
// // // // // // // // //         fontSize: 11,
// // // // // // // // //         marginBottom: 2,
// // // // // // // // //     },
// // // // // // // // //     cardValue: {
// // // // // // // // //         fontSize: 12,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //         textAlign: 'center',
// // // // // // // // //     },
// // // // // // // // //     tagsContainer: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         paddingHorizontal: 12,
// // // // // // // // //         paddingVertical: 10,
// // // // // // // // //         borderRadius: 10,
// // // // // // // // //         marginBottom: 16,
// // // // // // // // //         gap: 8,
// // // // // // // // //     },
// // // // // // // // //     tagsLabel: {
// // // // // // // // //         fontSize: 12,
// // // // // // // // //     },
// // // // // // // // //     tagsScroll: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //     },
// // // // // // // // //     tag: {
// // // // // // // // //         paddingHorizontal: 10,
// // // // // // // // //         paddingVertical: 4,
// // // // // // // // //         borderRadius: 16,
// // // // // // // // //         marginRight: 6,
// // // // // // // // //     },
// // // // // // // // //     tagText: {
// // // // // // // // //         fontSize: 11,
// // // // // // // // //         fontWeight: '500',
// // // // // // // // //     },
// // // // // // // // //     editorCard: {
// // // // // // // // //         borderRadius: 16,
// // // // // // // // //         overflow: 'hidden',
// // // // // // // // //         marginBottom: 20,
// // // // // // // // //     },
// // // // // // // // //     editorHeader: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         padding: 14,
// // // // // // // // //         gap: 8,
// // // // // // // // //     },
// // // // // // // // //     editorTitle: {
// // // // // // // // //         fontSize: 14,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // //     editorWrapper: {
// // // // // // // // //         borderTopWidth: 1,
// // // // // // // // //     },
// // // // // // // // //     toolbar: {
// // // // // // // // //         borderBottomWidth: 1,
// // // // // // // // //         minHeight: 48,
// // // // // // // // //         paddingHorizontal: 8,
// // // // // // // // //     },
// // // // // // // // //     editor: {
// // // // // // // // //         minHeight: 1000,
// // // // // // // // //         padding: 0,
// // // // // // // // //         border:"5px solid red"
// // // // // // // // //     },
// // // // // // // // //     actionsContainer: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         gap: 12,
// // // // // // // // //     },
// // // // // // // // //     actionButton: {
// // // // // // // // //         flex: 1,
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         paddingVertical: 14,
// // // // // // // // //         borderRadius: 12,
// // // // // // // // //         gap: 10,
// // // // // // // // //     },
// // // // // // // // //     draftButton: {
// // // // // // // // //         borderWidth: 1,
// // // // // // // // //         borderColor: 'transparent',
// // // // // // // // //     },
// // // // // // // // //     publishButton: {
// // // // // // // // //         elevation: 2,
// // // // // // // // //         shadowColor: '#000',
// // // // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // // // //         shadowOpacity: 0.1,
// // // // // // // // //         shadowRadius: 4,
// // // // // // // // //     },
// // // // // // // // //     actionButtonText: {
// // // // // // // // //         fontSize: 15,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // //     modalOverlay: {
// // // // // // // // //         flex: 1,
// // // // // // // // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // // //         justifyContent: 'flex-end',
// // // // // // // // //     },
// // // // // // // // //     modalContent: {
// // // // // // // // //         borderTopLeftRadius: 24,
// // // // // // // // //         borderTopRightRadius: 24,
// // // // // // // // //         padding: 20,
// // // // // // // // //         maxHeight: '75%',
// // // // // // // // //     },
// // // // // // // // //     modalHeader: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         justifyContent: 'space-between',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         marginBottom: 20,
// // // // // // // // //     },
// // // // // // // // //     modalTitle: {
// // // // // // // // //         fontSize: 20,
// // // // // // // // //         fontWeight: 'bold',
// // // // // // // // //     },
// // // // // // // // //     selectAllButton: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         paddingVertical: 12,
// // // // // // // // //         marginBottom: 8,
// // // // // // // // //         borderBottomWidth: 1,
// // // // // // // // //         gap: 12,
// // // // // // // // //     },
// // // // // // // // //     selectAllText: {
// // // // // // // // //         fontSize: 15,
// // // // // // // // //         fontWeight: '500',
// // // // // // // // //     },
// // // // // // // // //     modalItem: {
// // // // // // // // //         flexDirection: 'row',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //         padding: 14,
// // // // // // // // //         borderRadius: 12,
// // // // // // // // //         marginBottom: 8,
// // // // // // // // //         gap: 12,
// // // // // // // // //     },
// // // // // // // // //     modalItemIcon: {
// // // // // // // // //         width: 40,
// // // // // // // // //         height: 40,
// // // // // // // // //         borderRadius: 20,
// // // // // // // // //         justifyContent: 'center',
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //     },
// // // // // // // // //     modalItemText: {
// // // // // // // // //         fontSize: 15,
// // // // // // // // //     },
// // // // // // // // //     subjectDot: {
// // // // // // // // //         width: 12,
// // // // // // // // //         height: 12,
// // // // // // // // //         borderRadius: 6,
// // // // // // // // //     },
// // // // // // // // //     modalFooter: {
// // // // // // // // //         marginTop: 16,
// // // // // // // // //     },
// // // // // // // // //     confirmButton: {
// // // // // // // // //         paddingVertical: 14,
// // // // // // // // //         borderRadius: 12,
// // // // // // // // //         alignItems: 'center',
// // // // // // // // //     },
// // // // // // // // //     confirmButtonText: {
// // // // // // // // //         color: '#FFF',
// // // // // // // // //         fontSize: 15,
// // // // // // // // //         fontWeight: '600',
// // // // // // // // //     },
// // // // // // // // // });

// // // // // // // // // export default CreateDiaryScreen;


// // // // // // // // // CreateDiaryScreen.js
// // // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // // import {
// // // // // // // //     View,
// // // // // // // //     Text,
// // // // // // // //     StyleSheet,
// // // // // // // //     ScrollView,
// // // // // // // //     TouchableOpacity,
// // // // // // // //     ActivityIndicator,
// // // // // // // //     Alert,
// // // // // // // //     Modal,
// // // // // // // //     FlatList,
// // // // // // // //     Platform,
// // // // // // // //     KeyboardAvoidingView,
// // // // // // // //     Dimensions,
// // // // // // // //     SafeAreaView,
// // // // // // // // } from 'react-native';
// // // // // // // // import { useSelector } from 'react-redux';
// // // // // // // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // // // // // // import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// // // // // // // // import * as ImagePicker from 'expo-image-picker';
// // // // // // // // import * as ImageManipulator from 'expo-image-manipulator';
// // // // // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // // // // import { selectCurrentUser } from '../../store/slices/authSlice';
// // // // // // // // import {
// // // // // // // //     useGetTeacherClassesQuery,
// // // // // // // //     useGetSubjectsFromClassWiseQuery,
// // // // // // // //     useCreateBatchDiaryMutation,
// // // // // // // // } from '../../store/diaryApi';

// // // // // // // // const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// // // // // // // // const CreateDiaryScreen = ({ navigation, route }) => {
// // // // // // // //     const theme = useSelector(selectThemeData);
// // // // // // // //     const user = useSelector(selectCurrentUser);
// // // // // // // //     const richTextRef = useRef(null);
// // // // // // // //     const scrollViewRef = useRef(null);
// // // // // // // //     const [toolbarHeight, setToolbarHeight] = useState(0);
    
// // // // // // // //     const editEntry = route.params?.editEntry;

// // // // // // // //     const [formData, setFormData] = useState({
// // // // // // // //         classId: null,
// // // // // // // //         className: '',
// // // // // // // //         sectionIds: [],
// // // // // // // //         sectionNames: [],
// // // // // // // //         subjectId: null,
// // // // // // // //         subjectName: '',
// // // // // // // //         content: editEntry?.content || '<p><br></p>',
// // // // // // // //     });
    
// // // // // // // //     const [showClassModal, setShowClassModal] = useState(false);
// // // // // // // //     const [showSectionModal, setShowSectionModal] = useState(false);
// // // // // // // //     const [showSubjectModal, setShowSubjectModal] = useState(false);
// // // // // // // //     const [isSaving, setIsSaving] = useState(false);
// // // // // // // //     const [selectAllSections, setSelectAllSections] = useState(true);
// // // // // // // //     const [editorHeight, setEditorHeight] = useState(500);
// // // // // // // //     const [uploadingImage, setUploadingImage] = useState(false);

// // // // // // // //     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
// // // // // // // //     const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsFromClassWiseQuery(
// // // // // // // //         { classId: formData.classId },
// // // // // // // //         { skip: !formData.classId }
// // // // // // // //     );

// // // // // // // //     const [createBatchDiary] = useCreateBatchDiaryMutation();

// // // // // // // //     const classes = classesData?.data || [];
// // // // // // // //     const subjects = subjectsData?.data || [];
// // // // // // // //     const selectedClass = classes.find(c => c.classId === formData.classId);
// // // // // // // //     const sections = selectedClass?.sections || [];

// // // // // // // //     // Auto-select all sections when class changes
// // // // // // // //     useEffect(() => {
// // // // // // // //         if (selectedClass && sections.length > 0 && selectAllSections) {
// // // // // // // //             setFormData(prev => ({
// // // // // // // //                 ...prev,
// // // // // // // //                 sectionIds: sections.map(s => s.sectionId),
// // // // // // // //                 sectionNames: sections.map(s => s.sectionName),
// // // // // // // //             }));
// // // // // // // //         }
// // // // // // // //     }, [selectedClass, sections]);

// // // // // // // //     // IMAGE HANDLER - Base64 embedding
// // // // // // // //     const pickAndInsertImage = async () => {
// // // // // // // //         try {
// // // // // // // //             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// // // // // // // //             if (status !== 'granted') {
// // // // // // // //                 Alert.alert('Permission Required', 'Please grant camera roll permissions');
// // // // // // // //                 return;
// // // // // // // //             }

// // // // // // // //             const result = await ImagePicker.launchImageLibraryAsync({
// // // // // // // //                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
// // // // // // // //                 quality: 1,
// // // // // // // //                 allowsEditing: true,
// // // // // // // //             });

// // // // // // // //             if (result.canceled) return;

// // // // // // // //             const image = result.assets[0];

// // // // // // // //             if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
// // // // // // // //                 Alert.alert('Image Too Large', 'Please select an image smaller than 2MB');
// // // // // // // //                 return;
// // // // // // // //             }

// // // // // // // //             setUploadingImage(true);

// // // // // // // //             const manipulatedImage = await ImageManipulator.manipulateAsync(
// // // // // // // //                 image.uri,
// // // // // // // //                 [{ resize: { width: 600 } }],
// // // // // // // //                 {
// // // // // // // //                     compress: 0.5,
// // // // // // // //                     format: ImageManipulator.SaveFormat.JPEG,
// // // // // // // //                     base64: true,
// // // // // // // //                 }
// // // // // // // //             );

// // // // // // // //             const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;

// // // // // // // //             const imageHtml = `<div style="text-align: center; margin: 12px 0;">
// // // // // // // //                 <img src="${base64Image}" alt="Diary Image" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
// // // // // // // //             </div>`;

// // // // // // // //             richTextRef.current?.insertHTML(imageHtml);
            
// // // // // // // //             Alert.alert('Success', 'Image added to diary');
// // // // // // // //         } catch (error) {
// // // // // // // //             console.error('Image pick error:', error);
// // // // // // // //             Alert.alert('Error', 'Failed to add image');
// // // // // // // //         } finally {
// // // // // // // //             setUploadingImage(false);
// // // // // // // //         }
// // // // // // // //     };

// // // // // // // //     const toggleSelectAllSections = () => {
// // // // // // // //         if (selectAllSections) {
// // // // // // // //             setFormData(prev => ({
// // // // // // // //                 ...prev,
// // // // // // // //                 sectionIds: [],
// // // // // // // //                 sectionNames: [],
// // // // // // // //             }));
// // // // // // // //             setSelectAllSections(false);
// // // // // // // //         } else {
// // // // // // // //             setFormData(prev => ({
// // // // // // // //                 ...prev,
// // // // // // // //                 sectionIds: sections.map(s => s.sectionId),
// // // // // // // //                 sectionNames: sections.map(s => s.sectionName),
// // // // // // // //             }));
// // // // // // // //             setSelectAllSections(true);
// // // // // // // //         }
// // // // // // // //     };

// // // // // // // //     const toggleSection = (section) => {
// // // // // // // //         const isSelected = formData.sectionIds.includes(section.sectionId);
        
// // // // // // // //         if (isSelected) {
// // // // // // // //             setFormData(prev => ({
// // // // // // // //                 ...prev,
// // // // // // // //                 sectionIds: prev.sectionIds.filter(id => id !== section.sectionId),
// // // // // // // //                 sectionNames: prev.sectionNames.filter(name => name !== section.sectionName),
// // // // // // // //             }));
// // // // // // // //         } else {
// // // // // // // //             setFormData(prev => ({
// // // // // // // //                 ...prev,
// // // // // // // //                 sectionIds: [...prev.sectionIds, section.sectionId],
// // // // // // // //                 sectionNames: [...prev.sectionNames, section.sectionName],
// // // // // // // //             }));
// // // // // // // //         }
// // // // // // // //     };

// // // // // // // //     const handleSave = async (publish = false) => {
// // // // // // // //         if (!formData.classId) {
// // // // // // // //             Alert.alert('Error', 'Please select a class');
// // // // // // // //             return;
// // // // // // // //         }
// // // // // // // //         if (formData.sectionIds.length === 0) {
// // // // // // // //             Alert.alert('Error', 'Please select at least one section');
// // // // // // // //             return;
// // // // // // // //         }
// // // // // // // //         if (!formData.subjectId) {
// // // // // // // //             Alert.alert('Error', 'Please select a subject');
// // // // // // // //             return;
// // // // // // // //         }
        
// // // // // // // //         let htmlContent = formData.content;
// // // // // // // //         if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === ' ') {
// // // // // // // //             Alert.alert('Error', 'Please write some content');
// // // // // // // //             return;
// // // // // // // //         }

// // // // // // // //         setIsSaving(true);
// // // // // // // //         try {
// // // // // // // //             const diaryData = {
// // // // // // // //                 Date: new Date().toISOString().split('T')[0],
// // // // // // // //                 ClassID: formData.classId,
// // // // // // // //                 SectionIds: formData.sectionIds,
// // // // // // // //                 SubjectID: formData.subjectId,
// // // // // // // //                 ClassWork: null,
// // // // // // // //                 HomeWork: htmlContent,
// // // // // // // //                 CreatedBy: user?.id || 1,
// // // // // // // //                 isPublished: publish,
// // // // // // // //             };

// // // // // // // //             await createBatchDiary(diaryData).unwrap();
// // // // // // // //             Alert.alert('Success', `Diary ${publish ? 'published' : 'saved as draft'} successfully!`, [
// // // // // // // //                 { text: 'OK', onPress: () => navigation.goBack() }
// // // // // // // //             ]);
// // // // // // // //         } catch (error) {
// // // // // // // //             console.error('Save error:', error);
// // // // // // // //             Alert.alert('Error', error.data?.message || 'Failed to save diary');
// // // // // // // //         } finally {
// // // // // // // //             setIsSaving(false);
// // // // // // // //         }
// // // // // // // //     };

// // // // // // // //     const handleBack = () => {
// // // // // // // //         const hasContent = formData.content && 
// // // // // // // //                           formData.content !== '<p><br></p>' && 
// // // // // // // //                           formData.content !== ' ' &&
// // // // // // // //                           formData.content.length > 50;
        
// // // // // // // //         if (hasContent) {
// // // // // // // //             Alert.alert(
// // // // // // // //                 'Discard Changes',
// // // // // // // //                 'You have unsaved changes. Are you sure you want to leave?',
// // // // // // // //                 [
// // // // // // // //                     { text: 'Stay', style: 'cancel' },
// // // // // // // //                     { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
// // // // // // // //                 ]
// // // // // // // //             );
// // // // // // // //         } else {
// // // // // // // //             navigation.goBack();
// // // // // // // //         }
// // // // // // // //     };

// // // // // // // //     const renderClassModal = () => (
// // // // // // // //         <Modal visible={showClassModal} transparent animationType="slide" onRequestClose={() => setShowClassModal(false)}>
// // // // // // // //             <View style={styles.modalOverlay}>
// // // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // // //                     <View style={styles.modalHeader}>
// // // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Class</Text>
// // // // // // // //                         <TouchableOpacity onPress={() => setShowClassModal(false)}>
// // // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // // //                         </TouchableOpacity>
// // // // // // // //                     </View>
// // // // // // // //                     <FlatList
// // // // // // // //                         data={classes}
// // // // // // // //                         keyExtractor={(item) => item.classId?.toString()}
// // // // // // // //                         renderItem={({ item }) => (
// // // // // // // //                             <TouchableOpacity
// // // // // // // //                                 style={[
// // // // // // // //                                     styles.modalItem,
// // // // // // // //                                     formData.classId === item.classId && { backgroundColor: theme.primary + '15' }
// // // // // // // //                                 ]}
// // // // // // // //                                 onPress={() => {
// // // // // // // //                                     setFormData({
// // // // // // // //                                         ...formData,
// // // // // // // //                                         classId: item.classId,
// // // // // // // //                                         className: item.className,
// // // // // // // //                                         sectionIds: [],
// // // // // // // //                                         sectionNames: [],
// // // // // // // //                                         subjectId: null,
// // // // // // // //                                         subjectName: '',
// // // // // // // //                                     });
// // // // // // // //                                     setSelectAllSections(true);
// // // // // // // //                                     setShowClassModal(false);
// // // // // // // //                                 }}
// // // // // // // //                             >
// // // // // // // //                                 <View style={[styles.modalItemIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // //                                     <Icon name="school" size={20} color={theme.primary} />
// // // // // // // //                                 </View>
// // // // // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // // // // //                                     {item.className}
// // // // // // // //                                 </Text>
// // // // // // // //                                 {formData.classId === item.classId && (
// // // // // // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // // // // // //                                 )}
// // // // // // // //                             </TouchableOpacity>
// // // // // // // //                         )}
// // // // // // // //                     />
// // // // // // // //                 </View>
// // // // // // // //             </View>
// // // // // // // //         </Modal>
// // // // // // // //     );

// // // // // // // //     const renderSectionModal = () => (
// // // // // // // //         <Modal visible={showSectionModal} transparent animationType="slide" onRequestClose={() => setShowSectionModal(false)}>
// // // // // // // //             <View style={styles.modalOverlay}>
// // // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // // //                     <View style={styles.modalHeader}>
// // // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Sections</Text>
// // // // // // // //                         <TouchableOpacity onPress={() => setShowSectionModal(false)}>
// // // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // // //                         </TouchableOpacity>
// // // // // // // //                     </View>
                    
// // // // // // // //                     {sections.length > 1 && (
// // // // // // // //                         <TouchableOpacity
// // // // // // // //                             style={[styles.selectAllButton, { borderBottomColor: theme.border }]}
// // // // // // // //                             onPress={toggleSelectAllSections}
// // // // // // // //                         >
// // // // // // // //                             <Icon 
// // // // // // // //                                 name={selectAllSections ? "check-box" : "check-box-outline-blank"} 
// // // // // // // //                                 size={22} 
// // // // // // // //                                 color={theme.primary} 
// // // // // // // //                             />
// // // // // // // //                             <Text style={[styles.selectAllText, { color: theme.text }]}>
// // // // // // // //                                 {selectAllSections ? 'Deselect All' : 'Select All Sections'}
// // // // // // // //                             </Text>
// // // // // // // //                         </TouchableOpacity>
// // // // // // // //                     )}
                    
// // // // // // // //                     <FlatList
// // // // // // // //                         data={sections}
// // // // // // // //                         keyExtractor={(item) => item.sectionId?.toString()}
// // // // // // // //                         renderItem={({ item }) => {
// // // // // // // //                             const isSelected = formData.sectionIds.includes(item.sectionId);
// // // // // // // //                             return (
// // // // // // // //                                 <TouchableOpacity
// // // // // // // //                                     style={[styles.modalItem, isSelected && { backgroundColor: theme.primary + '10' }]}
// // // // // // // //                                     onPress={() => toggleSection(item)}
// // // // // // // //                                 >
// // // // // // // //                                     <Icon 
// // // // // // // //                                         name={isSelected ? "check-box" : "check-box-outline-blank"} 
// // // // // // // //                                         size={22} 
// // // // // // // //                                         color={isSelected ? theme.primary : theme.textSecondary} 
// // // // // // // //                                     />
// // // // // // // //                                     <Text style={[styles.modalItemText, { color: theme.text, marginLeft: 12 }]}>
// // // // // // // //                                         Section {item.sectionName}
// // // // // // // //                                     </Text>
// // // // // // // //                                 </TouchableOpacity>
// // // // // // // //                             );
// // // // // // // //                         }}
// // // // // // // //                     />
// // // // // // // //                     <View style={styles.modalFooter}>
// // // // // // // //                         <TouchableOpacity
// // // // // // // //                             style={[styles.confirmButton, { backgroundColor: theme.primary }]}
// // // // // // // //                             onPress={() => setShowSectionModal(false)}
// // // // // // // //                         >
// // // // // // // //                             <Text style={styles.confirmButtonText}>
// // // // // // // //                                 Confirm ({formData.sectionIds.length} selected)
// // // // // // // //                             </Text>
// // // // // // // //                         </TouchableOpacity>
// // // // // // // //                     </View>
// // // // // // // //                 </View>
// // // // // // // //             </View>
// // // // // // // //         </Modal>
// // // // // // // //     );

// // // // // // // //     const renderSubjectModal = () => (
// // // // // // // //         <Modal visible={showSubjectModal} transparent animationType="slide" onRequestClose={() => setShowSubjectModal(false)}>
// // // // // // // //             <View style={styles.modalOverlay}>
// // // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // // //                     <View style={styles.modalHeader}>
// // // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Subject</Text>
// // // // // // // //                         <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
// // // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // // //                         </TouchableOpacity>
// // // // // // // //                     </View>
// // // // // // // //                     <FlatList
// // // // // // // //                         data={subjects}
// // // // // // // //                         keyExtractor={(item) => item.subjectId?.toString()}
// // // // // // // //                         renderItem={({ item }) => (
// // // // // // // //                             <TouchableOpacity
// // // // // // // //                                 style={[
// // // // // // // //                                     styles.modalItem,
// // // // // // // //                                     formData.subjectId === item.subjectId && { backgroundColor: theme.primary + '15' }
// // // // // // // //                                 ]}
// // // // // // // //                                 onPress={() => {
// // // // // // // //                                     setFormData({
// // // // // // // //                                         ...formData,
// // // // // // // //                                         subjectId: item.subjectId,
// // // // // // // //                                         subjectName: item.subjectName,
// // // // // // // //                                     });
// // // // // // // //                                     setShowSubjectModal(false);
// // // // // // // //                                 }}
// // // // // // // //                             >
// // // // // // // //                                 <View style={[styles.subjectDot, { backgroundColor: item.colorCode || theme.primary }]} />
// // // // // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // // // // //                                     {item.subjectName}
// // // // // // // //                                 </Text>
// // // // // // // //                                 {formData.subjectId === item.subjectId && (
// // // // // // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // // // // // //                                 )}
// // // // // // // //                             </TouchableOpacity>
// // // // // // // //                         )}
// // // // // // // //                     />
// // // // // // // //                 </View>
// // // // // // // //             </View>
// // // // // // // //         </Modal>
// // // // // // // //     );

// // // // // // // //     if (classesLoading) {
// // // // // // // //         return (
// // // // // // // //             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
// // // // // // // //                 <ActivityIndicator size="large" color={theme.primary} />
// // // // // // // //             </View>
// // // // // // // //         );
// // // // // // // //     }

// // // // // // // //     return (
// // // // // // // //         <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
// // // // // // // //             {/* Fixed Header */}
// // // // // // // //             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // // // // //                 <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
// // // // // // // //                     <Icon name="arrow-back" size={24} color={theme.text} />
// // // // // // // //                 </TouchableOpacity>
// // // // // // // //                 <Text style={[styles.headerTitle, { color: theme.text }]}>
// // // // // // // //                     {editEntry ? 'Edit Diary' : 'Create Diary'}
// // // // // // // //                 </Text>
// // // // // // // //                 <View style={styles.headerButton} />
// // // // // // // //             </View>

// // // // // // // //             {/* Fixed Selection Cards */}
// // // // // // // //             <View style={[styles.fixedSelectionContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
// // // // // // // //                 <View style={styles.selectionRow}>
// // // // // // // //                     <TouchableOpacity
// // // // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // // // //                         onPress={() => setShowClassModal(true)}
// // // // // // // //                         activeOpacity={0.7}
// // // // // // // //                     >
// // // // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // //                             <Icon name="school" size={22} color={theme.primary} />
// // // // // // // //                         </View>
// // // // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Class</Text>
// // // // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // // // //                             {formData.className || 'Select'}
// // // // // // // //                         </Text>
// // // // // // // //                     </TouchableOpacity>

// // // // // // // //                     <TouchableOpacity
// // // // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // // // //                         onPress={() => formData.classId ? setShowSectionModal(true) : Alert.alert('Info', 'Select class first')}
// // // // // // // //                         activeOpacity={0.7}
// // // // // // // //                     >
// // // // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // //                             <Icon name="groups" size={22} color={theme.primary} />
// // // // // // // //                         </View>
// // // // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Sections</Text>
// // // // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // // // //                             {formData.sectionIds.length ? `${formData.sectionIds.length} selected` : 'Select'}
// // // // // // // //                         </Text>
// // // // // // // //                     </TouchableOpacity>

// // // // // // // //                     <TouchableOpacity
// // // // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // // // //                         onPress={() => formData.classId && formData.sectionIds.length ? setShowSubjectModal(true) : Alert.alert('Info', 'Select class & sections first')}
// // // // // // // //                         activeOpacity={0.7}
// // // // // // // //                     >
// // // // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // //                             <Icon name="book" size={22} color={theme.primary} />
// // // // // // // //                         </View>
// // // // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Subject</Text>
// // // // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // // // //                             {formData.subjectName || 'Select'}
// // // // // // // //                         </Text>
// // // // // // // //                     </TouchableOpacity>
// // // // // // // //                 </View>

// // // // // // // //                 {/* Selected Sections Tags */}
// // // // // // // //                 {formData.sectionIds.length > 0 && (
// // // // // // // //                     <View style={[styles.tagsContainer, { backgroundColor: theme.card }]}>
// // // // // // // //                         <Text style={[styles.tagsLabel, { color: theme.textSecondary }]}>Selected:</Text>
// // // // // // // //                         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
// // // // // // // //                             {formData.sectionNames.map((name, index) => (
// // // // // // // //                                 <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '15' }]}>
// // // // // // // //                                     <Text style={[styles.tagText, { color: theme.primary }]}>Sec {name}</Text>
// // // // // // // //                                 </View>
// // // // // // // //                             ))}
// // // // // // // //                         </ScrollView>
// // // // // // // //                     </View>
// // // // // // // //                 )}
// // // // // // // //             </View>

// // // // // // // //             {/* STICKY TOOLBAR - Outside ScrollView */}
// // // // // // // //             <View 
// // // // // // // //                 style={[styles.stickyToolbar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}
// // // // // // // //                 onLayout={(event) => setToolbarHeight(event.nativeEvent.layout.height)}
// // // // // // // //             >
// // // // // // // //                 <RichToolbar
// // // // // // // //                     editor={richTextRef}
// // // // // // // //                     actions={[
// // // // // // // //                         actions.setBold,
// // // // // // // //                         actions.setItalic,
// // // // // // // //                         actions.setUnderline,
// // // // // // // //                         actions.insertBulletsList,
// // // // // // // //                         actions.insertOrderedList,
// // // // // // // //                         actions.setAlignLeft,
// // // // // // // //                         actions.setAlignCenter,
// // // // // // // //                         actions.setAlignRight,
// // // // // // // //                         actions.undo,
// // // // // // // //                         actions.redo,
// // // // // // // //                     ]}
// // // // // // // //                     iconMap={{
// // // // // // // //                         [actions.setBold]: ({ tintColor }) => <Icon name="format-bold" size={22} color={tintColor} />,
// // // // // // // //                         [actions.setItalic]: ({ tintColor }) => <Icon name="format-italic" size={22} color={tintColor} />,
// // // // // // // //                         [actions.setUnderline]: ({ tintColor }) => <Icon name="format-underlined" size={22} color={tintColor} />,
// // // // // // // //                         [actions.insertBulletsList]: ({ tintColor }) => <Icon name="format-list-bulleted" size={22} color={tintColor} />,
// // // // // // // //                         [actions.insertOrderedList]: ({ tintColor }) => <Icon name="format-list-numbered" size={22} color={tintColor} />,
// // // // // // // //                         [actions.setAlignLeft]: ({ tintColor }) => <Icon name="format-align-left" size={22} color={tintColor} />,
// // // // // // // //                         [actions.setAlignCenter]: ({ tintColor }) => <Icon name="format-align-center" size={22} color={tintColor} />,
// // // // // // // //                         [actions.setAlignRight]: ({ tintColor }) => <Icon name="format-align-right" size={22} color={tintColor} />,
// // // // // // // //                         [actions.undo]: ({ tintColor }) => <Icon name="undo" size={22} color={tintColor} />,
// // // // // // // //                         [actions.redo]: ({ tintColor }) => <Icon name="redo" size={22} color={tintColor} />,
// // // // // // // //                     }}
// // // // // // // //                     style={[styles.toolbar, { backgroundColor: theme.background }]}
// // // // // // // //                 />
                
// // // // // // // //                 {/* Image Button Row */}
// // // // // // // //                 <View style={[styles.imageButtonRow, { backgroundColor: theme.background }]}>
// // // // // // // //                     <TouchableOpacity
// // // // // // // //                         style={styles.imageButton}
// // // // // // // //                         onPress={pickAndInsertImage}
// // // // // // // //                         disabled={uploadingImage}
// // // // // // // //                     >
// // // // // // // //                         {uploadingImage ? (
// // // // // // // //                             <ActivityIndicator size="small" color={theme.primary} />
// // // // // // // //                         ) : (
// // // // // // // //                             <>
// // // // // // // //                                 <Icon name="image" size={22} color={theme.primary} />
// // // // // // // //                                 <Text style={[styles.imageButtonText, { color: theme.primary }]}>Insert Image</Text>
// // // // // // // //                             </>
// // // // // // // //                         )}
// // // // // // // //                     </TouchableOpacity>
// // // // // // // //                 </View>
// // // // // // // //             </View>

// // // // // // // //             {/* Scrollable Editor Area with proper padding for toolbar */}
// // // // // // // //             <ScrollView 
// // // // // // // //                 ref={scrollViewRef}
// // // // // // // //                 style={styles.scrollView} 
// // // // // // // //                 showsVerticalScrollIndicator={true}
// // // // // // // //                 keyboardShouldPersistTaps="handled"
// // // // // // // //                 contentContainerStyle={{ paddingBottom: 80 }}
// // // // // // // //             >
// // // // // // // //                 <View style={styles.editorContainer}>
// // // // // // // //                     <RichEditor
// // // // // // // //                         ref={richTextRef}
// // // // // // // //                         initialContentHTML={formData.content}
// // // // // // // //                         onChange={(html) => setFormData({ ...formData, content: html })}
// // // // // // // //                         editorStyle={{
// // // // // // // //                             backgroundColor: theme.background,
// // // // // // // //                             color: theme.text,
// // // // // // // //                             placeholderColor: theme.textSecondary,
// // // // // // // //                             contentCSS: `body { 
// // // // // // // //                                 font-family: -apple-system; 
// // // // // // // //                                 font-size: 16px; 
// // // // // // // //                                 padding: 16px; 
// // // // // // // //                                 line-height: 1.6;
// // // // // // // //                                 min-height: 600px;
// // // // // // // //                             }
// // // // // // // //                             img { 
// // // // // // // //                                 max-width: 100%; 
// // // // // // // //                                 height: auto; 
// // // // // // // //                                 border-radius: 12px; 
// // // // // // // //                                 margin: 10px 0;
// // // // // // // //                             }
// // // // // // // //                             p { margin-bottom: 12px; }
// // // // // // // //                             h1, h2, h3 { margin: 16px 0 8px; }`,
// // // // // // // //                         }}
// // // // // // // //                         placeholder="Write your diary entry here..."
// // // // // // // //                         style={[styles.editor, { backgroundColor: theme.background, height: editorHeight }]}
// // // // // // // //                         onLoadEnd={() => setEditorHeight(600)}
// // // // // // // //                     />
// // // // // // // //                 </View>
// // // // // // // //             </ScrollView>

// // // // // // // //             {/* Fixed Action Buttons at Bottom */}
// // // // // // // //             <View style={[styles.fixedActions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
// // // // // // // //                 <TouchableOpacity
// // // // // // // //                     style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15', borderColor: theme.warning }]}
// // // // // // // //                     onPress={() => handleSave(false)}
// // // // // // // //                     disabled={isSaving || uploadingImage}
// // // // // // // //                 >
// // // // // // // //                     {isSaving ? (
// // // // // // // //                         <ActivityIndicator size="small" color={theme.warning} />
// // // // // // // //                     ) : (
// // // // // // // //                         <>
// // // // // // // //                             <Icon name="save" size={20} color={theme.warning} />
// // // // // // // //                             <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>
// // // // // // // //                         </>
// // // // // // // //                     )}
// // // // // // // //                 </TouchableOpacity>

// // // // // // // //                 <TouchableOpacity
// // // // // // // //                     style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
// // // // // // // //                     onPress={() => handleSave(true)}
// // // // // // // //                     disabled={isSaving || uploadingImage}
// // // // // // // //                 >
// // // // // // // //                     {isSaving ? (
// // // // // // // //                         <ActivityIndicator size="small" color="#FFF" />
// // // // // // // //                     ) : (
// // // // // // // //                         <>
// // // // // // // //                             <Icon name="send" size={20} color="#FFF" />
// // // // // // // //                             <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>
// // // // // // // //                         </>
// // // // // // // //                     )}
// // // // // // // //                 </TouchableOpacity>
// // // // // // // //             </View>

// // // // // // // //             {renderClassModal()}
// // // // // // // //             {renderSectionModal()}
// // // // // // // //             {renderSubjectModal()}
// // // // // // // //         </SafeAreaView>
// // // // // // // //     );
// // // // // // // // };

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //     safeArea: {
// // // // // // // //         flex: 1,
// // // // // // // //     },
// // // // // // // //     loadingContainer: {
// // // // // // // //         flex: 1,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //     },
// // // // // // // //     header: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         justifyContent: 'space-between',
// // // // // // // //         paddingHorizontal: 16,
// // // // // // // //         paddingVertical: 14,
// // // // // // // //         borderBottomWidth: 1,
// // // // // // // //     },
// // // // // // // //     headerButton: {
// // // // // // // //         width: 40,
// // // // // // // //         height: 40,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //     },
// // // // // // // //     headerTitle: {
// // // // // // // //         fontSize: 18,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // //     fixedSelectionContainer: {
// // // // // // // //         paddingHorizontal: 16,
// // // // // // // //         paddingTop: 12,
// // // // // // // //         paddingBottom: 8,
// // // // // // // //         borderBottomWidth: 1,
// // // // // // // //     },
// // // // // // // //     selectionRow: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         gap: 12,
// // // // // // // //         marginBottom: 8,
// // // // // // // //     },
// // // // // // // //     selectionCard: {
// // // // // // // //         flex: 1,
// // // // // // // //         alignItems: 'center',
// // // // // // // //         paddingVertical: 12,
// // // // // // // //         paddingHorizontal: 6,
// // // // // // // //         borderRadius: 12,
// // // // // // // //         borderWidth: 1,
// // // // // // // //     },
// // // // // // // //     cardIcon: {
// // // // // // // //         width: 40,
// // // // // // // //         height: 40,
// // // // // // // //         borderRadius: 20,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         marginBottom: 6,
// // // // // // // //     },
// // // // // // // //     cardLabel: {
// // // // // // // //         fontSize: 10,
// // // // // // // //         marginBottom: 2,
// // // // // // // //     },
// // // // // // // //     cardValue: {
// // // // // // // //         fontSize: 11,
// // // // // // // //         fontWeight: '600',
// // // // // // // //         textAlign: 'center',
// // // // // // // //     },
// // // // // // // //     tagsContainer: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         paddingHorizontal: 10,
// // // // // // // //         paddingVertical: 8,
// // // // // // // //         borderRadius: 10,
// // // // // // // //         marginTop: 4,
// // // // // // // //         gap: 6,
// // // // // // // //     },
// // // // // // // //     tagsLabel: {
// // // // // // // //         fontSize: 11,
// // // // // // // //     },
// // // // // // // //     tagsScroll: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //     },
// // // // // // // //     tag: {
// // // // // // // //         paddingHorizontal: 8,
// // // // // // // //         paddingVertical: 3,
// // // // // // // //         borderRadius: 14,
// // // // // // // //         marginRight: 6,
// // // // // // // //     },
// // // // // // // //     tagText: {
// // // // // // // //         fontSize: 10,
// // // // // // // //         fontWeight: '500',
// // // // // // // //     },
// // // // // // // //     stickyToolbar: {
// // // // // // // //         borderBottomWidth: 1,
// // // // // // // //         zIndex: 10,
// // // // // // // //     },
// // // // // // // //     toolbar: {
// // // // // // // //         borderBottomWidth: 1,
// // // // // // // //         minHeight: 48,
// // // // // // // //         paddingHorizontal: 8,
// // // // // // // //     },
// // // // // // // //     imageButtonRow: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         paddingHorizontal: 12,
// // // // // // // //         paddingVertical: 8,
// // // // // // // //     },
// // // // // // // //     imageButton: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         gap: 8,
// // // // // // // //         paddingHorizontal: 12,
// // // // // // // //         paddingVertical: 8,
// // // // // // // //         borderRadius: 8,
// // // // // // // //     },
// // // // // // // //     imageButtonText: {
// // // // // // // //         fontSize: 13,
// // // // // // // //         fontWeight: '500',
// // // // // // // //     },
// // // // // // // //     scrollView: {
// // // // // // // //         flex: 1,
// // // // // // // //     },
// // // // // // // //     editorContainer: {
// // // // // // // //         padding: 16,
// // // // // // // //         minHeight: 600,
// // // // // // // //     },
// // // // // // // //     editor: {
// // // // // // // //         minHeight: 600,
// // // // // // // //         padding: 0,
// // // // // // // //     },
// // // // // // // //     fixedActions: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         gap: 12,
// // // // // // // //         paddingHorizontal: 16,
// // // // // // // //         paddingVertical: 12,
// // // // // // // //         borderTopWidth: 1,
// // // // // // // //     },
// // // // // // // //     actionButton: {
// // // // // // // //         flex: 1,
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         paddingVertical: 12,
// // // // // // // //         borderRadius: 10,
// // // // // // // //         gap: 8,
// // // // // // // //     },
// // // // // // // //     draftButton: {
// // // // // // // //         borderWidth: 1,
// // // // // // // //     },
// // // // // // // //     publishButton: {
// // // // // // // //         elevation: 2,
// // // // // // // //         shadowColor: '#000',
// // // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // // //         shadowOpacity: 0.1,
// // // // // // // //         shadowRadius: 3,
// // // // // // // //     },
// // // // // // // //     actionButtonText: {
// // // // // // // //         fontSize: 14,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // //     modalOverlay: {
// // // // // // // //         flex: 1,
// // // // // // // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // //         justifyContent: 'flex-end',
// // // // // // // //     },
// // // // // // // //     modalContent: {
// // // // // // // //         borderTopLeftRadius: 24,
// // // // // // // //         borderTopRightRadius: 24,
// // // // // // // //         padding: 20,
// // // // // // // //         maxHeight: '75%',
// // // // // // // //     },
// // // // // // // //     modalHeader: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         justifyContent: 'space-between',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         marginBottom: 20,
// // // // // // // //     },
// // // // // // // //     modalTitle: {
// // // // // // // //         fontSize: 20,
// // // // // // // //         fontWeight: 'bold',
// // // // // // // //     },
// // // // // // // //     selectAllButton: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         paddingVertical: 12,
// // // // // // // //         marginBottom: 8,
// // // // // // // //         borderBottomWidth: 1,
// // // // // // // //         gap: 12,
// // // // // // // //     },
// // // // // // // //     selectAllText: {
// // // // // // // //         fontSize: 15,
// // // // // // // //         fontWeight: '500',
// // // // // // // //     },
// // // // // // // //     modalItem: {
// // // // // // // //         flexDirection: 'row',
// // // // // // // //         alignItems: 'center',
// // // // // // // //         padding: 14,
// // // // // // // //         borderRadius: 12,
// // // // // // // //         marginBottom: 8,
// // // // // // // //         gap: 12,
// // // // // // // //     },
// // // // // // // //     modalItemIcon: {
// // // // // // // //         width: 40,
// // // // // // // //         height: 40,
// // // // // // // //         borderRadius: 20,
// // // // // // // //         justifyContent: 'center',
// // // // // // // //         alignItems: 'center',
// // // // // // // //     },
// // // // // // // //     modalItemText: {
// // // // // // // //         fontSize: 15,
// // // // // // // //     },
// // // // // // // //     subjectDot: {
// // // // // // // //         width: 12,
// // // // // // // //         height: 12,
// // // // // // // //         borderRadius: 6,
// // // // // // // //     },
// // // // // // // //     modalFooter: {
// // // // // // // //         marginTop: 16,
// // // // // // // //     },
// // // // // // // //     confirmButton: {
// // // // // // // //         paddingVertical: 14,
// // // // // // // //         borderRadius: 12,
// // // // // // // //         alignItems: 'center',
// // // // // // // //     },
// // // // // // // //     confirmButtonText: {
// // // // // // // //         color: '#FFF',
// // // // // // // //         fontSize: 15,
// // // // // // // //         fontWeight: '600',
// // // // // // // //     },
// // // // // // // // });

// // // // // // // // export default CreateDiaryScreen;
// // // // // // // // CreateDiaryScreen.js - FIXED TOOLBAR
// // // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // // import {
// // // // // // //     View,
// // // // // // //     Text,
// // // // // // //     StyleSheet,
// // // // // // //     ScrollView,
// // // // // // //     TouchableOpacity,
// // // // // // //     ActivityIndicator,
// // // // // // //     Alert,
// // // // // // //     Modal,
// // // // // // //     FlatList,
// // // // // // //     Platform,
// // // // // // //     KeyboardAvoidingView,
// // // // // // //     Dimensions,
// // // // // // //     SafeAreaView,
// // // // // // // } from 'react-native';
// // // // // // // import { useSelector } from 'react-redux';
// // // // // // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // // // // // import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// // // // // // // import * as ImagePicker from 'expo-image-picker';
// // // // // // // import * as ImageManipulator from 'expo-image-manipulator';
// // // // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // // // import { selectCurrentUser } from '../../store/slices/authSlice';
// // // // // // // import {
// // // // // // //     useGetTeacherClassesQuery,
// // // // // // //     useGetSubjectsFromClassWiseQuery,
// // // // // // //     useCreateBatchDiaryMutation,
// // // // // // // } from '../../store/diaryApi';

// // // // // // // const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// // // // // // // const CreateDiaryScreen = ({ navigation, route }) => {
// // // // // // //     const theme = useSelector(selectThemeData);
// // // // // // //     const user = useSelector(selectCurrentUser);
// // // // // // //     const richTextRef = useRef(null);
    
// // // // // // //     const editEntry = route.params?.editEntry;

// // // // // // //     const [formData, setFormData] = useState({
// // // // // // //         classId: null,
// // // // // // //         className: '',
// // // // // // //         sectionIds: [],
// // // // // // //         sectionNames: [],
// // // // // // //         subjectId: null,
// // // // // // //         subjectName: '',
// // // // // // //         content: editEntry?.content || '<p><br></p>',
// // // // // // //     });
    
// // // // // // //     const [showClassModal, setShowClassModal] = useState(false);
// // // // // // //     const [showSectionModal, setShowSectionModal] = useState(false);
// // // // // // //     const [showSubjectModal, setShowSubjectModal] = useState(false);
// // // // // // //     const [isSaving, setIsSaving] = useState(false);
// // // // // // //     const [selectAllSections, setSelectAllSections] = useState(true);
// // // // // // //     const [editorHeight, setEditorHeight] = useState(500);
// // // // // // //     const [uploadingImage, setUploadingImage] = useState(false);

// // // // // // //     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
// // // // // // //     const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsFromClassWiseQuery(
// // // // // // //         { classId: formData.classId },
// // // // // // //         { skip: !formData.classId }
// // // // // // //     );

// // // // // // //     const [createBatchDiary] = useCreateBatchDiaryMutation();

// // // // // // //     const classes = classesData?.data || [];
// // // // // // //     const subjects = subjectsData?.data || [];
// // // // // // //     const selectedClass = classes.find(c => c.classId === formData.classId);
// // // // // // //     const sections = selectedClass?.sections || [];

// // // // // // //     // Auto-select all sections when class changes
// // // // // // //     useEffect(() => {
// // // // // // //         if (selectedClass && sections.length > 0 && selectAllSections) {
// // // // // // //             setFormData(prev => ({
// // // // // // //                 ...prev,
// // // // // // //                 sectionIds: sections.map(s => s.sectionId),
// // // // // // //                 sectionNames: sections.map(s => s.sectionName),
// // // // // // //             }));
// // // // // // //         }
// // // // // // //     }, [selectedClass, sections]);

// // // // // // //     // IMAGE HANDLER - Base64 embedding
// // // // // // //     const pickAndInsertImage = async () => {
// // // // // // //         try {
// // // // // // //             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// // // // // // //             if (status !== 'granted') {
// // // // // // //                 Alert.alert('Permission Required', 'Please grant camera roll permissions');
// // // // // // //                 return;
// // // // // // //             }

// // // // // // //             const result = await ImagePicker.launchImageLibraryAsync({
// // // // // // //                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
// // // // // // //                 quality: 1,
// // // // // // //                 allowsEditing: true,
// // // // // // //             });

// // // // // // //             if (result.canceled) return;

// // // // // // //             const image = result.assets[0];

// // // // // // //             if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
// // // // // // //                 Alert.alert('Image Too Large', 'Please select an image smaller than 2MB');
// // // // // // //                 return;
// // // // // // //             }

// // // // // // //             setUploadingImage(true);

// // // // // // //             const manipulatedImage = await ImageManipulator.manipulateAsync(
// // // // // // //                 image.uri,
// // // // // // //                 [{ resize: { width: 600 } }],
// // // // // // //                 {
// // // // // // //                     compress: 0.5,
// // // // // // //                     format: ImageManipulator.SaveFormat.JPEG,
// // // // // // //                     base64: true,
// // // // // // //                 }
// // // // // // //             );

// // // // // // //             const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;

// // // // // // //             const imageHtml = `<div style="text-align: center; margin: 12px 0;">
// // // // // // //                 <img src="${base64Image}" alt="Diary Image" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
// // // // // // //             </div>`;

// // // // // // //             richTextRef.current?.insertHTML(imageHtml);
            
// // // // // // //             Alert.alert('Success', 'Image added to diary');
// // // // // // //         } catch (error) {
// // // // // // //             console.error('Image pick error:', error);
// // // // // // //             Alert.alert('Error', 'Failed to add image');
// // // // // // //         } finally {
// // // // // // //             setUploadingImage(false);
// // // // // // //         }
// // // // // // //     };

// // // // // // //     const toggleSelectAllSections = () => {
// // // // // // //         if (selectAllSections) {
// // // // // // //             setFormData(prev => ({
// // // // // // //                 ...prev,
// // // // // // //                 sectionIds: [],
// // // // // // //                 sectionNames: [],
// // // // // // //             }));
// // // // // // //             setSelectAllSections(false);
// // // // // // //         } else {
// // // // // // //             setFormData(prev => ({
// // // // // // //                 ...prev,
// // // // // // //                 sectionIds: sections.map(s => s.sectionId),
// // // // // // //                 sectionNames: sections.map(s => s.sectionName),
// // // // // // //             }));
// // // // // // //             setSelectAllSections(true);
// // // // // // //         }
// // // // // // //     };

// // // // // // //     const toggleSection = (section) => {
// // // // // // //         const isSelected = formData.sectionIds.includes(section.sectionId);
        
// // // // // // //         if (isSelected) {
// // // // // // //             setFormData(prev => ({
// // // // // // //                 ...prev,
// // // // // // //                 sectionIds: prev.sectionIds.filter(id => id !== section.sectionId),
// // // // // // //                 sectionNames: prev.sectionNames.filter(name => name !== section.sectionName),
// // // // // // //             }));
// // // // // // //         } else {
// // // // // // //             setFormData(prev => ({
// // // // // // //                 ...prev,
// // // // // // //                 sectionIds: [...prev.sectionIds, section.sectionId],
// // // // // // //                 sectionNames: [...prev.sectionNames, section.sectionName],
// // // // // // //             }));
// // // // // // //         }
// // // // // // //     };

// // // // // // //     const handleSave = async (publish = false) => {
// // // // // // //         if (!formData.classId) {
// // // // // // //             Alert.alert('Error', 'Please select a class');
// // // // // // //             return;
// // // // // // //         }
// // // // // // //         if (formData.sectionIds.length === 0) {
// // // // // // //             Alert.alert('Error', 'Please select at least one section');
// // // // // // //             return;
// // // // // // //         }
// // // // // // //         if (!formData.subjectId) {
// // // // // // //             Alert.alert('Error', 'Please select a subject');
// // // // // // //             return;
// // // // // // //         }
        
// // // // // // //         let htmlContent = formData.content;
// // // // // // //         if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === ' ') {
// // // // // // //             Alert.alert('Error', 'Please write some content');
// // // // // // //             return;
// // // // // // //         }

// // // // // // //         setIsSaving(true);
// // // // // // //         try {
// // // // // // //             const diaryData = {
// // // // // // //                 Date: new Date().toISOString().split('T')[0],
// // // // // // //                 ClassID: formData.classId,
// // // // // // //                 SectionIds: formData.sectionIds,
// // // // // // //                 SubjectID: formData.subjectId,
// // // // // // //                 ClassWork: null,
// // // // // // //                 HomeWork: htmlContent,
// // // // // // //                 CreatedBy: user?.id || 1,
// // // // // // //                 isPublished: publish,
// // // // // // //             };

// // // // // // //             await createBatchDiary(diaryData).unwrap();
// // // // // // //             Alert.alert('Success', `Diary ${publish ? 'published' : 'saved as draft'} successfully!`, [
// // // // // // //                 { text: 'OK', onPress: () => navigation.goBack() }
// // // // // // //             ]);
// // // // // // //         } catch (error) {
// // // // // // //             console.error('Save error:', error);
// // // // // // //             Alert.alert('Error', error.data?.message || 'Failed to save diary');
// // // // // // //         } finally {
// // // // // // //             setIsSaving(false);
// // // // // // //         }
// // // // // // //     };

// // // // // // //     const handleBack = () => {
// // // // // // //         const hasContent = formData.content && 
// // // // // // //                           formData.content !== '<p><br></p>' && 
// // // // // // //                           formData.content !== ' ' &&
// // // // // // //                           formData.content.length > 50;
        
// // // // // // //         if (hasContent) {
// // // // // // //             Alert.alert(
// // // // // // //                 'Discard Changes',
// // // // // // //                 'You have unsaved changes. Are you sure you want to leave?',
// // // // // // //                 [
// // // // // // //                     { text: 'Stay', style: 'cancel' },
// // // // // // //                     { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
// // // // // // //                 ]
// // // // // // //             );
// // // // // // //         } else {
// // // // // // //             navigation.goBack();
// // // // // // //         }
// // // // // // //     };

// // // // // // //     const renderClassModal = () => (
// // // // // // //         <Modal visible={showClassModal} transparent animationType="slide" onRequestClose={() => setShowClassModal(false)}>
// // // // // // //             <View style={styles.modalOverlay}>
// // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // //                     <View style={styles.modalHeader}>
// // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Class</Text>
// // // // // // //                         <TouchableOpacity onPress={() => setShowClassModal(false)}>
// // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // //                         </TouchableOpacity>
// // // // // // //                     </View>
// // // // // // //                     <FlatList
// // // // // // //                         data={classes}
// // // // // // //                         keyExtractor={(item) => item.classId?.toString()}
// // // // // // //                         renderItem={({ item }) => (
// // // // // // //                             <TouchableOpacity
// // // // // // //                                 style={[
// // // // // // //                                     styles.modalItem,
// // // // // // //                                     formData.classId === item.classId && { backgroundColor: theme.primary + '15' }
// // // // // // //                                 ]}
// // // // // // //                                 onPress={() => {
// // // // // // //                                     setFormData({
// // // // // // //                                         ...formData,
// // // // // // //                                         classId: item.classId,
// // // // // // //                                         className: item.className,
// // // // // // //                                         sectionIds: [],
// // // // // // //                                         sectionNames: [],
// // // // // // //                                         subjectId: null,
// // // // // // //                                         subjectName: '',
// // // // // // //                                     });
// // // // // // //                                     setSelectAllSections(true);
// // // // // // //                                     setShowClassModal(false);
// // // // // // //                                 }}
// // // // // // //                             >
// // // // // // //                                 <View style={[styles.modalItemIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // //                                     <Icon name="school" size={20} color={theme.primary} />
// // // // // // //                                 </View>
// // // // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // // // //                                     {item.className}
// // // // // // //                                 </Text>
// // // // // // //                                 {formData.classId === item.classId && (
// // // // // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // // // // //                                 )}
// // // // // // //                             </TouchableOpacity>
// // // // // // //                         )}
// // // // // // //                     />
// // // // // // //                 </View>
// // // // // // //             </View>
// // // // // // //         </Modal>
// // // // // // //     );

// // // // // // //     const renderSectionModal = () => (
// // // // // // //         <Modal visible={showSectionModal} transparent animationType="slide" onRequestClose={() => setShowSectionModal(false)}>
// // // // // // //             <View style={styles.modalOverlay}>
// // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // //                     <View style={styles.modalHeader}>
// // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Sections</Text>
// // // // // // //                         <TouchableOpacity onPress={() => setShowSectionModal(false)}>
// // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // //                         </TouchableOpacity>
// // // // // // //                     </View>
                    
// // // // // // //                     {sections.length > 1 && (
// // // // // // //                         <TouchableOpacity
// // // // // // //                             style={[styles.selectAllButton, { borderBottomColor: theme.border }]}
// // // // // // //                             onPress={toggleSelectAllSections}
// // // // // // //                         >
// // // // // // //                             <Icon 
// // // // // // //                                 name={selectAllSections ? "check-box" : "check-box-outline-blank"} 
// // // // // // //                                 size={22} 
// // // // // // //                                 color={theme.primary} 
// // // // // // //                             />
// // // // // // //                             <Text style={[styles.selectAllText, { color: theme.text }]}>
// // // // // // //                                 {selectAllSections ? 'Deselect All' : 'Select All Sections'}
// // // // // // //                             </Text>
// // // // // // //                         </TouchableOpacity>
// // // // // // //                     )}
                    
// // // // // // //                     <FlatList
// // // // // // //                         data={sections}
// // // // // // //                         keyExtractor={(item) => item.sectionId?.toString()}
// // // // // // //                         renderItem={({ item }) => {
// // // // // // //                             const isSelected = formData.sectionIds.includes(item.sectionId);
// // // // // // //                             return (
// // // // // // //                                 <TouchableOpacity
// // // // // // //                                     style={[styles.modalItem, isSelected && { backgroundColor: theme.primary + '10' }]}
// // // // // // //                                     onPress={() => toggleSection(item)}
// // // // // // //                                 >
// // // // // // //                                     <Icon 
// // // // // // //                                         name={isSelected ? "check-box" : "check-box-outline-blank"} 
// // // // // // //                                         size={22} 
// // // // // // //                                         color={isSelected ? theme.primary : theme.textSecondary} 
// // // // // // //                                     />
// // // // // // //                                     <Text style={[styles.modalItemText, { color: theme.text, marginLeft: 12 }]}>
// // // // // // //                                         Section {item.sectionName}
// // // // // // //                                     </Text>
// // // // // // //                                 </TouchableOpacity>
// // // // // // //                             );
// // // // // // //                         }}
// // // // // // //                     />
// // // // // // //                     <View style={styles.modalFooter}>
// // // // // // //                         <TouchableOpacity
// // // // // // //                             style={[styles.confirmButton, { backgroundColor: theme.primary }]}
// // // // // // //                             onPress={() => setShowSectionModal(false)}
// // // // // // //                         >
// // // // // // //                             <Text style={styles.confirmButtonText}>
// // // // // // //                                 Confirm ({formData.sectionIds.length} selected)
// // // // // // //                             </Text>
// // // // // // //                         </TouchableOpacity>
// // // // // // //                     </View>
// // // // // // //                 </View>
// // // // // // //             </View>
// // // // // // //         </Modal>
// // // // // // //     );

// // // // // // //     const renderSubjectModal = () => (
// // // // // // //         <Modal visible={showSubjectModal} transparent animationType="slide" onRequestClose={() => setShowSubjectModal(false)}>
// // // // // // //             <View style={styles.modalOverlay}>
// // // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // // //                     <View style={styles.modalHeader}>
// // // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Subject</Text>
// // // // // // //                         <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
// // // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // // //                         </TouchableOpacity>
// // // // // // //                     </View>
// // // // // // //                     <FlatList
// // // // // // //                         data={subjects}
// // // // // // //                         keyExtractor={(item) => item.subjectId?.toString()}
// // // // // // //                         renderItem={({ item }) => (
// // // // // // //                             <TouchableOpacity
// // // // // // //                                 style={[
// // // // // // //                                     styles.modalItem,
// // // // // // //                                     formData.subjectId === item.subjectId && { backgroundColor: theme.primary + '15' }
// // // // // // //                                 ]}
// // // // // // //                                 onPress={() => {
// // // // // // //                                     setFormData({
// // // // // // //                                         ...formData,
// // // // // // //                                         subjectId: item.subjectId,
// // // // // // //                                         subjectName: item.subjectName,
// // // // // // //                                     });
// // // // // // //                                     setShowSubjectModal(false);
// // // // // // //                                 }}
// // // // // // //                             >
// // // // // // //                                 <View style={[styles.subjectDot, { backgroundColor: item.colorCode || theme.primary }]} />
// // // // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // // // //                                     {item.subjectName}
// // // // // // //                                 </Text>
// // // // // // //                                 {formData.subjectId === item.subjectId && (
// // // // // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // // // // //                                 )}
// // // // // // //                             </TouchableOpacity>
// // // // // // //                         )}
// // // // // // //                     />
// // // // // // //                 </View>
// // // // // // //             </View>
// // // // // // //         </Modal>
// // // // // // //     );

// // // // // // //     if (classesLoading) {
// // // // // // //         return (
// // // // // // //             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
// // // // // // //                 <ActivityIndicator size="large" color={theme.primary} />
// // // // // // //             </View>
// // // // // // //         );
// // // // // // //     }

// // // // // // //     // Define toolbar actions INCLUDING the image action
// // // // // // //     const toolbarActions = [
// // // // // // //         actions.setBold,
// // // // // // //         actions.setItalic,
// // // // // // //         actions.setUnderline,
// // // // // // //         actions.insertBulletsList,
// // // // // // //         actions.insertOrderedList,
// // // // // // //         actions.setAlignLeft,
// // // // // // //         actions.setAlignCenter,
// // // // // // //         actions.setAlignRight,
// // // // // // //         actions.undo,
// // // // // // //         actions.redo,
// // // // // // //         actions.insertImage, // Add image action to the toolbar
// // // // // // //     ];

// // // // // // //     return (
// // // // // // //         <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
// // // // // // //             {/* Fixed Header */}
// // // // // // //             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // // // //                 <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
// // // // // // //                     <Icon name="arrow-back" size={24} color={theme.text} />
// // // // // // //                 </TouchableOpacity>
// // // // // // //                 <Text style={[styles.headerTitle, { color: theme.text }]}>
// // // // // // //                     {editEntry ? 'Edit Diary' : 'Create Diary'}
// // // // // // //                 </Text>
// // // // // // //                 <View style={styles.headerButton} />
// // // // // // //             </View>

// // // // // // //             {/* Fixed Selection Cards */}
// // // // // // //             <View style={[styles.fixedSelectionContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
// // // // // // //                 <View style={styles.selectionRow}>
// // // // // // //                     <TouchableOpacity
// // // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // // //                         onPress={() => setShowClassModal(true)}
// // // // // // //                         activeOpacity={0.7}
// // // // // // //                     >
// // // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // //                             <Icon name="school" size={22} color={theme.primary} />
// // // // // // //                         </View>
// // // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Class</Text>
// // // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // // //                             {formData.className || 'Select'}
// // // // // // //                         </Text>
// // // // // // //                     </TouchableOpacity>

// // // // // // //                     <TouchableOpacity
// // // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // // //                         onPress={() => formData.classId ? setShowSectionModal(true) : Alert.alert('Info', 'Select class first')}
// // // // // // //                         activeOpacity={0.7}
// // // // // // //                     >
// // // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // //                             <Icon name="groups" size={22} color={theme.primary} />
// // // // // // //                         </View>
// // // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Sections</Text>
// // // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // // //                             {formData.sectionIds.length ? `${formData.sectionIds.length} selected` : 'Select'}
// // // // // // //                         </Text>
// // // // // // //                     </TouchableOpacity>

// // // // // // //                     <TouchableOpacity
// // // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // // //                         onPress={() => formData.classId && formData.sectionIds.length ? setShowSubjectModal(true) : Alert.alert('Info', 'Select class & sections first')}
// // // // // // //                         activeOpacity={0.7}
// // // // // // //                     >
// // // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // // //                             <Icon name="book" size={22} color={theme.primary} />
// // // // // // //                         </View>
// // // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Subject</Text>
// // // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // // //                             {formData.subjectName || 'Select'}
// // // // // // //                         </Text>
// // // // // // //                     </TouchableOpacity>
// // // // // // //                 </View>

// // // // // // //                 {/* Selected Sections Tags */}
// // // // // // //                 {formData.sectionIds.length > 0 && (
// // // // // // //                     <View style={[styles.tagsContainer, { backgroundColor: theme.card }]}>
// // // // // // //                         <Text style={[styles.tagsLabel, { color: theme.textSecondary }]}>Selected:</Text>
// // // // // // //                         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
// // // // // // //                             {formData.sectionNames.map((name, index) => (
// // // // // // //                                 <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '15' }]}>
// // // // // // //                                     <Text style={[styles.tagText, { color: theme.primary }]}>Sec {name}</Text>
// // // // // // //                                 </View>
// // // // // // //                             ))}
// // // // // // //                         </ScrollView>
// // // // // // //                     </View>
// // // // // // //                 )}
// // // // // // //             </View>

// // // // // // //             {/* STICKY TOOLBAR - With all tools including Image */}
// // // // // // //             <View style={[styles.stickyToolbar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // // // //                 <RichToolbar
// // // // // // //                     editor={richTextRef}
// // // // // // //                     actions={toolbarActions}
// // // // // // //                     iconMap={{
// // // // // // //                         [actions.setBold]: ({ tintColor }) => <Icon name="format-bold" size={22} color={tintColor} />,
// // // // // // //                         [actions.setItalic]: ({ tintColor }) => <Icon name="format-italic" size={22} color={tintColor} />,
// // // // // // //                         [actions.setUnderline]: ({ tintColor }) => <Icon name="format-underlined" size={22} color={tintColor} />,
// // // // // // //                         [actions.insertBulletsList]: ({ tintColor }) => <Icon name="format-list-bulleted" size={22} color={tintColor} />,
// // // // // // //                         [actions.insertOrderedList]: ({ tintColor }) => <Icon name="format-list-numbered" size={22} color={tintColor} />,
// // // // // // //                         [actions.setAlignLeft]: ({ tintColor }) => <Icon name="format-align-left" size={22} color={tintColor} />,
// // // // // // //                         [actions.setAlignCenter]: ({ tintColor }) => <Icon name="format-align-center" size={22} color={tintColor} />,
// // // // // // //                         [actions.setAlignRight]: ({ tintColor }) => <Icon name="format-align-right" size={22} color={tintColor} />,
// // // // // // //                         [actions.undo]: ({ tintColor }) => <Icon name="undo" size={22} color={tintColor} />,
// // // // // // //                         [actions.redo]: ({ tintColor }) => <Icon name="redo" size={22} color={tintColor} />,
// // // // // // //                         [actions.insertImage]: ({ tintColor }) => <Icon name="image" size={22} color={tintColor} />,
// // // // // // //                     }}
// // // // // // //                     style={[styles.toolbar, { backgroundColor: theme.background }]}
// // // // // // //                     onPressAddImage={pickAndInsertImage}
// // // // // // //                 />
// // // // // // //             </View>

// // // // // // //             {/* Scrollable Editor Area */}
// // // // // // //             <ScrollView 
// // // // // // //                 style={styles.scrollView} 
// // // // // // //                 showsVerticalScrollIndicator={true}
// // // // // // //                 keyboardShouldPersistTaps="handled"
// // // // // // //                 contentContainerStyle={{ paddingBottom: 80 }}
// // // // // // //             >
// // // // // // //                 <View style={styles.editorContainer}>
// // // // // // //                     <RichEditor
// // // // // // //                         ref={richTextRef}
// // // // // // //                         initialContentHTML={formData.content}
// // // // // // //                         onChange={(html) => setFormData({ ...formData, content: html })}
// // // // // // //                         editorStyle={{
// // // // // // //                             backgroundColor: theme.background,
// // // // // // //                             color: theme.text,
// // // // // // //                             placeholderColor: theme.textSecondary,
// // // // // // //                             contentCSS: `body { 
// // // // // // //                                 font-family: -apple-system; 
// // // // // // //                                 font-size: 16px; 
// // // // // // //                                 padding: 16px; 
// // // // // // //                                 line-height: 1.6;
// // // // // // //                                 min-height: 600px;
// // // // // // //                             }
// // // // // // //                             img { 
// // // // // // //                                 max-width: 100%; 
// // // // // // //                                 height: auto; 
// // // // // // //                                 border-radius: 12px; 
// // // // // // //                                 margin: 10px 0;
// // // // // // //                             }
// // // // // // //                             p { margin-bottom: 12px; }
// // // // // // //                             h1, h2, h3 { margin: 16px 0 8px; }`,
// // // // // // //                         }}
// // // // // // //                         placeholder="Write your diary entry here..."
// // // // // // //                         style={[styles.editor, { backgroundColor: theme.background, height: editorHeight }]}
// // // // // // //                         onLoadEnd={() => setEditorHeight(600)}
// // // // // // //                     />
// // // // // // //                 </View>
// // // // // // //             </ScrollView>

// // // // // // //             {/* Fixed Action Buttons at Bottom */}
// // // // // // //             <View style={[styles.fixedActions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
// // // // // // //                 <TouchableOpacity
// // // // // // //                     style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15', borderColor: theme.warning }]}
// // // // // // //                     onPress={() => handleSave(false)}
// // // // // // //                     disabled={isSaving || uploadingImage}
// // // // // // //                 >
// // // // // // //                     {isSaving ? (
// // // // // // //                         <ActivityIndicator size="small" color={theme.warning} />
// // // // // // //                     ) : (
// // // // // // //                         <>
// // // // // // //                             <Icon name="save" size={20} color={theme.warning} />
// // // // // // //                             <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>
// // // // // // //                         </>
// // // // // // //                     )}
// // // // // // //                 </TouchableOpacity>

// // // // // // //                 <TouchableOpacity
// // // // // // //                     style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
// // // // // // //                     onPress={() => handleSave(true)}
// // // // // // //                     disabled={isSaving || uploadingImage}
// // // // // // //                 >
// // // // // // //                     {isSaving ? (
// // // // // // //                         <ActivityIndicator size="small" color="#FFF" />
// // // // // // //                     ) : (
// // // // // // //                         <>
// // // // // // //                             <Icon name="send" size={20} color="#FFF" />
// // // // // // //                             <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>
// // // // // // //                         </>
// // // // // // //                     )}
// // // // // // //                 </TouchableOpacity>
// // // // // // //             </View>

// // // // // // //             {renderClassModal()}
// // // // // // //             {renderSectionModal()}
// // // // // // //             {renderSubjectModal()}
// // // // // // //         </SafeAreaView>
// // // // // // //     );
// // // // // // // };

// // // // // // // const styles = StyleSheet.create({
// // // // // // //     safeArea: {
// // // // // // //         flex: 1,
// // // // // // //     },
// // // // // // //     loadingContainer: {
// // // // // // //         flex: 1,
// // // // // // //         justifyContent: 'center',
// // // // // // //         alignItems: 'center',
// // // // // // //     },
// // // // // // //     header: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         justifyContent: 'space-between',
// // // // // // //         paddingHorizontal: 16,
// // // // // // //         paddingVertical: 14,
// // // // // // //         borderBottomWidth: 1,
// // // // // // //     },
// // // // // // //     headerButton: {
// // // // // // //         width: 40,
// // // // // // //         height: 40,
// // // // // // //         justifyContent: 'center',
// // // // // // //         alignItems: 'center',
// // // // // // //     },
// // // // // // //     headerTitle: {
// // // // // // //         fontSize: 18,
// // // // // // //         fontWeight: '600',
// // // // // // //     },
// // // // // // //     fixedSelectionContainer: {
// // // // // // //         paddingHorizontal: 16,
// // // // // // //         paddingTop: 12,
// // // // // // //         paddingBottom: 8,
// // // // // // //         borderBottomWidth: 1,
// // // // // // //     },
// // // // // // //     selectionRow: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         gap: 12,
// // // // // // //         marginBottom: 8,
// // // // // // //     },
// // // // // // //     selectionCard: {
// // // // // // //         flex: 1,
// // // // // // //         alignItems: 'center',
// // // // // // //         paddingVertical: 12,
// // // // // // //         paddingHorizontal: 6,
// // // // // // //         borderRadius: 12,
// // // // // // //         borderWidth: 1,
// // // // // // //     },
// // // // // // //     cardIcon: {
// // // // // // //         width: 40,
// // // // // // //         height: 40,
// // // // // // //         borderRadius: 20,
// // // // // // //         justifyContent: 'center',
// // // // // // //         alignItems: 'center',
// // // // // // //         marginBottom: 6,
// // // // // // //     },
// // // // // // //     cardLabel: {
// // // // // // //         fontSize: 10,
// // // // // // //         marginBottom: 2,
// // // // // // //     },
// // // // // // //     cardValue: {
// // // // // // //         fontSize: 11,
// // // // // // //         fontWeight: '600',
// // // // // // //         textAlign: 'center',
// // // // // // //     },
// // // // // // //     tagsContainer: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         paddingHorizontal: 10,
// // // // // // //         paddingVertical: 8,
// // // // // // //         borderRadius: 10,
// // // // // // //         marginTop: 4,
// // // // // // //         gap: 6,
// // // // // // //     },
// // // // // // //     tagsLabel: {
// // // // // // //         fontSize: 11,
// // // // // // //     },
// // // // // // //     tagsScroll: {
// // // // // // //         flexDirection: 'row',
// // // // // // //     },
// // // // // // //     tag: {
// // // // // // //         paddingHorizontal: 8,
// // // // // // //         paddingVertical: 3,
// // // // // // //         borderRadius: 14,
// // // // // // //         marginRight: 6,
// // // // // // //     },
// // // // // // //     tagText: {
// // // // // // //         fontSize: 10,
// // // // // // //         fontWeight: '500',
// // // // // // //     },
// // // // // // //     stickyToolbar: {
// // // // // // //         borderBottomWidth: 1,
// // // // // // //         zIndex: 10,
// // // // // // //     },
// // // // // // //     toolbar: {
// // // // // // //         borderBottomWidth: 1,
// // // // // // //         minHeight: 48,
// // // // // // //         paddingHorizontal: 8,
// // // // // // //     },
// // // // // // //     scrollView: {
// // // // // // //         flex: 1,
// // // // // // //     },
// // // // // // //     editorContainer: {
// // // // // // //         padding: 16,
// // // // // // //         minHeight: 600,
// // // // // // //     },
// // // // // // //     editor: {
// // // // // // //         minHeight: 600,
// // // // // // //         padding: 0,
// // // // // // //     },
// // // // // // //     fixedActions: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         gap: 12,
// // // // // // //         paddingHorizontal: 16,
// // // // // // //         paddingVertical: 12,
// // // // // // //         borderTopWidth: 1,
// // // // // // //     },
// // // // // // //     actionButton: {
// // // // // // //         flex: 1,
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         justifyContent: 'center',
// // // // // // //         paddingVertical: 12,
// // // // // // //         borderRadius: 10,
// // // // // // //         gap: 8,
// // // // // // //     },
// // // // // // //     draftButton: {
// // // // // // //         borderWidth: 1,
// // // // // // //     },
// // // // // // //     publishButton: {
// // // // // // //         elevation: 2,
// // // // // // //         shadowColor: '#000',
// // // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // // //         shadowOpacity: 0.1,
// // // // // // //         shadowRadius: 3,
// // // // // // //     },
// // // // // // //     actionButtonText: {
// // // // // // //         fontSize: 14,
// // // // // // //         fontWeight: '600',
// // // // // // //     },
// // // // // // //     modalOverlay: {
// // // // // // //         flex: 1,
// // // // // // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // //         justifyContent: 'flex-end',
// // // // // // //     },
// // // // // // //     modalContent: {
// // // // // // //         borderTopLeftRadius: 24,
// // // // // // //         borderTopRightRadius: 24,
// // // // // // //         padding: 20,
// // // // // // //         maxHeight: '75%',
// // // // // // //     },
// // // // // // //     modalHeader: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         justifyContent: 'space-between',
// // // // // // //         alignItems: 'center',
// // // // // // //         marginBottom: 20,
// // // // // // //     },
// // // // // // //     modalTitle: {
// // // // // // //         fontSize: 20,
// // // // // // //         fontWeight: 'bold',
// // // // // // //     },
// // // // // // //     selectAllButton: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         paddingVertical: 12,
// // // // // // //         marginBottom: 8,
// // // // // // //         borderBottomWidth: 1,
// // // // // // //         gap: 12,
// // // // // // //     },
// // // // // // //     selectAllText: {
// // // // // // //         fontSize: 15,
// // // // // // //         fontWeight: '500',
// // // // // // //     },
// // // // // // //     modalItem: {
// // // // // // //         flexDirection: 'row',
// // // // // // //         alignItems: 'center',
// // // // // // //         padding: 14,
// // // // // // //         borderRadius: 12,
// // // // // // //         marginBottom: 8,
// // // // // // //         gap: 12,
// // // // // // //     },
// // // // // // //     modalItemIcon: {
// // // // // // //         width: 40,
// // // // // // //         height: 40,
// // // // // // //         borderRadius: 20,
// // // // // // //         justifyContent: 'center',
// // // // // // //         alignItems: 'center',
// // // // // // //     },
// // // // // // //     modalItemText: {
// // // // // // //         fontSize: 15,
// // // // // // //     },
// // // // // // //     subjectDot: {
// // // // // // //         width: 12,
// // // // // // //         height: 12,
// // // // // // //         borderRadius: 6,
// // // // // // //     },
// // // // // // //     modalFooter: {
// // // // // // //         marginTop: 16,
// // // // // // //     },
// // // // // // //     confirmButton: {
// // // // // // //         paddingVertical: 14,
// // // // // // //         borderRadius: 12,
// // // // // // //         alignItems: 'center',
// // // // // // //     },
// // // // // // //     confirmButtonText: {
// // // // // // //         color: '#FFF',
// // // // // // //         fontSize: 15,
// // // // // // //         fontWeight: '600',
// // // // // // //     },
// // // // // // // });

// // // // // // // export default CreateDiaryScreen;
// // // // // // // CreateDiaryScreen.js - COMPLETE FIXED VERSION
// // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // import {
// // // // // //     View,
// // // // // //     Text,
// // // // // //     StyleSheet,
// // // // // //     ScrollView,
// // // // // //     TouchableOpacity,
// // // // // //     ActivityIndicator,
// // // // // //     Alert,
// // // // // //     Modal,
// // // // // //     FlatList,
// // // // // //     Platform,
// // // // // //     KeyboardAvoidingView,
// // // // // //     Dimensions,
// // // // // //     SafeAreaView,
// // // // // // } from 'react-native';
// // // // // // import { useSelector } from 'react-redux';
// // // // // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // // // // import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// // // // // // import * as ImagePicker from 'expo-image-picker';
// // // // // // import * as ImageManipulator from 'expo-image-manipulator';
// // // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // // import { selectCurrentUser } from '../../store/slices/authSlice';
// // // // // // import {
// // // // // //     useGetTeacherClassesQuery,
// // // // // //     useGetSubjectsFromClassWiseQuery,
// // // // // //     useCreateBatchDiaryMutation,
// // // // // // } from '../../store/diaryApi';

// // // // // // const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// // // // // // const CreateDiaryScreen = ({ navigation, route }) => {
// // // // // //     const theme = useSelector(selectThemeData);
// // // // // //     const user = useSelector(selectCurrentUser);
// // // // // //     const richTextRef = useRef(null);
    
// // // // // //     const editEntry = route.params?.editEntry;

// // // // // //     const [formData, setFormData] = useState({
// // // // // //         classId: null,
// // // // // //         className: '',
// // // // // //         sectionIds: [],
// // // // // //         sectionNames: [],
// // // // // //         subjectId: null,
// // // // // //         subjectName: '',
// // // // // //         content: editEntry?.content || '<p><br></p>',
// // // // // //     });
    
// // // // // //     const [showClassModal, setShowClassModal] = useState(false);
// // // // // //     const [showSectionModal, setShowSectionModal] = useState(false);
// // // // // //     const [showSubjectModal, setShowSubjectModal] = useState(false);
// // // // // //     const [isSaving, setIsSaving] = useState(false);
// // // // // //     const [selectAllSections, setSelectAllSections] = useState(true);
// // // // // //     const [editorHeight, setEditorHeight] = useState(500);
// // // // // //     const [uploadingImage, setUploadingImage] = useState(false);

// // // // // //     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
// // // // // //     const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsFromClassWiseQuery(
// // // // // //         { classId: formData.classId },
// // // // // //         { skip: !formData.classId }
// // // // // //     );

// // // // // //     const [createBatchDiary] = useCreateBatchDiaryMutation();

// // // // // //     const classes = classesData?.data || [];
// // // // // //     const subjects = subjectsData?.data || [];
// // // // // //     const selectedClass = classes.find(c => c.classId === formData.classId);
// // // // // //     const sections = selectedClass?.sections || [];

// // // // // //     // Auto-select all sections when class changes
// // // // // //     useEffect(() => {
// // // // // //         if (selectedClass && sections.length > 0 && selectAllSections) {
// // // // // //             setFormData(prev => ({
// // // // // //                 ...prev,
// // // // // //                 sectionIds: sections.map(s => s.sectionId),
// // // // // //                 sectionNames: sections.map(s => s.sectionName),
// // // // // //             }));
// // // // // //         }
// // // // // //     }, [selectedClass, sections]);

// // // // // //     // IMAGE HANDLER - Base64 embedding
// // // // // //     const pickAndInsertImage = async () => {
// // // // // //         try {
// // // // // //             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// // // // // //             if (status !== 'granted') {
// // // // // //                 Alert.alert('Permission Required', 'Please grant camera roll permissions');
// // // // // //                 return;
// // // // // //             }

// // // // // //             const result = await ImagePicker.launchImageLibraryAsync({
// // // // // //                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
// // // // // //                 quality: 1,
// // // // // //                 allowsEditing: true,
// // // // // //             });

// // // // // //             if (result.canceled) return;

// // // // // //             const image = result.assets[0];

// // // // // //             if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
// // // // // //                 Alert.alert('Image Too Large', 'Please select an image smaller than 2MB');
// // // // // //                 return;
// // // // // //             }

// // // // // //             setUploadingImage(true);

// // // // // //             const manipulatedImage = await ImageManipulator.manipulateAsync(
// // // // // //                 image.uri,
// // // // // //                 [{ resize: { width: 600 } }],
// // // // // //                 {
// // // // // //                     compress: 0.5,
// // // // // //                     format: ImageManipulator.SaveFormat.JPEG,
// // // // // //                     base64: true,
// // // // // //                 }
// // // // // //             );

// // // // // //             const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;

// // // // // //             const imageHtml = `<div style="text-align: center; margin: 12px 0;">
// // // // // //                 <img src="${base64Image}" alt="Diary Image" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
// // // // // //             </div>`;

// // // // // //             richTextRef.current?.insertHTML(imageHtml);
            
// // // // // //             Alert.alert('Success', 'Image added to diary');
// // // // // //         } catch (error) {
// // // // // //             console.error('Image pick error:', error);
// // // // // //             Alert.alert('Error', 'Failed to add image');
// // // // // //         } finally {
// // // // // //             setUploadingImage(false);
// // // // // //         }
// // // // // //     };

// // // // // //     const toggleSelectAllSections = () => {
// // // // // //         if (selectAllSections) {
// // // // // //             setFormData(prev => ({
// // // // // //                 ...prev,
// // // // // //                 sectionIds: [],
// // // // // //                 sectionNames: [],
// // // // // //             }));
// // // // // //             setSelectAllSections(false);
// // // // // //         } else {
// // // // // //             setFormData(prev => ({
// // // // // //                 ...prev,
// // // // // //                 sectionIds: sections.map(s => s.sectionId),
// // // // // //                 sectionNames: sections.map(s => s.sectionName),
// // // // // //             }));
// // // // // //             setSelectAllSections(true);
// // // // // //         }
// // // // // //     };

// // // // // //     const toggleSection = (section) => {
// // // // // //         const isSelected = formData.sectionIds.includes(section.sectionId);
        
// // // // // //         if (isSelected) {
// // // // // //             setFormData(prev => ({
// // // // // //                 ...prev,
// // // // // //                 sectionIds: prev.sectionIds.filter(id => id !== section.sectionId),
// // // // // //                 sectionNames: prev.sectionNames.filter(name => name !== section.sectionName),
// // // // // //             }));
// // // // // //         } else {
// // // // // //             setFormData(prev => ({
// // // // // //                 ...prev,
// // // // // //                 sectionIds: [...prev.sectionIds, section.sectionId],
// // // // // //                 sectionNames: [...prev.sectionNames, section.sectionName],
// // // // // //             }));
// // // // // //         }
// // // // // //     };

// // // // // //     const handleSave = async (publish = false) => {
// // // // // //         if (!formData.classId) {
// // // // // //             Alert.alert('Error', 'Please select a class');
// // // // // //             return;
// // // // // //         }
// // // // // //         if (formData.sectionIds.length === 0) {
// // // // // //             Alert.alert('Error', 'Please select at least one section');
// // // // // //             return;
// // // // // //         }
// // // // // //         if (!formData.subjectId) {
// // // // // //             Alert.alert('Error', 'Please select a subject');
// // // // // //             return;
// // // // // //         }
        
// // // // // //         let htmlContent = formData.content;
// // // // // //         if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === ' ') {
// // // // // //             Alert.alert('Error', 'Please write some content');
// // // // // //             return;
// // // // // //         }

// // // // // //         setIsSaving(true);
// // // // // //         try {
// // // // // //             const diaryData = {
// // // // // //                 Date: new Date().toISOString().split('T')[0],
// // // // // //                 ClassID: formData.classId,
// // // // // //                 SectionIds: formData.sectionIds,
// // // // // //                 SubjectID: formData.subjectId,
// // // // // //                 ClassWork: null,
// // // // // //                 HomeWork: htmlContent,
// // // // // //                 CreatedBy: user?.id || 1,
// // // // // //                 isPublished: publish,
// // // // // //             };

// // // // // //             await createBatchDiary(diaryData).unwrap();
// // // // // //             Alert.alert('Success', `Diary ${publish ? 'published' : 'saved as draft'} successfully!`, [
// // // // // //                 { text: 'OK', onPress: () => navigation.goBack() }
// // // // // //             ]);
// // // // // //         } catch (error) {
// // // // // //             console.error('Save error:', error);
// // // // // //             Alert.alert('Error', error.data?.message || 'Failed to save diary');
// // // // // //         } finally {
// // // // // //             setIsSaving(false);
// // // // // //         }
// // // // // //     };

// // // // // //     const handleBack = () => {
// // // // // //         const hasContent = formData.content && 
// // // // // //                           formData.content !== '<p><br></p>' && 
// // // // // //                           formData.content !== ' ' &&
// // // // // //                           formData.content.length > 50;
        
// // // // // //         if (hasContent) {
// // // // // //             Alert.alert(
// // // // // //                 'Discard Changes',
// // // // // //                 'You have unsaved changes. Are you sure you want to leave?',
// // // // // //                 [
// // // // // //                     { text: 'Stay', style: 'cancel' },
// // // // // //                     { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
// // // // // //                 ]
// // // // // //             );
// // // // // //         } else {
// // // // // //             navigation.goBack();
// // // // // //         }
// // // // // //     };

// // // // // //     const renderClassModal = () => (
// // // // // //         <Modal visible={showClassModal} transparent animationType="slide" onRequestClose={() => setShowClassModal(false)}>
// // // // // //             <View style={styles.modalOverlay}>
// // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // //                     <View style={styles.modalHeader}>
// // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Class</Text>
// // // // // //                         <TouchableOpacity onPress={() => setShowClassModal(false)}>
// // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // //                         </TouchableOpacity>
// // // // // //                     </View>
// // // // // //                     <FlatList
// // // // // //                         data={classes}
// // // // // //                         keyExtractor={(item) => item.classId?.toString()}
// // // // // //                         renderItem={({ item }) => (
// // // // // //                             <TouchableOpacity
// // // // // //                                 style={[
// // // // // //                                     styles.modalItem,
// // // // // //                                     formData.classId === item.classId && { backgroundColor: theme.primary + '15' }
// // // // // //                                 ]}
// // // // // //                                 onPress={() => {
// // // // // //                                     setFormData({
// // // // // //                                         ...formData,
// // // // // //                                         classId: item.classId,
// // // // // //                                         className: item.className,
// // // // // //                                         sectionIds: [],
// // // // // //                                         sectionNames: [],
// // // // // //                                         subjectId: null,
// // // // // //                                         subjectName: '',
// // // // // //                                     });
// // // // // //                                     setSelectAllSections(true);
// // // // // //                                     setShowClassModal(false);
// // // // // //                                 }}
// // // // // //                             >
// // // // // //                                 <View style={[styles.modalItemIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // //                                     <Icon name="school" size={20} color={theme.primary} />
// // // // // //                                 </View>
// // // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // // //                                     {item.className}
// // // // // //                                 </Text>
// // // // // //                                 {formData.classId === item.classId && (
// // // // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // // // //                                 )}
// // // // // //                             </TouchableOpacity>
// // // // // //                         )}
// // // // // //                     />
// // // // // //                 </View>
// // // // // //             </View>
// // // // // //         </Modal>
// // // // // //     );

// // // // // //     const renderSectionModal = () => (
// // // // // //         <Modal visible={showSectionModal} transparent animationType="slide" onRequestClose={() => setShowSectionModal(false)}>
// // // // // //             <View style={styles.modalOverlay}>
// // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // //                     <View style={styles.modalHeader}>
// // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Sections</Text>
// // // // // //                         <TouchableOpacity onPress={() => setShowSectionModal(false)}>
// // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // //                         </TouchableOpacity>
// // // // // //                     </View>
                    
// // // // // //                     {sections.length > 1 && (
// // // // // //                         <TouchableOpacity
// // // // // //                             style={[styles.selectAllButton, { borderBottomColor: theme.border }]}
// // // // // //                             onPress={toggleSelectAllSections}
// // // // // //                         >
// // // // // //                             <Icon 
// // // // // //                                 name={selectAllSections ? "check-box" : "check-box-outline-blank"} 
// // // // // //                                 size={22} 
// // // // // //                                 color={theme.primary} 
// // // // // //                             />
// // // // // //                             <Text style={[styles.selectAllText, { color: theme.text }]}>
// // // // // //                                 {selectAllSections ? 'Deselect All' : 'Select All Sections'}
// // // // // //                             </Text>
// // // // // //                         </TouchableOpacity>
// // // // // //                     )}
                    
// // // // // //                     <FlatList
// // // // // //                         data={sections}
// // // // // //                         keyExtractor={(item) => item.sectionId?.toString()}
// // // // // //                         renderItem={({ item }) => {
// // // // // //                             const isSelected = formData.sectionIds.includes(item.sectionId);
// // // // // //                             return (
// // // // // //                                 <TouchableOpacity
// // // // // //                                     style={[styles.modalItem, isSelected && { backgroundColor: theme.primary + '10' }]}
// // // // // //                                     onPress={() => toggleSection(item)}
// // // // // //                                 >
// // // // // //                                     <Icon 
// // // // // //                                         name={isSelected ? "check-box" : "check-box-outline-blank"} 
// // // // // //                                         size={22} 
// // // // // //                                         color={isSelected ? theme.primary : theme.textSecondary} 
// // // // // //                                     />
// // // // // //                                     <Text style={[styles.modalItemText, { color: theme.text, marginLeft: 12 }]}>
// // // // // //                                         Section {item.sectionName}
// // // // // //                                     </Text>
// // // // // //                                 </TouchableOpacity>
// // // // // //                             );
// // // // // //                         }}
// // // // // //                     />
// // // // // //                     <View style={styles.modalFooter}>
// // // // // //                         <TouchableOpacity
// // // // // //                             style={[styles.confirmButton, { backgroundColor: theme.primary }]}
// // // // // //                             onPress={() => setShowSectionModal(false)}
// // // // // //                         >
// // // // // //                             <Text style={styles.confirmButtonText}>
// // // // // //                                 Confirm ({formData.sectionIds.length} selected)
// // // // // //                             </Text>
// // // // // //                         </TouchableOpacity>
// // // // // //                     </View>
// // // // // //                 </View>
// // // // // //             </View>
// // // // // //         </Modal>
// // // // // //     );

// // // // // //     const renderSubjectModal = () => (
// // // // // //         <Modal visible={showSubjectModal} transparent animationType="slide" onRequestClose={() => setShowSubjectModal(false)}>
// // // // // //             <View style={styles.modalOverlay}>
// // // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // // //                     <View style={styles.modalHeader}>
// // // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Subject</Text>
// // // // // //                         <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
// // // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // // //                         </TouchableOpacity>
// // // // // //                     </View>
// // // // // //                     <FlatList
// // // // // //                         data={subjects}
// // // // // //                         keyExtractor={(item) => item.subjectId?.toString()}
// // // // // //                         renderItem={({ item }) => (
// // // // // //                             <TouchableOpacity
// // // // // //                                 style={[
// // // // // //                                     styles.modalItem,
// // // // // //                                     formData.subjectId === item.subjectId && { backgroundColor: theme.primary + '15' }
// // // // // //                                 ]}
// // // // // //                                 onPress={() => {
// // // // // //                                     setFormData({
// // // // // //                                         ...formData,
// // // // // //                                         subjectId: item.subjectId,
// // // // // //                                         subjectName: item.subjectName,
// // // // // //                                     });
// // // // // //                                     setShowSubjectModal(false);
// // // // // //                                 }}
// // // // // //                             >
// // // // // //                                 <View style={[styles.subjectDot, { backgroundColor: item.colorCode || theme.primary }]} />
// // // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // // //                                     {item.subjectName}
// // // // // //                                 </Text>
// // // // // //                                 {formData.subjectId === item.subjectId && (
// // // // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // // // //                                 )}
// // // // // //                             </TouchableOpacity>
// // // // // //                         )}
// // // // // //                     />
// // // // // //                 </View>
// // // // // //             </View>
// // // // // //         </Modal>
// // // // // //     );

// // // // // //     if (classesLoading) {
// // // // // //         return (
// // // // // //             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
// // // // // //                 <ActivityIndicator size="large" color={theme.primary} />
// // // // // //             </View>
// // // // // //         );
// // // // // //     }

// // // // // //     // Define toolbar actions with proper alignment icons
// // // // // //     const toolbarActions = [
// // // // // //         actions.setBold,
// // // // // //         actions.setItalic,
// // // // // //         actions.setUnderline,
// // // // // //         actions.insertBulletsList,
// // // // // //         actions.insertOrderedList,
// // // // // //         actions.setAlignLeft,
// // // // // //         actions.setAlignCenter,
// // // // // //         actions.setAlignRight,
// // // // // //         actions.undo,
// // // // // //         actions.redo,
// // // // // //         actions.insertImage,
// // // // // //     ];

// // // // // //     return (
// // // // // //         <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
// // // // // //             {/* Fixed Header */}
// // // // // //             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // // //                 <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
// // // // // //                     <Icon name="arrow-back" size={24} color={theme.text} />
// // // // // //                 </TouchableOpacity>
// // // // // //                 <Text style={[styles.headerTitle, { color: theme.text }]}>
// // // // // //                     {editEntry ? 'Edit Diary' : 'Create Diary'}
// // // // // //                 </Text>
// // // // // //                 <View style={styles.headerButton} />
// // // // // //             </View>

// // // // // //             {/* Fixed Selection Cards */}
// // // // // //             <View style={[styles.fixedSelectionContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
// // // // // //                 <View style={styles.selectionRow}>
// // // // // //                     <TouchableOpacity
// // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // //                         onPress={() => setShowClassModal(true)}
// // // // // //                         activeOpacity={0.7}
// // // // // //                     >
// // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // //                             <Icon name="school" size={22} color={theme.primary} />
// // // // // //                         </View>
// // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Class</Text>
// // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // //                             {formData.className || 'Select'}
// // // // // //                         </Text>
// // // // // //                     </TouchableOpacity>

// // // // // //                     <TouchableOpacity
// // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // //                         onPress={() => formData.classId ? setShowSectionModal(true) : Alert.alert('Info', 'Select class first')}
// // // // // //                         activeOpacity={0.7}
// // // // // //                     >
// // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // //                             <Icon name="groups" size={22} color={theme.primary} />
// // // // // //                         </View>
// // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Sections</Text>
// // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // //                             {formData.sectionIds.length ? `${formData.sectionIds.length} selected` : 'Select'}
// // // // // //                         </Text>
// // // // // //                     </TouchableOpacity>

// // // // // //                     <TouchableOpacity
// // // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // // //                         onPress={() => formData.classId && formData.sectionIds.length ? setShowSubjectModal(true) : Alert.alert('Info', 'Select class & sections first')}
// // // // // //                         activeOpacity={0.7}
// // // // // //                     >
// // // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // // //                             <Icon name="book" size={22} color={theme.primary} />
// // // // // //                         </View>
// // // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Subject</Text>
// // // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // // //                             {formData.subjectName || 'Select'}
// // // // // //                         </Text>
// // // // // //                     </TouchableOpacity>
// // // // // //                 </View>

// // // // // //                 {/* Selected Sections Tags */}
// // // // // //                 {formData.sectionIds.length > 0 && (
// // // // // //                     <View style={[styles.tagsContainer, { backgroundColor: theme.card }]}>
// // // // // //                         <Text style={[styles.tagsLabel, { color: theme.textSecondary }]}>Selected:</Text>
// // // // // //                         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
// // // // // //                             {formData.sectionNames.map((name, index) => (
// // // // // //                                 <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '15' }]}>
// // // // // //                                     <Text style={[styles.tagText, { color: theme.primary }]}>Sec {name}</Text>
// // // // // //                                 </View>
// // // // // //                             ))}
// // // // // //                         </ScrollView>
// // // // // //                     </View>
// // // // // //                 )}
// // // // // //             </View>

// // // // // //             {/* STICKY TOOLBAR - With all tools including Image */}
// // // // // //             <View style={[styles.stickyToolbar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // // //                 <RichToolbar
// // // // // //                     editor={richTextRef}
// // // // // //                     actions={toolbarActions}
// // // // // //                     iconMap={{
// // // // // //                         [actions.setBold]: ({ tintColor }) => <Icon name="format-bold" size={22} color={tintColor} />,
// // // // // //                         [actions.setItalic]: ({ tintColor }) => <Icon name="format-italic" size={22} color={tintColor} />,
// // // // // //                         [actions.setUnderline]: ({ tintColor }) => <Icon name="format-underlined" size={22} color={tintColor} />,
// // // // // //                         [actions.insertBulletsList]: ({ tintColor }) => <Icon name="format-list-bulleted" size={22} color={tintColor} />,
// // // // // //                         [actions.insertOrderedList]: ({ tintColor }) => <Icon name="format-list-numbered" size={22} color={tintColor} />,
// // // // // //                         [actions.setAlignLeft]: ({ tintColor }) => <Icon name="format-align-left" size={22} color={tintColor} />,
// // // // // //                         [actions.setAlignCenter]: ({ tintColor }) => <Icon name="format-align-center" size={22} color={tintColor} />,
// // // // // //                         [actions.setAlignRight]: ({ tintColor }) => <Icon name="format-align-right" size={22} color={tintColor} />,
// // // // // //                         [actions.undo]: ({ tintColor }) => <Icon name="undo" size={22} color={tintColor} />,
// // // // // //                         [actions.redo]: ({ tintColor }) => <Icon name="redo" size={22} color={tintColor} />,
// // // // // //                         [actions.insertImage]: ({ tintColor }) => <Icon name="image" size={22} color={tintColor} />,
// // // // // //                     }}
// // // // // //                     style={[styles.toolbar, { backgroundColor: theme.background }]}
// // // // // //                     onPressAddImage={pickAndInsertImage}
// // // // // //                 />
// // // // // //             </View>

// // // // // //             {/* Scrollable Editor Area */}
// // // // // //             <ScrollView 
// // // // // //                 style={styles.scrollView} 
// // // // // //                 showsVerticalScrollIndicator={true}
// // // // // //                 keyboardShouldPersistTaps="handled"
// // // // // //                 contentContainerStyle={{ paddingBottom: 80 }}
// // // // // //             >
// // // // // //                 <View style={styles.editorContainer}>
// // // // // //                     <RichEditor
// // // // // //                         ref={richTextRef}
// // // // // //                         initialContentHTML={formData.content}
// // // // // //                         onChange={(html) => setFormData({ ...formData, content: html })}
// // // // // //                         editorStyle={{
// // // // // //                             backgroundColor: theme.background,
// // // // // //                             color: theme.text,
// // // // // //                             placeholderColor: theme.textSecondary,
// // // // // //                             contentCSS: `body { 
// // // // // //                                 font-family: -apple-system; 
// // // // // //                                 font-size: 16px; 
// // // // // //                                 padding: 16px; 
// // // // // //                                 line-height: 1.6;
// // // // // //                                 min-height: 600px;
// // // // // //                             }
// // // // // //                             img { 
// // // // // //                                 max-width: 100%; 
// // // // // //                                 height: auto; 
// // // // // //                                 border-radius: 12px; 
// // // // // //                                 margin: 10px 0;
// // // // // //                             }
// // // // // //                             p { margin-bottom: 12px; }
// // // // // //                             h1, h2, h3 { margin: 16px 0 8px; }`,
// // // // // //                         }}
// // // // // //                         placeholder="Write your diary entry here..."
// // // // // //                         style={[styles.editor, { backgroundColor: theme.background, height: editorHeight }]}
// // // // // //                         onLoadEnd={() => setEditorHeight(600)}
// // // // // //                     />
// // // // // //                 </View>
// // // // // //             </ScrollView>

// // // // // //             {/* Fixed Action Buttons at Bottom */}
// // // // // //             <View style={[styles.fixedActions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
// // // // // //                 <TouchableOpacity
// // // // // //                     style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15', borderColor: theme.warning }]}
// // // // // //                     onPress={() => handleSave(false)}
// // // // // //                     disabled={isSaving || uploadingImage}
// // // // // //                 >
// // // // // //                     {isSaving ? (
// // // // // //                         <ActivityIndicator size="small" color={theme.warning} />
// // // // // //                     ) : (
// // // // // //                         <>
// // // // // //                             <Icon name="save" size={20} color={theme.warning} />
// // // // // //                             <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>
// // // // // //                         </>
// // // // // //                     )}
// // // // // //                 </TouchableOpacity>

// // // // // //                 <TouchableOpacity
// // // // // //                     style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
// // // // // //                     onPress={() => handleSave(true)}
// // // // // //                     disabled={isSaving || uploadingImage}
// // // // // //                 >
// // // // // //                     {isSaving ? (
// // // // // //                         <ActivityIndicator size="small" color="#FFF" />
// // // // // //                     ) : (
// // // // // //                         <>
// // // // // //                             <Icon name="send" size={20} color="#FFF" />
// // // // // //                             <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>
// // // // // //                         </>
// // // // // //                     )}
// // // // // //                 </TouchableOpacity>
// // // // // //             </View>

// // // // // //             {renderClassModal()}
// // // // // //             {renderSectionModal()}
// // // // // //             {renderSubjectModal()}
// // // // // //         </SafeAreaView>
// // // // // //     );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //     safeArea: {
// // // // // //         flex: 1,
// // // // // //     },
// // // // // //     loadingContainer: {
// // // // // //         flex: 1,
// // // // // //         justifyContent: 'center',
// // // // // //         alignItems: 'center',
// // // // // //     },
// // // // // //     header: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         justifyContent: 'space-between',
// // // // // //         paddingHorizontal: 16,
// // // // // //         paddingVertical: 14,
// // // // // //         borderBottomWidth: 1,
// // // // // //     },
// // // // // //     headerButton: {
// // // // // //         width: 40,
// // // // // //         height: 40,
// // // // // //         justifyContent: 'center',
// // // // // //         alignItems: 'center',
// // // // // //     },
// // // // // //     headerTitle: {
// // // // // //         fontSize: 18,
// // // // // //         fontWeight: '600',
// // // // // //     },
// // // // // //     fixedSelectionContainer: {
// // // // // //         paddingHorizontal: 16,
// // // // // //         paddingTop: 12,
// // // // // //         paddingBottom: 8,
// // // // // //         borderBottomWidth: 1,
// // // // // //     },
// // // // // //     selectionRow: {
// // // // // //         flexDirection: 'row',
// // // // // //         gap: 12,
// // // // // //         marginBottom: 8,
// // // // // //     },
// // // // // //     selectionCard: {
// // // // // //         flex: 1,
// // // // // //         alignItems: 'center',
// // // // // //         paddingVertical: 12,
// // // // // //         paddingHorizontal: 6,
// // // // // //         borderRadius: 12,
// // // // // //         borderWidth: 1,
// // // // // //     },
// // // // // //     cardIcon: {
// // // // // //         width: 40,
// // // // // //         height: 40,
// // // // // //         borderRadius: 20,
// // // // // //         justifyContent: 'center',
// // // // // //         alignItems: 'center',
// // // // // //         marginBottom: 6,
// // // // // //     },
// // // // // //     cardLabel: {
// // // // // //         fontSize: 10,
// // // // // //         marginBottom: 2,
// // // // // //     },
// // // // // //     cardValue: {
// // // // // //         fontSize: 11,
// // // // // //         fontWeight: '600',
// // // // // //         textAlign: 'center',
// // // // // //     },
// // // // // //     tagsContainer: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         paddingHorizontal: 10,
// // // // // //         paddingVertical: 8,
// // // // // //         borderRadius: 10,
// // // // // //         marginTop: 4,
// // // // // //         gap: 6,
// // // // // //     },
// // // // // //     tagsLabel: {
// // // // // //         fontSize: 11,
// // // // // //     },
// // // // // //     tagsScroll: {
// // // // // //         flexDirection: 'row',
// // // // // //     },
// // // // // //     tag: {
// // // // // //         paddingHorizontal: 8,
// // // // // //         paddingVertical: 3,
// // // // // //         borderRadius: 14,
// // // // // //         marginRight: 6,
// // // // // //     },
// // // // // //     tagText: {
// // // // // //         fontSize: 10,
// // // // // //         fontWeight: '500',
// // // // // //     },
// // // // // //     stickyToolbar: {
// // // // // //         borderBottomWidth: 1,
// // // // // //         zIndex: 10,
// // // // // //     },
// // // // // //     toolbar: {
// // // // // //         borderBottomWidth: 1,
// // // // // //         minHeight: 48,
// // // // // //         paddingHorizontal: 8,
// // // // // //     },
// // // // // //     scrollView: {
// // // // // //         flex: 1,
// // // // // //     },
// // // // // //     editorContainer: {
// // // // // //         padding: 16,
// // // // // //         minHeight: 600,
// // // // // //     },
// // // // // //     editor: {
// // // // // //         minHeight: 600,
// // // // // //         padding: 0,
// // // // // //     },
// // // // // //     fixedActions: {
// // // // // //         flexDirection: 'row',
// // // // // //         gap: 12,
// // // // // //         paddingHorizontal: 16,
// // // // // //         paddingVertical: 12,
// // // // // //         borderTopWidth: 1,
// // // // // //     },
// // // // // //     actionButton: {
// // // // // //         flex: 1,
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         justifyContent: 'center',
// // // // // //         paddingVertical: 12,
// // // // // //         borderRadius: 10,
// // // // // //         gap: 8,
// // // // // //     },
// // // // // //     draftButton: {
// // // // // //         borderWidth: 1,
// // // // // //     },
// // // // // //     publishButton: {
// // // // // //         elevation: 2,
// // // // // //         shadowColor: '#000',
// // // // // //         shadowOffset: { width: 0, height: 2 },
// // // // // //         shadowOpacity: 0.1,
// // // // // //         shadowRadius: 3,
// // // // // //     },
// // // // // //     actionButtonText: {
// // // // // //         fontSize: 14,
// // // // // //         fontWeight: '600',
// // // // // //     },
// // // // // //     modalOverlay: {
// // // // // //         flex: 1,
// // // // // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //         justifyContent: 'flex-end',
// // // // // //     },
// // // // // //     modalContent: {
// // // // // //         borderTopLeftRadius: 24,
// // // // // //         borderTopRightRadius: 24,
// // // // // //         padding: 20,
// // // // // //         maxHeight: '75%',
// // // // // //     },
// // // // // //     modalHeader: {
// // // // // //         flexDirection: 'row',
// // // // // //         justifyContent: 'space-between',
// // // // // //         alignItems: 'center',
// // // // // //         marginBottom: 20,
// // // // // //     },
// // // // // //     modalTitle: {
// // // // // //         fontSize: 20,
// // // // // //         fontWeight: 'bold',
// // // // // //     },
// // // // // //     selectAllButton: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         paddingVertical: 12,
// // // // // //         marginBottom: 8,
// // // // // //         borderBottomWidth: 1,
// // // // // //         gap: 12,
// // // // // //     },
// // // // // //     selectAllText: {
// // // // // //         fontSize: 15,
// // // // // //         fontWeight: '500',
// // // // // //     },
// // // // // //     modalItem: {
// // // // // //         flexDirection: 'row',
// // // // // //         alignItems: 'center',
// // // // // //         padding: 14,
// // // // // //         borderRadius: 12,
// // // // // //         marginBottom: 8,
// // // // // //         gap: 12,
// // // // // //     },
// // // // // //     modalItemIcon: {
// // // // // //         width: 40,
// // // // // //         height: 40,
// // // // // //         borderRadius: 20,
// // // // // //         justifyContent: 'center',
// // // // // //         alignItems: 'center',
// // // // // //     },
// // // // // //     modalItemText: {
// // // // // //         fontSize: 15,
// // // // // //     },
// // // // // //     subjectDot: {
// // // // // //         width: 12,
// // // // // //         height: 12,
// // // // // //         borderRadius: 6,
// // // // // //     },
// // // // // //     modalFooter: {
// // // // // //         marginTop: 16,
// // // // // //     },
// // // // // //     confirmButton: {
// // // // // //         paddingVertical: 14,
// // // // // //         borderRadius: 12,
// // // // // //         alignItems: 'center',
// // // // // //     },
// // // // // //     confirmButtonText: {
// // // // // //         color: '#FFF',
// // // // // //         fontSize: 15,
// // // // // //         fontWeight: '600',
// // // // // //     },
// // // // // // });

// // // // // // export default CreateDiaryScreen;

// // // // // // CreateDiaryScreen.js - COMPLETELY FIXED
// // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // import {
// // // // //     View,
// // // // //     Text,
// // // // //     StyleSheet,
// // // // //     ScrollView,
// // // // //     TouchableOpacity,
// // // // //     ActivityIndicator,
// // // // //     Alert,
// // // // //     Modal,
// // // // //     FlatList,
// // // // //     Platform,
// // // // //     SafeAreaView,
// // // // //     Dimensions,
// // // // // } from 'react-native';
// // // // // import { useSelector } from 'react-redux';
// // // // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // // // import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// // // // // import * as ImagePicker from 'expo-image-picker';
// // // // // import * as ImageManipulator from 'expo-image-manipulator';
// // // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // // import { selectCurrentUser } from '../../store/slices/authSlice';
// // // // // import {
// // // // //     useGetTeacherClassesQuery,
// // // // //     useGetSubjectsFromClassWiseQuery,
// // // // //     useCreateBatchDiaryMutation,
// // // // // } from '../../store/diaryApi';

// // // // // const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// // // // // const CreateDiaryScreen = ({ navigation, route }) => {
// // // // //     const theme = useSelector(selectThemeData);
// // // // //     const user = useSelector(selectCurrentUser);
// // // // //     const richTextRef = useRef(null);
    
// // // // //     const editEntry = route.params?.editEntry;

// // // // //     const [formData, setFormData] = useState({
// // // // //         classId: null,
// // // // //         className: '',
// // // // //         sectionIds: [],
// // // // //         sectionNames: [],
// // // // //         subjectId: null,
// // // // //         subjectName: '',
// // // // //         content: editEntry?.content || '<p><br></p>',
// // // // //     });
    
// // // // //     const [showClassModal, setShowClassModal] = useState(false);
// // // // //     const [showSectionModal, setShowSectionModal] = useState(false);
// // // // //     const [showSubjectModal, setShowSubjectModal] = useState(false);
// // // // //     const [isSaving, setIsSaving] = useState(false);
// // // // //     const [selectAllSections, setSelectAllSections] = useState(true);
// // // // //     const [editorHeight, setEditorHeight] = useState(500);
// // // // //     const [uploadingImage, setUploadingImage] = useState(false);

// // // // //     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
// // // // //     const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsFromClassWiseQuery(
// // // // //         { classId: formData.classId },
// // // // //         { skip: !formData.classId }
// // // // //     );

// // // // //     const [createBatchDiary] = useCreateBatchDiaryMutation();

// // // // //     const classes = classesData?.data || [];
// // // // //     const subjects = subjectsData?.data || [];
// // // // //     const selectedClass = classes.find(c => c.classId === formData.classId);
// // // // //     const sections = selectedClass?.sections || [];

// // // // //     // Auto-select all sections when class changes
// // // // //     useEffect(() => {
// // // // //         if (selectedClass && sections.length > 0 && selectAllSections) {
// // // // //             setFormData(prev => ({
// // // // //                 ...prev,
// // // // //                 sectionIds: sections.map(s => s.sectionId),
// // // // //                 sectionNames: sections.map(s => s.sectionName),
// // // // //             }));
// // // // //         }
// // // // //     }, [selectedClass, sections]);

// // // // //     // IMAGE HANDLER - Base64 embedding
// // // // //     const pickAndInsertImage = async () => {
// // // // //         try {
// // // // //             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// // // // //             if (status !== 'granted') {
// // // // //                 Alert.alert('Permission Required', 'Please grant camera roll permissions');
// // // // //                 return;
// // // // //             }

// // // // //             const result = await ImagePicker.launchImageLibraryAsync({
// // // // //                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
// // // // //                 quality: 1,
// // // // //                 allowsEditing: true,
// // // // //             });

// // // // //             if (result.canceled) return;

// // // // //             const image = result.assets[0];

// // // // //             if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
// // // // //                 Alert.alert('Image Too Large', 'Please select an image smaller than 2MB');
// // // // //                 return;
// // // // //             }

// // // // //             setUploadingImage(true);

// // // // //             const manipulatedImage = await ImageManipulator.manipulateAsync(
// // // // //                 image.uri,
// // // // //                 [{ resize: { width: 600 } }],
// // // // //                 {
// // // // //                     compress: 0.5,
// // // // //                     format: ImageManipulator.SaveFormat.JPEG,
// // // // //                     base64: true,
// // // // //                 }
// // // // //             );

// // // // //             const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;

// // // // //             const imageHtml = `<div style="text-align: center; margin: 12px 0;">
// // // // //                 <img src="${base64Image}" alt="Diary Image" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
// // // // //             </div>`;

// // // // //             richTextRef.current?.insertHTML(imageHtml);
            
// // // // //             Alert.alert('Success', 'Image added to diary');
// // // // //         } catch (error) {
// // // // //             console.error('Image pick error:', error);
// // // // //             Alert.alert('Error', 'Failed to add image');
// // // // //         } finally {
// // // // //             setUploadingImage(false);
// // // // //         }
// // // // //     };

// // // // //     const toggleSelectAllSections = () => {
// // // // //         if (selectAllSections) {
// // // // //             setFormData(prev => ({
// // // // //                 ...prev,
// // // // //                 sectionIds: [],
// // // // //                 sectionNames: [],
// // // // //             }));
// // // // //             setSelectAllSections(false);
// // // // //         } else {
// // // // //             setFormData(prev => ({
// // // // //                 ...prev,
// // // // //                 sectionIds: sections.map(s => s.sectionId),
// // // // //                 sectionNames: sections.map(s => s.sectionName),
// // // // //             }));
// // // // //             setSelectAllSections(true);
// // // // //         }
// // // // //     };

// // // // //     const toggleSection = (section) => {
// // // // //         const isSelected = formData.sectionIds.includes(section.sectionId);
        
// // // // //         if (isSelected) {
// // // // //             setFormData(prev => ({
// // // // //                 ...prev,
// // // // //                 sectionIds: prev.sectionIds.filter(id => id !== section.sectionId),
// // // // //                 sectionNames: prev.sectionNames.filter(name => name !== section.sectionName),
// // // // //             }));
// // // // //         } else {
// // // // //             setFormData(prev => ({
// // // // //                 ...prev,
// // // // //                 sectionIds: [...prev.sectionIds, section.sectionId],
// // // // //                 sectionNames: [...prev.sectionNames, section.sectionName],
// // // // //             }));
// // // // //         }
// // // // //     };

// // // // //     const handleSave = async (publish = false) => {
// // // // //         if (!formData.classId) {
// // // // //             Alert.alert('Error', 'Please select a class');
// // // // //             return;
// // // // //         }
// // // // //         if (formData.sectionIds.length === 0) {
// // // // //             Alert.alert('Error', 'Please select at least one section');
// // // // //             return;
// // // // //         }
// // // // //         if (!formData.subjectId) {
// // // // //             Alert.alert('Error', 'Please select a subject');
// // // // //             return;
// // // // //         }
        
// // // // //         let htmlContent = formData.content;
// // // // //         if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === ' ') {
// // // // //             Alert.alert('Error', 'Please write some content');
// // // // //             return;
// // // // //         }

// // // // //         setIsSaving(true);
// // // // //         try {
// // // // //             const diaryData = {
// // // // //                 Date: new Date().toISOString().split('T')[0],
// // // // //                 ClassID: formData.classId,
// // // // //                 SectionIds: formData.sectionIds,
// // // // //                 SubjectID: formData.subjectId,
// // // // //                 ClassWork: null,
// // // // //                 HomeWork: htmlContent,
// // // // //                 CreatedBy: user?.id || 1,
// // // // //                 isPublished: publish,
// // // // //             };

// // // // //             await createBatchDiary(diaryData).unwrap();
// // // // //             Alert.alert('Success', `Diary ${publish ? 'published' : 'saved as draft'} successfully!`, [
// // // // //                 { text: 'OK', onPress: () => navigation.goBack() }
// // // // //             ]);
// // // // //         } catch (error) {
// // // // //             console.error('Save error:', error);
// // // // //             Alert.alert('Error', error.data?.message || 'Failed to save diary');
// // // // //         } finally {
// // // // //             setIsSaving(false);
// // // // //         }
// // // // //     };

// // // // //     const handleBack = () => {
// // // // //         const hasContent = formData.content && 
// // // // //                           formData.content !== '<p><br></p>' && 
// // // // //                           formData.content !== ' ' &&
// // // // //                           formData.content.length > 50;
        
// // // // //         if (hasContent) {
// // // // //             Alert.alert(
// // // // //                 'Discard Changes',
// // // // //                 'You have unsaved changes. Are you sure you want to leave?',
// // // // //                 [
// // // // //                     { text: 'Stay', style: 'cancel' },
// // // // //                     { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
// // // // //                 ]
// // // // //             );
// // // // //         } else {
// // // // //             navigation.goBack();
// // // // //         }
// // // // //     };

// // // // //     const renderClassModal = () => (
// // // // //         <Modal visible={showClassModal} transparent animationType="slide" onRequestClose={() => setShowClassModal(false)}>
// // // // //             <View style={styles.modalOverlay}>
// // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // //                     <View style={styles.modalHeader}>
// // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Class</Text>
// // // // //                         <TouchableOpacity onPress={() => setShowClassModal(false)}>
// // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // //                         </TouchableOpacity>
// // // // //                     </View>
// // // // //                     <FlatList
// // // // //                         data={classes}
// // // // //                         keyExtractor={(item) => item.classId?.toString()}
// // // // //                         renderItem={({ item }) => (
// // // // //                             <TouchableOpacity
// // // // //                                 style={[
// // // // //                                     styles.modalItem,
// // // // //                                     formData.classId === item.classId && { backgroundColor: theme.primary + '15' }
// // // // //                                 ]}
// // // // //                                 onPress={() => {
// // // // //                                     setFormData({
// // // // //                                         ...formData,
// // // // //                                         classId: item.classId,
// // // // //                                         className: item.className,
// // // // //                                         sectionIds: [],
// // // // //                                         sectionNames: [],
// // // // //                                         subjectId: null,
// // // // //                                         subjectName: '',
// // // // //                                     });
// // // // //                                     setSelectAllSections(true);
// // // // //                                     setShowClassModal(false);
// // // // //                                 }}
// // // // //                             >
// // // // //                                 <View style={[styles.modalItemIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // //                                     <Icon name="school" size={20} color={theme.primary} />
// // // // //                                 </View>
// // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // //                                     {item.className}
// // // // //                                 </Text>
// // // // //                                 {formData.classId === item.classId && (
// // // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // // //                                 )}
// // // // //                             </TouchableOpacity>
// // // // //                         )}
// // // // //                     />
// // // // //                 </View>
// // // // //             </View>
// // // // //         </Modal>
// // // // //     );

// // // // //     const renderSectionModal = () => (
// // // // //         <Modal visible={showSectionModal} transparent animationType="slide" onRequestClose={() => setShowSectionModal(false)}>
// // // // //             <View style={styles.modalOverlay}>
// // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // //                     <View style={styles.modalHeader}>
// // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Sections</Text>
// // // // //                         <TouchableOpacity onPress={() => setShowSectionModal(false)}>
// // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // //                         </TouchableOpacity>
// // // // //                     </View>
                    
// // // // //                     {sections.length > 1 && (
// // // // //                         <TouchableOpacity
// // // // //                             style={[styles.selectAllButton, { borderBottomColor: theme.border }]}
// // // // //                             onPress={toggleSelectAllSections}
// // // // //                         >
// // // // //                             <Icon 
// // // // //                                 name={selectAllSections ? "check-box" : "check-box-outline-blank"} 
// // // // //                                 size={22} 
// // // // //                                 color={theme.primary} 
// // // // //                             />
// // // // //                             <Text style={[styles.selectAllText, { color: theme.text }]}>
// // // // //                                 {selectAllSections ? 'Deselect All' : 'Select All Sections'}
// // // // //                             </Text>
// // // // //                         </TouchableOpacity>
// // // // //                     )}
                    
// // // // //                     <FlatList
// // // // //                         data={sections}
// // // // //                         keyExtractor={(item) => item.sectionId?.toString()}
// // // // //                         renderItem={({ item }) => {
// // // // //                             const isSelected = formData.sectionIds.includes(item.sectionId);
// // // // //                             return (
// // // // //                                 <TouchableOpacity
// // // // //                                     style={[styles.modalItem, isSelected && { backgroundColor: theme.primary + '10' }]}
// // // // //                                     onPress={() => toggleSection(item)}
// // // // //                                 >
// // // // //                                     <Icon 
// // // // //                                         name={isSelected ? "check-box" : "check-box-outline-blank"} 
// // // // //                                         size={22} 
// // // // //                                         color={isSelected ? theme.primary : theme.textSecondary} 
// // // // //                                     />
// // // // //                                     <Text style={[styles.modalItemText, { color: theme.text, marginLeft: 12 }]}>
// // // // //                                         Section {item.sectionName}
// // // // //                                     </Text>
// // // // //                                 </TouchableOpacity>
// // // // //                             );
// // // // //                         }}
// // // // //                     />
// // // // //                     <View style={styles.modalFooter}>
// // // // //                         <TouchableOpacity
// // // // //                             style={[styles.confirmButton, { backgroundColor: theme.primary }]}
// // // // //                             onPress={() => setShowSectionModal(false)}
// // // // //                         >
// // // // //                             <Text style={styles.confirmButtonText}>
// // // // //                                 Confirm ({formData.sectionIds.length} selected)
// // // // //                             </Text>
// // // // //                         </TouchableOpacity>
// // // // //                     </View>
// // // // //                 </View>
// // // // //             </View>
// // // // //         </Modal>
// // // // //     );

// // // // //     const renderSubjectModal = () => (
// // // // //         <Modal visible={showSubjectModal} transparent animationType="slide" onRequestClose={() => setShowSubjectModal(false)}>
// // // // //             <View style={styles.modalOverlay}>
// // // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // // //                     <View style={styles.modalHeader}>
// // // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Subject</Text>
// // // // //                         <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
// // // // //                             <Icon name="close" size={24} color={theme.text} />
// // // // //                         </TouchableOpacity>
// // // // //                     </View>
// // // // //                     <FlatList
// // // // //                         data={subjects}
// // // // //                         keyExtractor={(item) => item.subjectId?.toString()}
// // // // //                         renderItem={({ item }) => (
// // // // //                             <TouchableOpacity
// // // // //                                 style={[
// // // // //                                     styles.modalItem,
// // // // //                                     formData.subjectId === item.subjectId && { backgroundColor: theme.primary + '15' }
// // // // //                                 ]}
// // // // //                                 onPress={() => {
// // // // //                                     setFormData({
// // // // //                                         ...formData,
// // // // //                                         subjectId: item.subjectId,
// // // // //                                         subjectName: item.subjectName,
// // // // //                                     });
// // // // //                                     setShowSubjectModal(false);
// // // // //                                 }}
// // // // //                             >
// // // // //                                 <View style={[styles.subjectDot, { backgroundColor: item.colorCode || theme.primary }]} />
// // // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // // //                                     {item.subjectName}
// // // // //                                 </Text>
// // // // //                                 {formData.subjectId === item.subjectId && (
// // // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // // //                                 )}
// // // // //                             </TouchableOpacity>
// // // // //                         )}
// // // // //                     />
// // // // //                 </View>
// // // // //             </View>
// // // // //         </Modal>
// // // // //     );

// // // // //     if (classesLoading) {
// // // // //         return (
// // // // //             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
// // // // //                 <ActivityIndicator size="large" color={theme.primary} />
// // // // //             </View>
// // // // //         );
// // // // //     }

// // // // //     // ✅ CORRECT TOOLBAR ACTIONS (using alignLeft, alignCenter, alignRight - NOT setAlign...)
// // // // //     const toolbarActions = [
// // // // //         actions.setBold,
// // // // //         actions.setItalic,
// // // // //         actions.setUnderline,
// // // // //         actions.alignLeft,      // ✅ CORRECT - NOT setAlignLeft
// // // // //         actions.alignCenter,    // ✅ CORRECT - NOT setAlignCenter
// // // // //         actions.alignRight,     // ✅ CORRECT - NOT setAlignRight
// // // // //         actions.insertBulletsList,
// // // // //         actions.insertOrderedList,
// // // // //         actions.undo,
// // // // //         actions.redo,
// // // // //         actions.insertImage,
// // // // //     ];

// // // // //     return (
// // // // //         <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
// // // // //             {/* Fixed Header */}
// // // // //             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // //                 <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
// // // // //                     <Icon name="arrow-back" size={24} color={theme.text} />
// // // // //                 </TouchableOpacity>
// // // // //                 <Text style={[styles.headerTitle, { color: theme.text }]}>
// // // // //                     {editEntry ? 'Edit Diary' : 'Create Diary'}
// // // // //                 </Text>
// // // // //                 <View style={styles.headerButton} />
// // // // //             </View>

// // // // //             {/* Fixed Selection Cards */}
// // // // //             <View style={[styles.fixedSelectionContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
// // // // //                 <View style={styles.selectionRow}>
// // // // //                     <TouchableOpacity
// // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // //                         onPress={() => setShowClassModal(true)}
// // // // //                         activeOpacity={0.7}
// // // // //                     >
// // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // //                             <Icon name="school" size={22} color={theme.primary} />
// // // // //                         </View>
// // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Class</Text>
// // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // //                             {formData.className || 'Select'}
// // // // //                         </Text>
// // // // //                     </TouchableOpacity>

// // // // //                     <TouchableOpacity
// // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // //                         onPress={() => formData.classId ? setShowSectionModal(true) : Alert.alert('Info', 'Select class first')}
// // // // //                         activeOpacity={0.7}
// // // // //                     >
// // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // //                             <Icon name="groups" size={22} color={theme.primary} />
// // // // //                         </View>
// // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Sections</Text>
// // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // //                             {formData.sectionIds.length ? `${formData.sectionIds.length} selected` : 'Select'}
// // // // //                         </Text>
// // // // //                     </TouchableOpacity>

// // // // //                     <TouchableOpacity
// // // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // // //                         onPress={() => formData.classId && formData.sectionIds.length ? setShowSubjectModal(true) : Alert.alert('Info', 'Select class & sections first')}
// // // // //                         activeOpacity={0.7}
// // // // //                     >
// // // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // // //                             <Icon name="book" size={22} color={theme.primary} />
// // // // //                         </View>
// // // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Subject</Text>
// // // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // // //                             {formData.subjectName || 'Select'}
// // // // //                         </Text>
// // // // //                     </TouchableOpacity>
// // // // //                 </View>

// // // // //                 {/* Selected Sections Tags */}
// // // // //                 {formData.sectionIds.length > 0 && (
// // // // //                     <View style={[styles.tagsContainer, { backgroundColor: theme.card }]}>
// // // // //                         <Text style={[styles.tagsLabel, { color: theme.textSecondary }]}>Selected:</Text>
// // // // //                         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
// // // // //                             {formData.sectionNames.map((name, index) => (
// // // // //                                 <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '15' }]}>
// // // // //                                     <Text style={[styles.tagText, { color: theme.primary }]}>Sec {name}</Text>
// // // // //                                 </View>
// // // // //                             ))}
// // // // //                         </ScrollView>
// // // // //                     </View>
// // // // //                 )}
// // // // //             </View>

// // // // //             {/* ✅ FIXED TOOLBAR - Using getEditor and correct actions */}
// // // // //             <View style={[styles.stickyToolbar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // // //                 <RichToolbar
// // // // //                     getEditor={() => richTextRef.current}  // ✅ CRITICAL FIX
// // // // //                     actions={toolbarActions}
// // // // //                     iconMap={{
// // // // //                         [actions.setBold]: ({ tintColor }) => (
// // // // //                             <Icon name="format-bold" size={22} color={tintColor} />
// // // // //                         ),
// // // // //                         [actions.setItalic]: ({ tintColor }) => (
// // // // //                             <Icon name="format-italic" size={22} color={tintColor} />
// // // // //                         ),
// // // // //                         [actions.setUnderline]: ({ tintColor }) => (
// // // // //                             <Icon name="format-underlined" size={22} color={tintColor} />
// // // // //                         ),
// // // // //                         // ✅ CORRECT ALIGNMENT ICONS
// // // // //                         [actions.alignLeft]: ({ tintColor }) => (
// // // // //                             <Icon name="format-align-left" size={22} color={tintColor} />
// // // // //                         ),
// // // // //                         [actions.alignCenter]: ({ tintColor }) => (
// // // // //                             <Icon name="format-align-center" size={22} color={tintColor} />
// // // // //                         ),
// // // // //                         [actions.alignRight]: ({ tintColor }) => (
// // // // //                             <Icon name="format-align-right" size={22} color={tintColor} />
// // // // //                         ),
// // // // //                         [actions.insertBulletsList]: ({ tintColor }) => (
// // // // //                             <Icon name="format-list-bulleted" size={22} color={tintColor} />
// // // // //                         ),
// // // // //                         [actions.insertOrderedList]: ({ tintColor }) => (
// // // // //                             <Icon name="format-list-numbered" size={22} color={tintColor} />
// // // // //                         ),
// // // // //                         [actions.undo]: ({ tintColor }) => (
// // // // //                             <Icon name="undo" size={22} color={tintColor} />
// // // // //                         ),
// // // // //                         [actions.redo]: ({ tintColor }) => (
// // // // //                             <Icon name="redo" size={22} color={tintColor} />
// // // // //                         ),
// // // // //                         [actions.insertImage]: ({ tintColor }) => (
// // // // //                             <Icon name="image" size={22} color={tintColor} />
// // // // //                         ),
// // // // //                     }}
// // // // //                     style={[styles.toolbar, { backgroundColor: theme.background }]}
// // // // //                     insertImage={pickAndInsertImage}
// // // // //                 />
// // // // //             </View>

// // // // //             {/* Scrollable Editor Area */}
// // // // //             <ScrollView 
// // // // //                 style={styles.scrollView} 
// // // // //                 showsVerticalScrollIndicator={true}
// // // // //                 keyboardShouldPersistTaps="handled"
// // // // //                 contentContainerStyle={{ paddingBottom: 80 }}
// // // // //             >
// // // // //                 <View style={styles.editorContainer}>
// // // // //                     <RichEditor
// // // // //                         ref={richTextRef}
// // // // //                         useContainer={true}
// // // // //                         initialFocus={false}
// // // // //                         initialContentHTML={formData.content}
// // // // //                         onChange={(html) => setFormData({ ...formData, content: html })}
// // // // //                         editorStyle={{
// // // // //                             backgroundColor: theme.background,
// // // // //                             color: theme.text,
// // // // //                             placeholderColor: theme.textSecondary,
// // // // //                             contentCSS: `body { 
// // // // //                                 font-family: -apple-system; 
// // // // //                                 font-size: 16px; 
// // // // //                                 padding: 16px; 
// // // // //                                 line-height: 1.6;
// // // // //                                 min-height: 600px;
// // // // //                             }
// // // // //                             img { 
// // // // //                                 max-width: 100%; 
// // // // //                                 height: auto; 
// // // // //                                 border-radius: 12px; 
// // // // //                                 margin: 10px 0;
// // // // //                             }
// // // // //                             p { margin-bottom: 12px; }
// // // // //                             h1, h2, h3 { margin: 16px 0 8px; }`,
// // // // //                         }}
// // // // //                         placeholder="Write your diary entry here..."
// // // // //                         style={[styles.editor, { backgroundColor: theme.background, height: editorHeight }]}
// // // // //                         onLoadEnd={() => setEditorHeight(600)}
// // // // //                         editorInitializedCallback={() => {
// // // // //                             console.log("✅ Editor Ready");
// // // // //                         }}
// // // // //                     />
// // // // //                 </View>
// // // // //             </ScrollView>

// // // // //             {/* Fixed Action Buttons at Bottom */}
// // // // //             <View style={[styles.fixedActions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
// // // // //                 <TouchableOpacity
// // // // //                     style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15', borderColor: theme.warning }]}
// // // // //                     onPress={() => handleSave(false)}
// // // // //                     disabled={isSaving || uploadingImage}
// // // // //                 >
// // // // //                     {isSaving ? (
// // // // //                         <ActivityIndicator size="small" color={theme.warning} />
// // // // //                     ) : (
// // // // //                         <>
// // // // //                             <Icon name="save" size={20} color={theme.warning} />
// // // // //                             <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>
// // // // //                         </>
// // // // //                     )}
// // // // //                 </TouchableOpacity>

// // // // //                 <TouchableOpacity
// // // // //                     style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
// // // // //                     onPress={() => handleSave(true)}
// // // // //                     disabled={isSaving || uploadingImage}
// // // // //                 >
// // // // //                     {isSaving ? (
// // // // //                         <ActivityIndicator size="small" color="#FFF" />
// // // // //                     ) : (
// // // // //                         <>
// // // // //                             <Icon name="send" size={20} color="#FFF" />
// // // // //                             <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>
// // // // //                         </>
// // // // //                     )}
// // // // //                 </TouchableOpacity>
// // // // //             </View>

// // // // //             {renderClassModal()}
// // // // //             {renderSectionModal()}
// // // // //             {renderSubjectModal()}
// // // // //         </SafeAreaView>
// // // // //     );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //     safeArea: {
// // // // //         flex: 1,
// // // // //     },
// // // // //     loadingContainer: {
// // // // //         flex: 1,
// // // // //         justifyContent: 'center',
// // // // //         alignItems: 'center',
// // // // //     },
// // // // //     header: {
// // // // //         flexDirection: 'row',
// // // // //         alignItems: 'center',
// // // // //         justifyContent: 'space-between',
// // // // //         paddingHorizontal: 16,
// // // // //         paddingVertical: 14,
// // // // //         borderBottomWidth: 1,
// // // // //     },
// // // // //     headerButton: {
// // // // //         width: 40,
// // // // //         height: 40,
// // // // //         justifyContent: 'center',
// // // // //         alignItems: 'center',
// // // // //     },
// // // // //     headerTitle: {
// // // // //         fontSize: 18,
// // // // //         fontWeight: '600',
// // // // //     },
// // // // //     fixedSelectionContainer: {
// // // // //         paddingHorizontal: 16,
// // // // //         paddingTop: 12,
// // // // //         paddingBottom: 8,
// // // // //         borderBottomWidth: 1,
// // // // //     },
// // // // //     selectionRow: {
// // // // //         flexDirection: 'row',
// // // // //         gap: 12,
// // // // //         marginBottom: 8,
// // // // //     },
// // // // //     selectionCard: {
// // // // //         flex: 1,
// // // // //         alignItems: 'center',
// // // // //         paddingVertical: 12,
// // // // //         paddingHorizontal: 6,
// // // // //         borderRadius: 12,
// // // // //         borderWidth: 1,
// // // // //     },
// // // // //     cardIcon: {
// // // // //         width: 40,
// // // // //         height: 40,
// // // // //         borderRadius: 20,
// // // // //         justifyContent: 'center',
// // // // //         alignItems: 'center',
// // // // //         marginBottom: 6,
// // // // //     },
// // // // //     cardLabel: {
// // // // //         fontSize: 10,
// // // // //         marginBottom: 2,
// // // // //     },
// // // // //     cardValue: {
// // // // //         fontSize: 11,
// // // // //         fontWeight: '600',
// // // // //         textAlign: 'center',
// // // // //     },
// // // // //     tagsContainer: {
// // // // //         flexDirection: 'row',
// // // // //         alignItems: 'center',
// // // // //         paddingHorizontal: 10,
// // // // //         paddingVertical: 8,
// // // // //         borderRadius: 10,
// // // // //         marginTop: 4,
// // // // //         gap: 6,
// // // // //     },
// // // // //     tagsLabel: {
// // // // //         fontSize: 11,
// // // // //     },
// // // // //     tagsScroll: {
// // // // //         flexDirection: 'row',
// // // // //     },
// // // // //     tag: {
// // // // //         paddingHorizontal: 8,
// // // // //         paddingVertical: 3,
// // // // //         borderRadius: 14,
// // // // //         marginRight: 6,
// // // // //     },
// // // // //     tagText: {
// // // // //         fontSize: 10,
// // // // //         fontWeight: '500',
// // // // //     },
// // // // //     stickyToolbar: {
// // // // //         borderBottomWidth: 1,
// // // // //         zIndex: 10,
// // // // //     },
// // // // //     toolbar: {
// // // // //         borderBottomWidth: 1,
// // // // //         minHeight: 48,
// // // // //         paddingHorizontal: 8,
// // // // //     },
// // // // //     scrollView: {
// // // // //         flex: 1,
// // // // //     },
// // // // //     editorContainer: {
// // // // //         padding: 16,
// // // // //         minHeight: 600,
// // // // //     },
// // // // //     editor: {
// // // // //         minHeight: 600,
// // // // //         padding: 0,
// // // // //     },
// // // // //     fixedActions: {
// // // // //         flexDirection: 'row',
// // // // //         gap: 12,
// // // // //         paddingHorizontal: 16,
// // // // //         paddingVertical: 12,
// // // // //         borderTopWidth: 1,
// // // // //     },
// // // // //     actionButton: {
// // // // //         flex: 1,
// // // // //         flexDirection: 'row',
// // // // //         alignItems: 'center',
// // // // //         justifyContent: 'center',
// // // // //         paddingVertical: 12,
// // // // //         borderRadius: 10,
// // // // //         gap: 8,
// // // // //     },
// // // // //     draftButton: {
// // // // //         borderWidth: 1,
// // // // //     },
// // // // //     publishButton: {
// // // // //         elevation: 2,
// // // // //         shadowColor: '#000',
// // // // //         shadowOffset: { width: 0, height: 2 },
// // // // //         shadowOpacity: 0.1,
// // // // //         shadowRadius: 3,
// // // // //     },
// // // // //     actionButtonText: {
// // // // //         fontSize: 14,
// // // // //         fontWeight: '600',
// // // // //     },
// // // // //     modalOverlay: {
// // // // //         flex: 1,
// // // // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // // // //         justifyContent: 'flex-end',
// // // // //     },
// // // // //     modalContent: {
// // // // //         borderTopLeftRadius: 24,
// // // // //         borderTopRightRadius: 24,
// // // // //         padding: 20,
// // // // //         maxHeight: '75%',
// // // // //     },
// // // // //     modalHeader: {
// // // // //         flexDirection: 'row',
// // // // //         justifyContent: 'space-between',
// // // // //         alignItems: 'center',
// // // // //         marginBottom: 20,
// // // // //     },
// // // // //     modalTitle: {
// // // // //         fontSize: 20,
// // // // //         fontWeight: 'bold',
// // // // //     },
// // // // //     selectAllButton: {
// // // // //         flexDirection: 'row',
// // // // //         alignItems: 'center',
// // // // //         paddingVertical: 12,
// // // // //         marginBottom: 8,
// // // // //         borderBottomWidth: 1,
// // // // //         gap: 12,
// // // // //     },
// // // // //     selectAllText: {
// // // // //         fontSize: 15,
// // // // //         fontWeight: '500',
// // // // //     },
// // // // //     modalItem: {
// // // // //         flexDirection: 'row',
// // // // //         alignItems: 'center',
// // // // //         padding: 14,
// // // // //         borderRadius: 12,
// // // // //         marginBottom: 8,
// // // // //         gap: 12,
// // // // //     },
// // // // //     modalItemIcon: {
// // // // //         width: 40,
// // // // //         height: 40,
// // // // //         borderRadius: 20,
// // // // //         justifyContent: 'center',
// // // // //         alignItems: 'center',
// // // // //     },
// // // // //     modalItemText: {
// // // // //         fontSize: 15,
// // // // //     },
// // // // //     subjectDot: {
// // // // //         width: 12,
// // // // //         height: 12,
// // // // //         borderRadius: 6,
// // // // //     },
// // // // //     modalFooter: {
// // // // //         marginTop: 16,
// // // // //     },
// // // // //     confirmButton: {
// // // // //         paddingVertical: 14,
// // // // //         borderRadius: 12,
// // // // //         alignItems: 'center',
// // // // //     },
// // // // //     confirmButtonText: {
// // // // //         color: '#FFF',
// // // // //         fontSize: 15,
// // // // //         fontWeight: '600',
// // // // //     },
// // // // // });

// // // // // export default CreateDiaryScreen;


// // // // // CreateDiaryScreen.js - WITH WORKING IMAGE PICKER
// // // // import React, { useState, useEffect, useRef } from 'react';
// // // // import {
// // // //     View,
// // // //     Text,
// // // //     StyleSheet,
// // // //     ScrollView,
// // // //     TouchableOpacity,
// // // //     ActivityIndicator,
// // // //     Alert,
// // // //     Modal,
// // // //     FlatList,
// // // //     Platform,
// // // //     SafeAreaView,
// // // //     Dimensions,
// // // // } from 'react-native';
// // // // import { useSelector } from 'react-redux';
// // // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // // import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// // // // import * as ImagePicker from 'expo-image-picker';
// // // // import * as ImageManipulator from 'expo-image-manipulator';
// // // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // // import { selectCurrentUser } from '../../store/slices/authSlice';
// // // // import {
// // // //     useGetTeacherClassesQuery,
// // // //     useGetSubjectsFromClassWiseQuery,
// // // //     useCreateBatchDiaryMutation,
// // // // } from '../../store/diaryApi';

// // // // const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// // // // const CreateDiaryScreen = ({ navigation, route }) => {
// // // //     const theme = useSelector(selectThemeData);
// // // //     const user = useSelector(selectCurrentUser);
// // // //     const richTextRef = useRef(null);
    
// // // //     const editEntry = route.params?.editEntry;

// // // //     const [formData, setFormData] = useState({
// // // //         classId: null,
// // // //         className: '',
// // // //         sectionIds: [],
// // // //         sectionNames: [],
// // // //         subjectId: null,
// // // //         subjectName: '',
// // // //         content: editEntry?.content || '<p><br></p>',
// // // //     });
    
// // // //     const [showClassModal, setShowClassModal] = useState(false);
// // // //     const [showSectionModal, setShowSectionModal] = useState(false);
// // // //     const [showSubjectModal, setShowSubjectModal] = useState(false);
// // // //     const [isSaving, setIsSaving] = useState(false);
// // // //     const [selectAllSections, setSelectAllSections] = useState(true);
// // // //     const [editorHeight, setEditorHeight] = useState(500);
// // // //     const [uploadingImage, setUploadingImage] = useState(false);

// // // //     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
// // // //     const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsFromClassWiseQuery(
// // // //         { classId: formData.classId },
// // // //         { skip: !formData.classId }
// // // //     );

// // // //     const [createBatchDiary] = useCreateBatchDiaryMutation();

// // // //     const classes = classesData?.data || [];
// // // //     const subjects = subjectsData?.data || [];
// // // //     const selectedClass = classes.find(c => c.classId === formData.classId);
// // // //     const sections = selectedClass?.sections || [];

// // // //     // Auto-select all sections when class changes
// // // //     useEffect(() => {
// // // //         if (selectedClass && sections.length > 0 && selectAllSections) {
// // // //             setFormData(prev => ({
// // // //                 ...prev,
// // // //                 sectionIds: sections.map(s => s.sectionId),
// // // //                 sectionNames: sections.map(s => s.sectionName),
// // // //             }));
// // // //         }
// // // //     }, [selectedClass, sections]);

// // // //     // ✅ IMAGE HANDLER - Base64 embedding (WORKING)
// // // //     const pickAndInsertImage = async () => {
// // // //         try {
// // // //             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// // // //             if (status !== 'granted') {
// // // //                 Alert.alert('Permission Required', 'Please grant camera roll permissions');
// // // //                 return;
// // // //             }

// // // //             const result = await ImagePicker.launchImageLibraryAsync({
// // // //                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
// // // //                 quality: 1,
// // // //                 allowsEditing: true,
// // // //             });

// // // //             if (result.canceled) return;

// // // //             const image = result.assets[0];

// // // //             if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
// // // //                 Alert.alert('Image Too Large', 'Please select an image smaller than 2MB');
// // // //                 return;
// // // //             }

// // // //             setUploadingImage(true);

// // // //             const manipulatedImage = await ImageManipulator.manipulateAsync(
// // // //                 image.uri,
// // // //                 [{ resize: { width: 600 } }],
// // // //                 {
// // // //                     compress: 0.5,
// // // //                     format: ImageManipulator.SaveFormat.JPEG,
// // // //                     base64: true,
// // // //                 }
// // // //             );

// // // //             const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;

// // // //             const imageHtml = `<div style="text-align: center; margin: 12px 0;">
// // // //                 <img src="${base64Image}" alt="Diary Image" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
// // // //             </div>`;

// // // //             // ✅ Insert at current cursor position
// // // //             richTextRef.current?.insertHTML(imageHtml);
            
// // // //             Alert.alert('Success', 'Image added to diary');
// // // //         } catch (error) {
// // // //             console.error('Image pick error:', error);
// // // //             Alert.alert('Error', 'Failed to add image');
// // // //         } finally {
// // // //             setUploadingImage(false);
// // // //         }
// // // //     };

// // // //     const toggleSelectAllSections = () => {
// // // //         if (selectAllSections) {
// // // //             setFormData(prev => ({
// // // //                 ...prev,
// // // //                 sectionIds: [],
// // // //                 sectionNames: [],
// // // //             }));
// // // //             setSelectAllSections(false);
// // // //         } else {
// // // //             setFormData(prev => ({
// // // //                 ...prev,
// // // //                 sectionIds: sections.map(s => s.sectionId),
// // // //                 sectionNames: sections.map(s => s.sectionName),
// // // //             }));
// // // //             setSelectAllSections(true);
// // // //         }
// // // //     };

// // // //     const toggleSection = (section) => {
// // // //         const isSelected = formData.sectionIds.includes(section.sectionId);
        
// // // //         if (isSelected) {
// // // //             setFormData(prev => ({
// // // //                 ...prev,
// // // //                 sectionIds: prev.sectionIds.filter(id => id !== section.sectionId),
// // // //                 sectionNames: prev.sectionNames.filter(name => name !== section.sectionName),
// // // //             }));
// // // //         } else {
// // // //             setFormData(prev => ({
// // // //                 ...prev,
// // // //                 sectionIds: [...prev.sectionIds, section.sectionId],
// // // //                 sectionNames: [...prev.sectionNames, section.sectionName],
// // // //             }));
// // // //         }
// // // //     };

// // // //     const handleSave = async (publish = false) => {
// // // //         if (!formData.classId) {
// // // //             Alert.alert('Error', 'Please select a class');
// // // //             return;
// // // //         }
// // // //         if (formData.sectionIds.length === 0) {
// // // //             Alert.alert('Error', 'Please select at least one section');
// // // //             return;
// // // //         }
// // // //         if (!formData.subjectId) {
// // // //             Alert.alert('Error', 'Please select a subject');
// // // //             return;
// // // //         }
        
// // // //         let htmlContent = formData.content;
// // // //         if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === ' ') {
// // // //             Alert.alert('Error', 'Please write some content');
// // // //             return;
// // // //         }

// // // //         setIsSaving(true);
// // // //         try {
// // // //             const diaryData = {
// // // //                 Date: new Date().toISOString().split('T')[0],
// // // //                 ClassID: formData.classId,
// // // //                 SectionIds: formData.sectionIds,
// // // //                 SubjectID: formData.subjectId,
// // // //                 ClassWork: null,
// // // //                 HomeWork: htmlContent,
// // // //                 CreatedBy: user?.id || 1,
// // // //                 isPublished: publish,
// // // //             };

// // // //             await createBatchDiary(diaryData).unwrap();
// // // //             Alert.alert('Success', `Diary ${publish ? 'published' : 'saved as draft'} successfully!`, [
// // // //                 { text: 'OK', onPress: () => navigation.goBack() }
// // // //             ]);
// // // //         } catch (error) {
// // // //             console.error('Save error:', error);
// // // //             Alert.alert('Error', error.data?.message || 'Failed to save diary');
// // // //         } finally {
// // // //             setIsSaving(false);
// // // //         }
// // // //     };

// // // //     const handleBack = () => {
// // // //         const hasContent = formData.content && 
// // // //                           formData.content !== '<p><br></p>' && 
// // // //                           formData.content !== ' ' &&
// // // //                           formData.content.length > 50;
        
// // // //         if (hasContent) {
// // // //             Alert.alert(
// // // //                 'Discard Changes',
// // // //                 'You have unsaved changes. Are you sure you want to leave?',
// // // //                 [
// // // //                     { text: 'Stay', style: 'cancel' },
// // // //                     { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
// // // //                 ]
// // // //             );
// // // //         } else {
// // // //             navigation.goBack();
// // // //         }
// // // //     };

// // // //     const renderClassModal = () => (
// // // //         <Modal visible={showClassModal} transparent animationType="slide" onRequestClose={() => setShowClassModal(false)}>
// // // //             <View style={styles.modalOverlay}>
// // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // //                     <View style={styles.modalHeader}>
// // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Class</Text>
// // // //                         <TouchableOpacity onPress={() => setShowClassModal(false)}>
// // // //                             <Icon name="close" size={24} color={theme.text} />
// // // //                         </TouchableOpacity>
// // // //                     </View>
// // // //                     <FlatList
// // // //                         data={classes}
// // // //                         keyExtractor={(item) => item.classId?.toString()}
// // // //                         renderItem={({ item }) => (
// // // //                             <TouchableOpacity
// // // //                                 style={[
// // // //                                     styles.modalItem,
// // // //                                     formData.classId === item.classId && { backgroundColor: theme.primary + '15' }
// // // //                                 ]}
// // // //                                 onPress={() => {
// // // //                                     setFormData({
// // // //                                         ...formData,
// // // //                                         classId: item.classId,
// // // //                                         className: item.className,
// // // //                                         sectionIds: [],
// // // //                                         sectionNames: [],
// // // //                                         subjectId: null,
// // // //                                         subjectName: '',
// // // //                                     });
// // // //                                     setSelectAllSections(true);
// // // //                                     setShowClassModal(false);
// // // //                                 }}
// // // //                             >
// // // //                                 <View style={[styles.modalItemIcon, { backgroundColor: theme.primary + '15' }]}>
// // // //                                     <Icon name="school" size={20} color={theme.primary} />
// // // //                                 </View>
// // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // //                                     {item.className}
// // // //                                 </Text>
// // // //                                 {formData.classId === item.classId && (
// // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // //                                 )}
// // // //                             </TouchableOpacity>
// // // //                         )}
// // // //                     />
// // // //                 </View>
// // // //             </View>
// // // //         </Modal>
// // // //     );

// // // //     const renderSectionModal = () => (
// // // //         <Modal visible={showSectionModal} transparent animationType="slide" onRequestClose={() => setShowSectionModal(false)}>
// // // //             <View style={styles.modalOverlay}>
// // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // //                     <View style={styles.modalHeader}>
// // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Sections</Text>
// // // //                         <TouchableOpacity onPress={() => setShowSectionModal(false)}>
// // // //                             <Icon name="close" size={24} color={theme.text} />
// // // //                         </TouchableOpacity>
// // // //                     </View>
                    
// // // //                     {sections.length > 1 && (
// // // //                         <TouchableOpacity
// // // //                             style={[styles.selectAllButton, { borderBottomColor: theme.border }]}
// // // //                             onPress={toggleSelectAllSections}
// // // //                         >
// // // //                             <Icon 
// // // //                                 name={selectAllSections ? "check-box" : "check-box-outline-blank"} 
// // // //                                 size={22} 
// // // //                                 color={theme.primary} 
// // // //                             />
// // // //                             <Text style={[styles.selectAllText, { color: theme.text }]}>
// // // //                                 {selectAllSections ? 'Deselect All' : 'Select All Sections'}
// // // //                             </Text>
// // // //                         </TouchableOpacity>
// // // //                     )}
                    
// // // //                     <FlatList
// // // //                         data={sections}
// // // //                         keyExtractor={(item) => item.sectionId?.toString()}
// // // //                         renderItem={({ item }) => {
// // // //                             const isSelected = formData.sectionIds.includes(item.sectionId);
// // // //                             return (
// // // //                                 <TouchableOpacity
// // // //                                     style={[styles.modalItem, isSelected && { backgroundColor: theme.primary + '10' }]}
// // // //                                     onPress={() => toggleSection(item)}
// // // //                                 >
// // // //                                     <Icon 
// // // //                                         name={isSelected ? "check-box" : "check-box-outline-blank"} 
// // // //                                         size={22} 
// // // //                                         color={isSelected ? theme.primary : theme.textSecondary} 
// // // //                                     />
// // // //                                     <Text style={[styles.modalItemText, { color: theme.text, marginLeft: 12 }]}>
// // // //                                         Section {item.sectionName}
// // // //                                     </Text>
// // // //                                 </TouchableOpacity>
// // // //                             );
// // // //                         }}
// // // //                     />
// // // //                     <View style={styles.modalFooter}>
// // // //                         <TouchableOpacity
// // // //                             style={[styles.confirmButton, { backgroundColor: theme.primary }]}
// // // //                             onPress={() => setShowSectionModal(false)}
// // // //                         >
// // // //                             <Text style={styles.confirmButtonText}>
// // // //                                 Confirm ({formData.sectionIds.length} selected)
// // // //                             </Text>
// // // //                         </TouchableOpacity>
// // // //                     </View>
// // // //                 </View>
// // // //             </View>
// // // //         </Modal>
// // // //     );

// // // //     const renderSubjectModal = () => (
// // // //         <Modal visible={showSubjectModal} transparent animationType="slide" onRequestClose={() => setShowSubjectModal(false)}>
// // // //             <View style={styles.modalOverlay}>
// // // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // // //                     <View style={styles.modalHeader}>
// // // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Subject</Text>
// // // //                         <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
// // // //                             <Icon name="close" size={24} color={theme.text} />
// // // //                         </TouchableOpacity>
// // // //                     </View>
// // // //                     <FlatList
// // // //                         data={subjects}
// // // //                         keyExtractor={(item) => item.subjectId?.toString()}
// // // //                         renderItem={({ item }) => (
// // // //                             <TouchableOpacity
// // // //                                 style={[
// // // //                                     styles.modalItem,
// // // //                                     formData.subjectId === item.subjectId && { backgroundColor: theme.primary + '15' }
// // // //                                 ]}
// // // //                                 onPress={() => {
// // // //                                     setFormData({
// // // //                                         ...formData,
// // // //                                         subjectId: item.subjectId,
// // // //                                         subjectName: item.subjectName,
// // // //                                     });
// // // //                                     setShowSubjectModal(false);
// // // //                                 }}
// // // //                             >
// // // //                                 <View style={[styles.subjectDot, { backgroundColor: item.colorCode || theme.primary }]} />
// // // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // // //                                     {item.subjectName}
// // // //                                 </Text>
// // // //                                 {formData.subjectId === item.subjectId && (
// // // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // // //                                 )}
// // // //                             </TouchableOpacity>
// // // //                         )}
// // // //                     />
// // // //                 </View>
// // // //             </View>
// // // //         </Modal>
// // // //     );

// // // //     if (classesLoading) {
// // // //         return (
// // // //             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
// // // //                 <ActivityIndicator size="large" color={theme.primary} />
// // // //             </View>
// // // //         );
// // // //     }

// // // //     // ✅ Toolbar actions - WITHOUT insertImage in the main array
// // // //     const toolbarActions = [
// // // //         actions.setBold,
// // // //         actions.setItalic,
// // // //         actions.setUnderline,
// // // //         actions.alignLeft,
// // // //         actions.alignCenter,
// // // //         actions.alignRight,
// // // //         actions.insertBulletsList,
// // // //         actions.insertOrderedList,
// // // //         actions.undo,
// // // //         actions.redo,
// // // //     ];

// // // //     return (
// // // //         <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
// // // //             {/* Fixed Header */}
// // // //             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // //                 <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
// // // //                     <Icon name="arrow-back" size={24} color={theme.text} />
// // // //                 </TouchableOpacity>
// // // //                 <Text style={[styles.headerTitle, { color: theme.text }]}>
// // // //                     {editEntry ? 'Edit Diary' : 'Create Diary'}
// // // //                 </Text>
// // // //                 <View style={styles.headerButton} />
// // // //             </View>

// // // //             {/* Fixed Selection Cards */}
// // // //             <View style={[styles.fixedSelectionContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
// // // //                 <View style={styles.selectionRow}>
// // // //                     <TouchableOpacity
// // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // //                         onPress={() => setShowClassModal(true)}
// // // //                         activeOpacity={0.7}
// // // //                     >
// // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // //                             <Icon name="school" size={22} color={theme.primary} />
// // // //                         </View>
// // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Class</Text>
// // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // //                             {formData.className || 'Select'}
// // // //                         </Text>
// // // //                     </TouchableOpacity>

// // // //                     <TouchableOpacity
// // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // //                         onPress={() => formData.classId ? setShowSectionModal(true) : Alert.alert('Info', 'Select class first')}
// // // //                         activeOpacity={0.7}
// // // //                     >
// // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // //                             <Icon name="groups" size={22} color={theme.primary} />
// // // //                         </View>
// // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Sections</Text>
// // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // //                             {formData.sectionIds.length ? `${formData.sectionIds.length} selected` : 'Select'}
// // // //                         </Text>
// // // //                     </TouchableOpacity>

// // // //                     <TouchableOpacity
// // // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // // //                         onPress={() => formData.classId && formData.sectionIds.length ? setShowSubjectModal(true) : Alert.alert('Info', 'Select class & sections first')}
// // // //                         activeOpacity={0.7}
// // // //                     >
// // // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // // //                             <Icon name="book" size={22} color={theme.primary} />
// // // //                         </View>
// // // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Subject</Text>
// // // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // // //                             {formData.subjectName || 'Select'}
// // // //                         </Text>
// // // //                     </TouchableOpacity>
// // // //                 </View>

// // // //                 {/* Selected Sections Tags */}
// // // //                 {formData.sectionIds.length > 0 && (
// // // //                     <View style={[styles.tagsContainer, { backgroundColor: theme.card }]}>
// // // //                         <Text style={[styles.tagsLabel, { color: theme.textSecondary }]}>Selected:</Text>
// // // //                         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
// // // //                             {formData.sectionNames.map((name, index) => (
// // // //                                 <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '15' }]}>
// // // //                                     <Text style={[styles.tagText, { color: theme.primary }]}>Sec {name}</Text>
// // // //                                 </View>
// // // //                             ))}
// // // //                         </ScrollView>
// // // //                     </View>
// // // //                 )}
// // // //             </View>

// // // //             {/* ✅ FIXED TOOLBAR - With separate Image Button */}
// // // //             <View style={[styles.stickyToolbar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // // //                 <RichToolbar
// // // //                     getEditor={() => richTextRef.current}
// // // //                     actions={toolbarActions}
// // // //                     iconMap={{
// // // //                         [actions.setBold]: ({ tintColor }) => (
// // // //                             <Icon name="format-bold" size={22} color={tintColor} />
// // // //                         ),
// // // //                         [actions.setItalic]: ({ tintColor }) => (
// // // //                             <Icon name="format-italic" size={22} color={tintColor} />
// // // //                         ),
// // // //                         [actions.setUnderline]: ({ tintColor }) => (
// // // //                             <Icon name="format-underlined" size={22} color={tintColor} />
// // // //                         ),
// // // //                         [actions.alignLeft]: ({ tintColor }) => (
// // // //                             <Icon name="format-align-left" size={22} color={tintColor} />
// // // //                         ),
// // // //                         [actions.alignCenter]: ({ tintColor }) => (
// // // //                             <Icon name="format-align-center" size={22} color={tintColor} />
// // // //                         ),
// // // //                         [actions.alignRight]: ({ tintColor }) => (
// // // //                             <Icon name="format-align-right" size={22} color={tintColor} />
// // // //                         ),
// // // //                         [actions.insertBulletsList]: ({ tintColor }) => (
// // // //                             <Icon name="format-list-bulleted" size={22} color={tintColor} />
// // // //                         ),
// // // //                         [actions.insertOrderedList]: ({ tintColor }) => (
// // // //                             <Icon name="format-list-numbered" size={22} color={tintColor} />
// // // //                         ),
// // // //                         [actions.undo]: ({ tintColor }) => (
// // // //                             <Icon name="undo" size={22} color={tintColor} />
// // // //                         ),
// // // //                         [actions.redo]: ({ tintColor }) => (
// // // //                             <Icon name="redo" size={22} color={tintColor} />
// // // //                         ),
// // // //                     }}
// // // //                     style={[styles.toolbar, { backgroundColor: theme.background }]}
// // // //                 />
                
// // // //                 {/* ✅ Separate Image Button Row - WORKING */}
// // // //                 <View style={[styles.imageButtonRow, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
// // // //                     <TouchableOpacity
// // // //                         style={styles.imageButton}
// // // //                         onPress={pickAndInsertImage}
// // // //                         disabled={uploadingImage}
// // // //                     >
// // // //                         {uploadingImage ? (
// // // //                             <ActivityIndicator size="small" color={theme.primary} />
// // // //                         ) : (
// // // //                             <>
// // // //                                 <Icon name="image" size={22} color={theme.primary} />
// // // //                                 <Text style={[styles.imageButtonText, { color: theme.primary }]}>Insert Image</Text>
// // // //                             </>
// // // //                         )}
// // // //                     </TouchableOpacity>
// // // //                 </View>
// // // //             </View>

// // // //             {/* Scrollable Editor Area */}
// // // //             <ScrollView 
// // // //                 style={styles.scrollView} 
// // // //                 showsVerticalScrollIndicator={true}
// // // //                 keyboardShouldPersistTaps="handled"
// // // //                 contentContainerStyle={{ paddingBottom: 80 }}
// // // //             >
// // // //                 <View style={styles.editorContainer}>
// // // //                     <RichEditor
// // // //                         ref={richTextRef}
// // // //                         useContainer={true}
// // // //                         initialFocus={false}
// // // //                         initialContentHTML={formData.content}
// // // //                         onChange={(html) => setFormData({ ...formData, content: html })}
// // // //                         editorStyle={{
// // // //                             backgroundColor: theme.background,
// // // //                             color: theme.text,
// // // //                             placeholderColor: theme.textSecondary,
// // // //                             contentCSS: `body { 
// // // //                                 font-family: -apple-system; 
// // // //                                 font-size: 16px; 
// // // //                                 padding: 16px; 
// // // //                                 line-height: 1.6;
// // // //                                 min-height: 600px;
// // // //                             }
// // // //                             img { 
// // // //                                 max-width: 100%; 
// // // //                                 height: auto; 
// // // //                                 border-radius: 12px; 
// // // //                                 margin: 10px 0;
// // // //                             }
// // // //                             p { margin-bottom: 12px; }
// // // //                             h1, h2, h3 { margin: 16px 0 8px; }`,
// // // //                         }}
// // // //                         placeholder="Write your diary entry here..."
// // // //                         style={[styles.editor, { backgroundColor: theme.background, height: editorHeight }]}
// // // //                         onLoadEnd={() => setEditorHeight(600)}
// // // //                         editorInitializedCallback={() => {
// // // //                             console.log("✅ Editor Ready");
// // // //                         }}
// // // //                     />
// // // //                 </View>
// // // //             </ScrollView>

// // // //             {/* Fixed Action Buttons at Bottom */}
// // // //             <View style={[styles.fixedActions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
// // // //                 <TouchableOpacity
// // // //                     style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15', borderColor: theme.warning }]}
// // // //                     onPress={() => handleSave(false)}
// // // //                     disabled={isSaving || uploadingImage}
// // // //                 >
// // // //                     {isSaving ? (
// // // //                         <ActivityIndicator size="small" color={theme.warning} />
// // // //                     ) : (
// // // //                         <>
// // // //                             <Icon name="save" size={20} color={theme.warning} />
// // // //                             <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>
// // // //                         </>
// // // //                     )}
// // // //                 </TouchableOpacity>

// // // //                 <TouchableOpacity
// // // //                     style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
// // // //                     onPress={() => handleSave(true)}
// // // //                     disabled={isSaving || uploadingImage}
// // // //                 >
// // // //                     {isSaving ? (
// // // //                         <ActivityIndicator size="small" color="#FFF" />
// // // //                     ) : (
// // // //                         <>
// // // //                             <Icon name="send" size={20} color="#FFF" />
// // // //                             <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>
// // // //                         </>
// // // //                     )}
// // // //                 </TouchableOpacity>
// // // //             </View>

// // // //             {renderClassModal()}
// // // //             {renderSectionModal()}
// // // //             {renderSubjectModal()}
// // // //         </SafeAreaView>
// // // //     );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //     safeArea: {
// // // //         flex: 1,
// // // //     },
// // // //     loadingContainer: {
// // // //         flex: 1,
// // // //         justifyContent: 'center',
// // // //         alignItems: 'center',
// // // //     },
// // // //     header: {
// // // //         flexDirection: 'row',
// // // //         alignItems: 'center',
// // // //         justifyContent: 'space-between',
// // // //         paddingHorizontal: 16,
// // // //         paddingVertical: 14,
// // // //         borderBottomWidth: 1,
// // // //     },
// // // //     headerButton: {
// // // //         width: 40,
// // // //         height: 40,
// // // //         justifyContent: 'center',
// // // //         alignItems: 'center',
// // // //     },
// // // //     headerTitle: {
// // // //         fontSize: 18,
// // // //         fontWeight: '600',
// // // //     },
// // // //     fixedSelectionContainer: {
// // // //         paddingHorizontal: 16,
// // // //         paddingTop: 12,
// // // //         paddingBottom: 8,
// // // //         borderBottomWidth: 1,
// // // //     },
// // // //     selectionRow: {
// // // //         flexDirection: 'row',
// // // //         gap: 12,
// // // //         marginBottom: 8,
// // // //     },
// // // //     selectionCard: {
// // // //         flex: 1,
// // // //         alignItems: 'center',
// // // //         paddingVertical: 12,
// // // //         paddingHorizontal: 6,
// // // //         borderRadius: 12,
// // // //         borderWidth: 1,
// // // //     },
// // // //     cardIcon: {
// // // //         width: 40,
// // // //         height: 40,
// // // //         borderRadius: 20,
// // // //         justifyContent: 'center',
// // // //         alignItems: 'center',
// // // //         marginBottom: 6,
// // // //     },
// // // //     cardLabel: {
// // // //         fontSize: 10,
// // // //         marginBottom: 2,
// // // //     },
// // // //     cardValue: {
// // // //         fontSize: 11,
// // // //         fontWeight: '600',
// // // //         textAlign: 'center',
// // // //     },
// // // //     tagsContainer: {
// // // //         flexDirection: 'row',
// // // //         alignItems: 'center',
// // // //         paddingHorizontal: 10,
// // // //         paddingVertical: 8,
// // // //         borderRadius: 10,
// // // //         marginTop: 4,
// // // //         gap: 6,
// // // //     },
// // // //     tagsLabel: {
// // // //         fontSize: 11,
// // // //     },
// // // //     tagsScroll: {
// // // //         flexDirection: 'row',
// // // //     },
// // // //     tag: {
// // // //         paddingHorizontal: 8,
// // // //         paddingVertical: 3,
// // // //         borderRadius: 14,
// // // //         marginRight: 6,
// // // //     },
// // // //     tagText: {
// // // //         fontSize: 10,
// // // //         fontWeight: '500',
// // // //     },
// // // //     stickyToolbar: {
// // // //         borderBottomWidth: 1,
// // // //         zIndex: 10,
// // // //     },
// // // //     toolbar: {
// // // //         borderBottomWidth: 1,
// // // //         minHeight: 48,
// // // //         paddingHorizontal: 8,
// // // //     },
// // // //     imageButtonRow: {
// // // //         flexDirection: 'row',
// // // //         paddingHorizontal: 12,
// // // //         paddingVertical: 8,
// // // //         borderTopWidth: 1,
// // // //     },
// // // //     imageButton: {
// // // //         flexDirection: 'row',
// // // //         alignItems: 'center',
// // // //         gap: 8,
// // // //         paddingHorizontal: 12,
// // // //         paddingVertical: 6,
// // // //         borderRadius: 8,
// // // //     },
// // // //     imageButtonText: {
// // // //         fontSize: 13,
// // // //         fontWeight: '500',
// // // //     },
// // // //     scrollView: {
// // // //         flex: 1,
// // // //     },
// // // //     editorContainer: {
// // // //         padding: 16,
// // // //         minHeight: 600,
// // // //     },
// // // //     editor: {
// // // //         minHeight: 600,
// // // //         padding: 0,
// // // //     },
// // // //     fixedActions: {
// // // //         flexDirection: 'row',
// // // //         gap: 12,
// // // //         paddingHorizontal: 16,
// // // //         paddingVertical: 12,
// // // //         borderTopWidth: 1,
// // // //     },
// // // //     actionButton: {
// // // //         flex: 1,
// // // //         flexDirection: 'row',
// // // //         alignItems: 'center',
// // // //         justifyContent: 'center',
// // // //         paddingVertical: 12,
// // // //         borderRadius: 10,
// // // //         gap: 8,
// // // //     },
// // // //     draftButton: {
// // // //         borderWidth: 1,
// // // //     },
// // // //     publishButton: {
// // // //         elevation: 2,
// // // //         shadowColor: '#000',
// // // //         shadowOffset: { width: 0, height: 2 },
// // // //         shadowOpacity: 0.1,
// // // //         shadowRadius: 3,
// // // //     },
// // // //     actionButtonText: {
// // // //         fontSize: 14,
// // // //         fontWeight: '600',
// // // //     },
// // // //     modalOverlay: {
// // // //         flex: 1,
// // // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // // //         justifyContent: 'flex-end',
// // // //     },
// // // //     modalContent: {
// // // //         borderTopLeftRadius: 24,
// // // //         borderTopRightRadius: 24,
// // // //         padding: 20,
// // // //         maxHeight: '75%',
// // // //     },
// // // //     modalHeader: {
// // // //         flexDirection: 'row',
// // // //         justifyContent: 'space-between',
// // // //         alignItems: 'center',
// // // //         marginBottom: 20,
// // // //     },
// // // //     modalTitle: {
// // // //         fontSize: 20,
// // // //         fontWeight: 'bold',
// // // //     },
// // // //     selectAllButton: {
// // // //         flexDirection: 'row',
// // // //         alignItems: 'center',
// // // //         paddingVertical: 12,
// // // //         marginBottom: 8,
// // // //         borderBottomWidth: 1,
// // // //         gap: 12,
// // // //     },
// // // //     selectAllText: {
// // // //         fontSize: 15,
// // // //         fontWeight: '500',
// // // //     },
// // // //     modalItem: {
// // // //         flexDirection: 'row',
// // // //         alignItems: 'center',
// // // //         padding: 14,
// // // //         borderRadius: 12,
// // // //         marginBottom: 8,
// // // //         gap: 12,
// // // //     },
// // // //     modalItemIcon: {
// // // //         width: 40,
// // // //         height: 40,
// // // //         borderRadius: 20,
// // // //         justifyContent: 'center',
// // // //         alignItems: 'center',
// // // //     },
// // // //     modalItemText: {
// // // //         fontSize: 15,
// // // //     },
// // // //     subjectDot: {
// // // //         width: 12,
// // // //         height: 12,
// // // //         borderRadius: 6,
// // // //     },
// // // //     modalFooter: {
// // // //         marginTop: 16,
// // // //     },
// // // //     confirmButton: {
// // // //         paddingVertical: 14,
// // // //         borderRadius: 12,
// // // //         alignItems: 'center',
// // // //     },
// // // //     confirmButtonText: {
// // // //         color: '#FFF',
// // // //         fontSize: 15,
// // // //         fontWeight: '600',
// // // //     },
// // // // });

// // // // export default CreateDiaryScreen;

// // // // CreateDiaryScreen.js 
// // // import React, { useState, useEffect, useRef } from 'react';
// // // import {
// // //     View,
// // //     Text,
// // //     StyleSheet,
// // //     ScrollView,
// // //     TouchableOpacity,
// // //     ActivityIndicator,
// // //     Alert,
// // //     Modal,
// // //     FlatList,
// // //     Platform,
// // //     SafeAreaView,
// // //     Dimensions,
// // // } from 'react-native';
// // // import { useSelector } from 'react-redux';
// // // import Icon from 'react-native-vector-icons/MaterialIcons';
// // // import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// // // import * as ImagePicker from 'expo-image-picker';
// // // import * as ImageManipulator from 'expo-image-manipulator';
// // // import { selectThemeData } from '../../store/slices/themeSlice';
// // // import { selectCurrentUser } from '../../store/slices/authSlice';
// // // import {
// // //     useGetTeacherClassesQuery,
// // //     useGetSubjectsFromClassWiseQuery,
// // //     useCreateBatchDiaryMutation,
// // // } from '../../store/diaryApi';

// // // const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// // // const CreateDiaryScreen = ({ navigation, route }) => {
// // //     const theme = useSelector(selectThemeData);
// // //     const user = useSelector(selectCurrentUser);
// // //     const richTextRef = useRef(null);
    
// // //     const editEntry = route.params?.editEntry;
// // //     const isEditMode = !!editEntry;


// // //     console.log('📥 Received editEntry:', JSON.stringify(editEntry, null, 2));
// // // console.log('📥 Is edit mode:', isEditMode);
// // //     // Initialize formData with edit entry data if available
// // //     const [formData, setFormData] = useState({
// // //         classId: editEntry?.classId || null,
// // //         className: editEntry?.className || '',
// // //         sectionIds: editEntry?.sectionIds || [],
// // //         sectionNames: editEntry?.sectionNames || [],
// // //         subjectId: editEntry?.subjectId || null,
// // //         subjectName: editEntry?.subjectName || '',
// // //         content: editEntry?.content || '<p><br></p>',
// // //     });
    
// // //     const [showClassModal, setShowClassModal] = useState(false);
// // //     const [showSectionModal, setShowSectionModal] = useState(false);
// // //     const [showSubjectModal, setShowSubjectModal] = useState(false);
// // //     const [isSaving, setIsSaving] = useState(false);
// // //     const [selectAllSections, setSelectAllSections] = useState(true);
// // //     const [editorHeight, setEditorHeight] = useState(500);
// // //     const [uploadingImage, setUploadingImage] = useState(false);
// // //     const [isInitialized, setIsInitialized] = useState(false);

// // //     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
// // //     const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsFromClassWiseQuery(
// // //         { classId: formData.classId },
// // //         { skip: !formData.classId }
// // //     );

// // //     const [createBatchDiary] = useCreateBatchDiaryMutation();

// // //     const classes = classesData?.data || [];
// // //     const subjects = subjectsData?.data || [];
// // //     const selectedClass = classes.find(c => c.classId === formData.classId);
// // //     const sections = selectedClass?.sections || [];

// // //     // Initialize edit mode data when classes are loaded
// // //     useEffect(() => {
// // //         if (isEditMode && !isInitialized && classes.length > 0 && formData.classId) {
// // //             const foundClass = classes.find(c => c.classId === formData.classId);
// // //             if (foundClass) {
// // //                 setFormData(prev => ({
// // //                     ...prev,
// // //                     className: foundClass.className,
// // //                 }));
// // //             }
// // //             setIsInitialized(true);
// // //         }
// // //     }, [classes, isEditMode, formData.classId, isInitialized]);

// // //     // Update selectAllSections based on section selection when editing
// // //     useEffect(() => {
// // //         if (sections.length > 0 && isInitialized) {
// // //             if (formData.sectionIds.length === sections.length) {
// // //                 setSelectAllSections(true);
// // //             } else {
// // //                 setSelectAllSections(false);
// // //             }
// // //         }
// // //     }, [sections, formData.sectionIds, isInitialized]);

// // //     // Auto-select all sections when class changes (only for new diary)
// // //     useEffect(() => {
// // //         if (!isEditMode && selectedClass && sections.length > 0 && selectAllSections) {
// // //             setFormData(prev => ({
// // //                 ...prev,
// // //                 sectionIds: sections.map(s => s.sectionId),
// // //                 sectionNames: sections.map(s => s.sectionName),
// // //             }));
// // //         }
// // //     }, [selectedClass, sections]);

// // //     // ✅ IMAGE HANDLER - Base64 embedding
// // //     const pickAndInsertImage = async () => {
// // //         try {
// // //             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// // //             if (status !== 'granted') {
// // //                 Alert.alert('Permission Required', 'Please grant camera roll permissions');
// // //                 return;
// // //             }

// // //             const result = await ImagePicker.launchImageLibraryAsync({
// // //                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
// // //                 quality: 1,
// // //                 allowsEditing: true,
// // //             });

// // //             if (result.canceled) return;

// // //             const image = result.assets[0];

// // //             if (image.fileSize && image.fileSize > 1 * 1024 * 1024) {
// // //                 Alert.alert('Image Too Large', 'Please select an image smaller than 2MB');
// // //                 return;
// // //             }

// // //             setUploadingImage(true);

// // //             const manipulatedImage = await ImageManipulator.manipulateAsync(
// // //                 image.uri,
// // //                 [{ resize: { width: 600 } }],
// // //                 {
// // //                     compress: 0.5,
// // //                     format: ImageManipulator.SaveFormat.JPEG,
// // //                     base64: true,
// // //                 }
// // //             );

// // //             const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;

// // //             const imageHtml = `<div style="text-align: center; margin: 12px 0;">
// // //                 <img src="${base64Image}" alt="Diary Image" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
// // //             </div>`;

// // //             richTextRef.current?.insertHTML(imageHtml);
            
// // //             Alert.alert('Success', 'Image added to diary');
// // //         } catch (error) {
// // //             console.error('Image pick error:', error);
// // //             Alert.alert('Error', 'Failed to add image');
// // //         } finally {
// // //             setUploadingImage(false);
// // //         }
// // //     };

// // //     const toggleSelectAllSections = () => {
// // //         if (selectAllSections) {
// // //             setFormData(prev => ({
// // //                 ...prev,
// // //                 sectionIds: [],
// // //                 sectionNames: [],
// // //             }));
// // //             setSelectAllSections(false);
// // //         } else {
// // //             setFormData(prev => ({
// // //                 ...prev,
// // //                 sectionIds: sections.map(s => s.sectionId),
// // //                 sectionNames: sections.map(s => s.sectionName),
// // //             }));
// // //             setSelectAllSections(true);
// // //         }
// // //     };

// // //     const toggleSection = (section) => {
// // //         const isSelected = formData.sectionIds.includes(section.sectionId);
        
// // //         if (isSelected) {
// // //             setFormData(prev => ({
// // //                 ...prev,
// // //                 sectionIds: prev.sectionIds.filter(id => id !== section.sectionId),
// // //                 sectionNames: prev.sectionNames.filter(name => name !== section.sectionName),
// // //             }));
// // //         } else {
// // //             setFormData(prev => ({
// // //                 ...prev,
// // //                 sectionIds: [...prev.sectionIds, section.sectionId],
// // //                 sectionNames: [...prev.sectionNames, section.sectionName],
// // //             }));
// // //         }
// // //     };

// // //     const handleSave = async (publish = false) => {
// // //         console.log('Saving diary with data:', {
// // //             classId: formData.classId,
// // //             sectionIds: formData.sectionIds,
// // //             subjectId: formData.subjectId,
// // //             isEditMode,
// // //         });
        
// // //         if (!formData.classId) {
// // //             Alert.alert('Error', 'Please select a class');
// // //             return;
// // //         }
// // //         if (formData.sectionIds.length === 0) {
// // //             Alert.alert('Error', 'Please select at least one section');
// // //             return;
// // //         }
// // //         if (!formData.subjectId) {
// // //             Alert.alert('Error', 'Please select a subject');
// // //             return;
// // //         }
        
// // //         let htmlContent = formData.content;
// // //         if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === ' ') {
// // //             Alert.alert('Error', 'Please write some content');
// // //             return;
// // //         }

// // //         setIsSaving(true);
// // //         try {
// // //             const diaryData = {
// // //                 Date: editEntry?.date || new Date().toISOString().split('T')[0],
// // //                 ClassID: formData.classId,
// // //                 SectionIds: formData.sectionIds,
// // //                 SubjectID: formData.subjectId,
// // //                 ClassWork: null,
// // //                 HomeWork: htmlContent,
// // //                 CreatedBy: user?.id || 1,
// // //                 isPublished: publish,
// // //             };

// // //             await createBatchDiary(diaryData).unwrap();
// // //             Alert.alert('Success', `Diary ${publish ? 'published' : 'saved as draft'} successfully!`, [
// // //                 { text: 'OK', onPress: () => navigation.goBack() }
// // //             ]);
// // //         } catch (error) {
// // //             console.error('Save error:', error);
// // //             Alert.alert('Error', error.data?.message || 'Failed to save diary');
// // //         } finally {
// // //             setIsSaving(false);
// // //         }
// // //     };

// // //     const handleBack = () => {
// // //         const hasContent = formData.content && 
// // //                           formData.content !== '<p><br></p>' && 
// // //                           formData.content !== ' ' &&
// // //                           formData.content.length > 50;
        
// // //         // Only show discard warning if there are changes and not in edit mode or content changed
// // //         const isEdited = isEditMode && formData.content !== editEntry.content;
        
// // //         if ((hasContent && !isEditMode) || (isEdited)) {
// // //             Alert.alert(
// // //                 'Discard Changes',
// // //                 'You have unsaved changes. Are you sure you want to leave?',
// // //                 [
// // //                     { text: 'Stay', style: 'cancel' },
// // //                     { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
// // //                 ]
// // //             );
// // //         } else {
// // //             navigation.goBack();
// // //         }
// // //     };

// // //     const renderClassModal = () => (
// // //         <Modal visible={showClassModal} transparent animationType="slide" onRequestClose={() => setShowClassModal(false)}>
// // //             <View style={styles.modalOverlay}>
// // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // //                     <View style={styles.modalHeader}>
// // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Class</Text>
// // //                         <TouchableOpacity onPress={() => setShowClassModal(false)}>
// // //                             <Icon name="close" size={24} color={theme.text} />
// // //                         </TouchableOpacity>
// // //                     </View>
// // //                     <FlatList
// // //                         data={classes}
// // //                         keyExtractor={(item) => item.classId?.toString()}
// // //                         renderItem={({ item }) => (
// // //                             <TouchableOpacity
// // //                                 style={[
// // //                                     styles.modalItem,
// // //                                     formData.classId === item.classId && { backgroundColor: theme.primary + '15' }
// // //                                 ]}
// // //                                 onPress={() => {
// // //                                     setFormData({
// // //                                         ...formData,
// // //                                         classId: item.classId,
// // //                                         className: item.className,
// // //                                         sectionIds: [],
// // //                                         sectionNames: [],
// // //                                         subjectId: null,
// // //                                         subjectName: '',
// // //                                     });
// // //                                     setSelectAllSections(true);
// // //                                     setShowClassModal(false);
// // //                                 }}
// // //                             >
// // //                                 <View style={[styles.modalItemIcon, { backgroundColor: theme.primary + '15' }]}>
// // //                                     <Icon name="school" size={20} color={theme.primary} />
// // //                                 </View>
// // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // //                                     {item.className}
// // //                                 </Text>
// // //                                 {formData.classId === item.classId && (
// // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // //                                 )}
// // //                             </TouchableOpacity>
// // //                         )}
// // //                     />
// // //                 </View>
// // //             </View>
// // //         </Modal>
// // //     );

// // //     const renderSectionModal = () => (
// // //         <Modal visible={showSectionModal} transparent animationType="slide" onRequestClose={() => setShowSectionModal(false)}>
// // //             <View style={styles.modalOverlay}>
// // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // //                     <View style={styles.modalHeader}>
// // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Sections</Text>
// // //                         <TouchableOpacity onPress={() => setShowSectionModal(false)}>
// // //                             <Icon name="close" size={24} color={theme.text} />
// // //                         </TouchableOpacity>
// // //                     </View>
                    
// // //                     {sections.length > 1 && (
// // //                         <TouchableOpacity
// // //                             style={[styles.selectAllButton, { borderBottomColor: theme.border }]}
// // //                             onPress={toggleSelectAllSections}
// // //                         >
// // //                             <Icon 
// // //                                 name={selectAllSections ? "check-box" : "check-box-outline-blank"} 
// // //                                 size={22} 
// // //                                 color={theme.primary} 
// // //                             />
// // //                             <Text style={[styles.selectAllText, { color: theme.text }]}>
// // //                                 {selectAllSections ? 'Deselect All' : 'Select All Sections'}
// // //                             </Text>
// // //                         </TouchableOpacity>
// // //                     )}
                    
// // //                     <FlatList
// // //                         data={sections}
// // //                         keyExtractor={(item) => item.sectionId?.toString()}
// // //                         renderItem={({ item }) => {
// // //                             const isSelected = formData.sectionIds.includes(item.sectionId);
// // //                             return (
// // //                                 <TouchableOpacity
// // //                                     style={[styles.modalItem, isSelected && { backgroundColor: theme.primary + '10' }]}
// // //                                     onPress={() => toggleSection(item)}
// // //                                 >
// // //                                     <Icon 
// // //                                         name={isSelected ? "check-box" : "check-box-outline-blank"} 
// // //                                         size={22} 
// // //                                         color={isSelected ? theme.primary : theme.textSecondary} 
// // //                                     />
// // //                                     <Text style={[styles.modalItemText, { color: theme.text, marginLeft: 12 }]}>
// // //                                         Section {item.sectionName}
// // //                                     </Text>
// // //                                 </TouchableOpacity>
// // //                             );
// // //                         }}
// // //                     />
// // //                     <View style={styles.modalFooter}>
// // //                         <TouchableOpacity
// // //                             style={[styles.confirmButton, { backgroundColor: theme.primary }]}
// // //                             onPress={() => setShowSectionModal(false)}
// // //                         >
// // //                             <Text style={styles.confirmButtonText}>
// // //                                 Confirm ({formData.sectionIds.length} selected)
// // //                             </Text>
// // //                         </TouchableOpacity>
// // //                     </View>
// // //                 </View>
// // //             </View>
// // //         </Modal>
// // //     );

// // //     const renderSubjectModal = () => (
// // //         <Modal visible={showSubjectModal} transparent animationType="slide" onRequestClose={() => setShowSubjectModal(false)}>
// // //             <View style={styles.modalOverlay}>
// // //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// // //                     <View style={styles.modalHeader}>
// // //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Subject</Text>
// // //                         <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
// // //                             <Icon name="close" size={24} color={theme.text} />
// // //                         </TouchableOpacity>
// // //                     </View>
// // //                     <FlatList
// // //                         data={subjects}
// // //                         keyExtractor={(item) => item.subjectId?.toString()}
// // //                         renderItem={({ item }) => (
// // //                             <TouchableOpacity
// // //                                 style={[
// // //                                     styles.modalItem,
// // //                                     formData.subjectId === item.subjectId && { backgroundColor: theme.primary + '15' }
// // //                                 ]}
// // //                                 onPress={() => {
// // //                                     setFormData({
// // //                                         ...formData,
// // //                                         subjectId: item.subjectId,
// // //                                         subjectName: item.subjectName,
// // //                                     });
// // //                                     setShowSubjectModal(false);
// // //                                 }}
// // //                             >
// // //                                 <View style={[styles.subjectDot, { backgroundColor: item.colorCode || theme.primary }]} />
// // //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// // //                                     {item.subjectName}
// // //                                 </Text>
// // //                                 {formData.subjectId === item.subjectId && (
// // //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// // //                                 )}
// // //                             </TouchableOpacity>
// // //                         )}
// // //                     />
// // //                 </View>
// // //             </View>
// // //         </Modal>
// // //     );

// // //     if (classesLoading) {
// // //         return (
// // //             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
// // //                 <ActivityIndicator size="large" color={theme.primary} />
// // //             </View>
// // //         );
// // //     }

// // //     const toolbarActions = [
// // //         actions.setBold,
// // //         actions.setItalic,
// // //         actions.setUnderline,
// // //         actions.alignLeft,
// // //         actions.alignCenter,
// // //         actions.alignRight,
// // //         actions.insertBulletsList,
// // //         actions.insertOrderedList,
// // //         actions.undo,
// // //         actions.redo,
// // //     ];

// // //     return (
// // //         <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
// // //             {/* Fixed Header */}
// // //             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // //                 <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
// // //                     <Icon name="arrow-back" size={24} color={theme.text} />
// // //                 </TouchableOpacity>
// // //                 <Text style={[styles.headerTitle, { color: theme.text }]}>
// // //                     {isEditMode ? 'Edit Diary' : 'Create Diary'}
// // //                 </Text>
// // //                 <View style={styles.headerButton} />
// // //             </View>

// // //             {/* Fixed Selection Cards */}
// // //             <View style={[styles.fixedSelectionContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
// // //                 <View style={styles.selectionRow}>
// // //                     <TouchableOpacity
// // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // //                         onPress={() => setShowClassModal(true)}
// // //                         activeOpacity={0.7}
// // //                     >
// // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // //                             <Icon name="school" size={22} color={theme.primary} />
// // //                         </View>
// // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Class</Text>
// // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // //                             {formData.className || 'Select Class'}
// // //                         </Text>
// // //                     </TouchableOpacity>

// // //                     <TouchableOpacity
// // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // //                         onPress={() => formData.classId ? setShowSectionModal(true) : Alert.alert('Info', 'Please select a class first')}
// // //                         activeOpacity={0.7}
// // //                     >
// // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // //                             <Icon name="groups" size={22} color={theme.primary} />
// // //                         </View>
// // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Sections</Text>
// // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // //                             {formData.sectionIds.length > 0 ? `${formData.sectionIds.length} section(s) selected` : 'Select Sections'}
// // //                         </Text>
// // //                     </TouchableOpacity>

// // //                     <TouchableOpacity
// // //                         style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// // //                         onPress={() => formData.classId && formData.sectionIds.length > 0 ? setShowSubjectModal(true) : Alert.alert('Info', 'Please select class and sections first')}
// // //                         activeOpacity={0.7}
// // //                     >
// // //                         <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// // //                             <Icon name="book" size={22} color={theme.primary} />
// // //                         </View>
// // //                         <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Subject</Text>
// // //                         <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// // //                             {formData.subjectName || 'Select Subject'}
// // //                         </Text>
// // //                     </TouchableOpacity>
// // //                 </View>

// // //                 {/* Selected Sections Tags */}
// // //                 {formData.sectionIds.length > 0 && (
// // //                     <View style={[styles.tagsContainer, { backgroundColor: theme.card }]}>
// // //                         <Text style={[styles.tagsLabel, { color: theme.textSecondary }]}>Selected Sections:</Text>
// // //                         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
// // //                             {formData.sectionNames.map((name, index) => (
// // //                                 <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '15' }]}>
// // //                                     <Text style={[styles.tagText, { color: theme.primary }]}>Sec {name}</Text>
// // //                                 </View>
// // //                             ))}
// // //                         </ScrollView>
// // //                     </View>
// // //                 )}
// // //             </View>

// // //             {/* TOOLBAR */}
// // //             <View style={[styles.stickyToolbar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// // //                 <RichToolbar
// // //                     getEditor={() => richTextRef.current}
// // //                     actions={toolbarActions}
// // //                     iconMap={{
// // //                         [actions.setBold]: ({ tintColor }) => <Icon name="format-bold" size={22} color={tintColor} />,
// // //                         [actions.setItalic]: ({ tintColor }) => <Icon name="format-italic" size={22} color={tintColor} />,
// // //                         [actions.setUnderline]: ({ tintColor }) => <Icon name="format-underlined" size={22} color={tintColor} />,
// // //                         [actions.alignLeft]: ({ tintColor }) => <Icon name="format-align-left" size={22} color={tintColor} />,
// // //                         [actions.alignCenter]: ({ tintColor }) => <Icon name="format-align-center" size={22} color={tintColor} />,
// // //                         [actions.alignRight]: ({ tintColor }) => <Icon name="format-align-right" size={22} color={tintColor} />,
// // //                         [actions.insertBulletsList]: ({ tintColor }) => <Icon name="format-list-bulleted" size={22} color={tintColor} />,
// // //                         [actions.insertOrderedList]: ({ tintColor }) => <Icon name="format-list-numbered" size={22} color={tintColor} />,
// // //                         [actions.undo]: ({ tintColor }) => <Icon name="undo" size={22} color={tintColor} />,
// // //                         [actions.redo]: ({ tintColor }) => <Icon name="redo" size={22} color={tintColor} />,
// // //                     }}
// // //                     style={[styles.toolbar, { backgroundColor: theme.background }]}
// // //                 />
                
// // //                 {/* Image Button Row */}
// // //                 <View style={[styles.imageButtonRow, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
// // //                     <TouchableOpacity
// // //                         style={styles.imageButton}
// // //                         onPress={pickAndInsertImage}
// // //                         disabled={uploadingImage}
// // //                     >
// // //                         {uploadingImage ? (
// // //                             <ActivityIndicator size="small" color={theme.primary} />
// // //                         ) : (
// // //                             <>
// // //                                 <Icon name="image" size={22} color={theme.primary} />
// // //                                 <Text style={[styles.imageButtonText, { color: theme.primary }]}>Insert Image</Text>
// // //                             </>
// // //                         )}
// // //                     </TouchableOpacity>
// // //                 </View>
// // //             </View>

// // //             {/* Scrollable Editor Area */}
// // //             <ScrollView 
// // //                 style={styles.scrollView} 
// // //                 showsVerticalScrollIndicator={true}
// // //                 keyboardShouldPersistTaps="handled"
// // //                 contentContainerStyle={{ paddingBottom: 80 }}
// // //             >
// // //                 <View style={styles.editorContainer}>
// // //                     <RichEditor
// // //                         ref={richTextRef}
// // //                         useContainer={true}
// // //                         initialFocus={false}
// // //                         initialContentHTML={formData.content}
// // //                         onChange={(html) => setFormData({ ...formData, content: html })}
// // //                         editorStyle={{
// // //                             backgroundColor: theme.background,
// // //                             color: theme.text,
// // //                             placeholderColor: theme.textSecondary,
// // //                             contentCSS: `body { 
// // //                                 font-family: -apple-system; 
// // //                                 font-size: 16px; 
// // //                                 padding: 16px; 
// // //                                 line-height: 1.6;
// // //                                 min-height: 600px;
// // //                             }
// // //                             img { 
// // //                                 max-width: 100%; 
// // //                                 height: auto; 
// // //                                 border-radius: 12px; 
// // //                                 margin: 10px 0;
// // //                             }
// // //                             p { margin-bottom: 12px; }
// // //                             h1, h2, h3 { margin: 16px 0 8px; }`,
// // //                         }}
// // //                         placeholder="Write your diary entry here..."
// // //                         style={[styles.editor, { backgroundColor: theme.background, height: editorHeight }]}
// // //                         onLoadEnd={() => setEditorHeight(600)}
// // //                         editorInitializedCallback={() => {
// // //                             console.log("✅ Editor Ready");
// // //                         }}
// // //                     />
// // //                 </View>
// // //             </ScrollView>

// // //             {/* Fixed Action Buttons at Bottom */}
// // //             <View style={[styles.fixedActions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
// // //                 <TouchableOpacity
// // //                     style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15', borderColor: theme.warning }]}
// // //                     onPress={() => handleSave(false)}
// // //                     disabled={isSaving || uploadingImage}
// // //                 >
// // //                     {isSaving ? (
// // //                         <ActivityIndicator size="small" color={theme.warning} />
// // //                     ) : (
// // //                         <>
// // //                             <Icon name="save" size={20} color={theme.warning} />
// // //                             <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>
// // //                         </>
// // //                     )}
// // //                 </TouchableOpacity>

// // //                 <TouchableOpacity
// // //                     style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
// // //                     onPress={() => handleSave(true)}
// // //                     disabled={isSaving || uploadingImage}
// // //                 >
// // //                     {isSaving ? (
// // //                         <ActivityIndicator size="small" color="#FFF" />
// // //                     ) : (
// // //                         <>
// // //                             <Icon name="send" size={20} color="#FFF" />
// // //                             <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>
// // //                         </>
// // //                     )}
// // //                 </TouchableOpacity>
// // //             </View>

// // //             {renderClassModal()}
// // //             {renderSectionModal()}
// // //             {renderSubjectModal()}
// // //         </SafeAreaView>
// // //     );
// // // };

// // // const styles = StyleSheet.create({
// // //     safeArea: {
// // //         flex: 1,
// // //     },
// // //     loadingContainer: {
// // //         flex: 1,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //     },
// // //     header: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         justifyContent: 'space-between',
// // //         paddingHorizontal: 16,
// // //         paddingVertical: 14,
// // //         borderBottomWidth: 1,
// // //     },
// // //     headerButton: {
// // //         width: 40,
// // //         height: 40,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //     },
// // //     headerTitle: {
// // //         fontSize: 18,
// // //         fontWeight: '600',
// // //     },
// // //     fixedSelectionContainer: {
// // //         paddingHorizontal: 16,
// // //         paddingTop: 12,
// // //         paddingBottom: 8,
// // //         borderBottomWidth: 1,
// // //     },
// // //     selectionRow: {
// // //         flexDirection: 'row',
// // //         gap: 12,
// // //         marginBottom: 8,
// // //     },
// // //     selectionCard: {
// // //         flex: 1,
// // //         alignItems: 'center',
// // //         paddingVertical: 12,
// // //         paddingHorizontal: 6,
// // //         borderRadius: 12,
// // //         borderWidth: 1,
// // //     },
// // //     cardIcon: {
// // //         width: 40,
// // //         height: 40,
// // //         borderRadius: 20,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //         marginBottom: 6,
// // //     },
// // //     cardLabel: {
// // //         fontSize: 10,
// // //         marginBottom: 2,
// // //     },
// // //     cardValue: {
// // //         fontSize: 11,
// // //         fontWeight: '600',
// // //         textAlign: 'center',
// // //     },
// // //     tagsContainer: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         paddingHorizontal: 10,
// // //         paddingVertical: 8,
// // //         borderRadius: 10,
// // //         marginTop: 4,
// // //         gap: 6,
// // //     },
// // //     tagsLabel: {
// // //         fontSize: 11,
// // //     },
// // //     tagsScroll: {
// // //         flexDirection: 'row',
// // //     },
// // //     tag: {
// // //         paddingHorizontal: 8,
// // //         paddingVertical: 3,
// // //         borderRadius: 14,
// // //         marginRight: 6,
// // //     },
// // //     tagText: {
// // //         fontSize: 10,
// // //         fontWeight: '500',
// // //     },
// // //     stickyToolbar: {
// // //         borderBottomWidth: 1,
// // //         zIndex: 10,
// // //     },
// // //     toolbar: {
// // //         borderBottomWidth: 1,
// // //         minHeight: 48,
// // //         paddingHorizontal: 8,
// // //     },
// // //     imageButtonRow: {
// // //         flexDirection: 'row',
// // //         paddingHorizontal: 12,
// // //         paddingVertical: 8,
// // //         borderTopWidth: 1,
// // //     },
// // //     imageButton: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         gap: 8,
// // //         paddingHorizontal: 12,
// // //         paddingVertical: 6,
// // //         borderRadius: 8,
// // //     },
// // //     imageButtonText: {
// // //         fontSize: 13,
// // //         fontWeight: '500',
// // //     },
// // //     scrollView: {
// // //         flex: 1,
// // //     },
// // //     editorContainer: {
// // //         padding: 16,
// // //         minHeight: 600,
// // //     },
// // //     editor: {
// // //         minHeight: 600,
// // //         padding: 0,
// // //     },
// // //     fixedActions: {
// // //         flexDirection: 'row',
// // //         gap: 12,
// // //         paddingHorizontal: 16,
// // //         paddingVertical: 12,
// // //         borderTopWidth: 1,
// // //     },
// // //     actionButton: {
// // //         flex: 1,
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         justifyContent: 'center',
// // //         paddingVertical: 12,
// // //         borderRadius: 10,
// // //         gap: 8,
// // //     },
// // //     draftButton: {
// // //         borderWidth: 1,
// // //     },
// // //     publishButton: {
// // //         elevation: 2,
// // //         shadowColor: '#000',
// // //         shadowOffset: { width: 0, height: 2 },
// // //         shadowOpacity: 0.1,
// // //         shadowRadius: 3,
// // //     },
// // //     actionButtonText: {
// // //         fontSize: 14,
// // //         fontWeight: '600',
// // //     },
// // //     modalOverlay: {
// // //         flex: 1,
// // //         backgroundColor: 'rgba(0,0,0,0.5)',
// // //         justifyContent: 'flex-end',
// // //     },
// // //     modalContent: {
// // //         borderTopLeftRadius: 24,
// // //         borderTopRightRadius: 24,
// // //         padding: 20,
// // //         maxHeight: '75%',
// // //     },
// // //     modalHeader: {
// // //         flexDirection: 'row',
// // //         justifyContent: 'space-between',
// // //         alignItems: 'center',
// // //         marginBottom: 20,
// // //     },
// // //     modalTitle: {
// // //         fontSize: 20,
// // //         fontWeight: 'bold',
// // //     },
// // //     selectAllButton: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         paddingVertical: 12,
// // //         marginBottom: 8,
// // //         borderBottomWidth: 1,
// // //         gap: 12,
// // //     },
// // //     selectAllText: {
// // //         fontSize: 15,
// // //         fontWeight: '500',
// // //     },
// // //     modalItem: {
// // //         flexDirection: 'row',
// // //         alignItems: 'center',
// // //         padding: 14,
// // //         borderRadius: 12,
// // //         marginBottom: 8,
// // //         gap: 12,
// // //     },
// // //     modalItemIcon: {
// // //         width: 40,
// // //         height: 40,
// // //         borderRadius: 20,
// // //         justifyContent: 'center',
// // //         alignItems: 'center',
// // //     },
// // //     modalItemText: {
// // //         fontSize: 15,
// // //     },
// // //     subjectDot: {
// // //         width: 12,
// // //         height: 12,
// // //         borderRadius: 6,
// // //     },
// // //     modalFooter: {
// // //         marginTop: 16,
// // //     },
// // //     confirmButton: {
// // //         paddingVertical: 14,
// // //         borderRadius: 12,
// // //         alignItems: 'center',
// // //     },
// // //     confirmButtonText: {
// // //         color: '#FFF',
// // //         fontSize: 15,
// // //         fontWeight: '600',
// // //     },
// // // });

// // // export default CreateDiaryScreen;
// // // CreateDiaryScreen.js - OPTIMIZED with Full-Screen Editor & Keyboard Handling
// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //     View,
// //     Text,
// //     StyleSheet,
// //     ScrollView,
// //     TouchableOpacity,
// //     ActivityIndicator,
// //     Alert,
// //     Modal,
// //     FlatList,
// //     Platform,
// //     SafeAreaView,
// //     Dimensions,
// //     KeyboardAvoidingView,
// //     Keyboard,
// //     TextInput,
// // } from 'react-native';
// // import { useSelector } from 'react-redux';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// // import * as ImagePicker from 'expo-image-picker';
// // import * as ImageManipulator from 'expo-image-manipulator';
// // import { selectThemeData } from '../../store/slices/themeSlice';
// // import { selectCurrentUser } from '../../store/slices/authSlice';
// // import {
// //     useGetTeacherClassesQuery,
// //     useGetSubjectsFromClassWiseQuery,
// //     useCreateBatchDiaryMutation,
// // } from '../../store/diaryApi';

// // const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// // const CreateDiaryScreen = ({ navigation, route }) => {
// //     const theme = useSelector(selectThemeData);
// //     const user = useSelector(selectCurrentUser);
// //     const richTextRef = useRef(null);
// //     const scrollViewRef = useRef(null);
    
// //     const editEntry = route.params?.editEntry;
// //     const isEditMode = !!editEntry;

// //     const [formData, setFormData] = useState({
// //         classId: editEntry?.classId || null,
// //         className: editEntry?.className || '',
// //         sectionIds: editEntry?.sectionIds || [],
// //         sectionNames: editEntry?.sectionNames || [],
// //         subjectId: editEntry?.subjectId || null,
// //         subjectName: editEntry?.subjectName || '',
// //         content: editEntry?.content || '<p><br></p>',
// //     });
    
// //     const [showClassModal, setShowClassModal] = useState(false);
// //     const [showSectionModal, setShowSectionModal] = useState(false);
// //     const [showSubjectModal, setShowSubjectModal] = useState(false);
// //     const [isSaving, setIsSaving] = useState(false);
// //     const [selectAllSections, setSelectAllSections] = useState(true);
// //     const [uploadingImage, setUploadingImage] = useState(false);
// //     const [isInitialized, setIsInitialized] = useState(false);
// //     const [isFullScreen, setIsFullScreen] = useState(false);
// //     const [keyboardVisible, setKeyboardVisible] = useState(false);

// //     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
// //     const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsFromClassWiseQuery(
// //         { classId: formData.classId },
// //         { skip: !formData.classId }
// //     );

// //     const [createBatchDiary] = useCreateBatchDiaryMutation();

// //     const classes = classesData?.data || [];
// //     const subjects = subjectsData?.data || [];
// //     const selectedClass = classes.find(c => c.classId === formData.classId);
// //     const sections = selectedClass?.sections || [];

// //     // Keyboard listeners
// //     useEffect(() => {
// //         const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
// //             setKeyboardVisible(true);
// //             // Scroll to bottom when keyboard appears
// //             setTimeout(() => {
// //                 scrollViewRef.current?.scrollToEnd({ animated: true });
// //             }, 100);
// //         });
// //         const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
// //             setKeyboardVisible(false);
// //         });

// //         return () => {
// //             keyboardDidShowListener.dispose();
// //             keyboardDidHideListener.dispose();
// //         };
// //     }, []);

// //     // Initialize edit mode data when classes are loaded
// //     useEffect(() => {
// //         if (isEditMode && !isInitialized && classes.length > 0 && formData.classId) {
// //             const foundClass = classes.find(c => c.classId === formData.classId);
// //             if (foundClass) {
// //                 setFormData(prev => ({
// //                     ...prev,
// //                     className: foundClass.className,
// //                 }));
// //             }
// //             setIsInitialized(true);
// //         }
// //     }, [classes, isEditMode, formData.classId, isInitialized]);

// //     // Update selectAllSections based on section selection when editing
// //     useEffect(() => {
// //         if (sections.length > 0 && isInitialized) {
// //             if (formData.sectionIds.length === sections.length) {
// //                 setSelectAllSections(true);
// //             } else {
// //                 setSelectAllSections(false);
// //             }
// //         }
// //     }, [sections, formData.sectionIds, isInitialized]);

// //     // Auto-select all sections when class changes (only for new diary)
// //     useEffect(() => {
// //         if (!isEditMode && selectedClass && sections.length > 0 && selectAllSections) {
// //             setFormData(prev => ({
// //                 ...prev,
// //                 sectionIds: sections.map(s => s.sectionId),
// //                 sectionNames: sections.map(s => s.sectionName),
// //             }));
// //         }
// //     }, [selectedClass, sections]);

// //     const pickAndInsertImage = async () => {
// //         try {
// //             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// //             if (status !== 'granted') {
// //                 Alert.alert('Permission Required', 'Please grant camera roll permissions');
// //                 return;
// //             }

// //             const result = await ImagePicker.launchImageLibraryAsync({
// //                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //                 quality: 1,
// //                 allowsEditing: true,
// //             });

// //             if (result.canceled) return;

// //             const image = result.assets[0];

// //             if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
// //                 Alert.alert('Image Too Large', 'Please select an image smaller than 2MB');
// //                 return;
// //             }

// //             setUploadingImage(true);

// //             const manipulatedImage = await ImageManipulator.manipulateAsync(
// //                 image.uri,
// //                 [{ resize: { width: 600 } }],
// //                 {
// //                     compress: 0.5,
// //                     format: ImageManipulator.SaveFormat.JPEG,
// //                     base64: true,
// //                 }
// //             );

// //             const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;

// //             const imageHtml = `<div style="text-align: center; margin: 12px 0;">
// //                 <img src="${base64Image}" alt="Diary Image" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
// //             </div>`;

// //             richTextRef.current?.insertHTML(imageHtml);
            
// //             Alert.alert('Success', 'Image added to diary');
// //         } catch (error) {
// //             console.error('Image pick error:', error);
// //             Alert.alert('Error', 'Failed to add image');
// //         } finally {
// //             setUploadingImage(false);
// //         }
// //     };

// //     const toggleSelectAllSections = () => {
// //         if (selectAllSections) {
// //             setFormData(prev => ({
// //                 ...prev,
// //                 sectionIds: [],
// //                 sectionNames: [],
// //             }));
// //             setSelectAllSections(false);
// //         } else {
// //             setFormData(prev => ({
// //                 ...prev,
// //                 sectionIds: sections.map(s => s.sectionId),
// //                 sectionNames: sections.map(s => s.sectionName),
// //             }));
// //             setSelectAllSections(true);
// //         }
// //     };

// //     const toggleSection = (section) => {
// //         const isSelected = formData.sectionIds.includes(section.sectionId);
        
// //         if (isSelected) {
// //             setFormData(prev => ({
// //                 ...prev,
// //                 sectionIds: prev.sectionIds.filter(id => id !== section.sectionId),
// //                 sectionNames: prev.sectionNames.filter(name => name !== section.sectionName),
// //             }));
// //         } else {
// //             setFormData(prev => ({
// //                 ...prev,
// //                 sectionIds: [...prev.sectionIds, section.sectionId],
// //                 sectionNames: [...prev.sectionNames, section.sectionName],
// //             }));
// //         }
// //     };

// //     const handleSave = async (publish = false) => {
// //         if (!formData.classId) {
// //             Alert.alert('Error', 'Please select a class');
// //             return;
// //         }
// //         if (formData.sectionIds.length === 0) {
// //             Alert.alert('Error', 'Please select at least one section');
// //             return;
// //         }
// //         if (!formData.subjectId) {
// //             Alert.alert('Error', 'Please select a subject');
// //             return;
// //         }
        
// //         let htmlContent = formData.content;
// //         if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === ' ') {
// //             Alert.alert('Error', 'Please write some content');
// //             return;
// //         }

// //         setIsSaving(true);
// //         try {
// //             const diaryData = {
// //                 Date: editEntry?.date || new Date().toISOString().split('T')[0],
// //                 ClassID: formData.classId,
// //                 SectionIds: formData.sectionIds,
// //                 SubjectID: formData.subjectId,
// //                 ClassWork: null,
// //                 HomeWork: htmlContent,
// //                 CreatedBy: user?.id || 1,
// //                 isPublished: publish,
// //             };

// //             await createBatchDiary(diaryData).unwrap();
// //             Alert.alert('Success', `Diary ${publish ? 'published' : 'saved as draft'} successfully!`, [
// //                 { text: 'OK', onPress: () => navigation.goBack() }
// //             ]);
// //         } catch (error) {
// //             console.error('Save error:', error);
// //             Alert.alert('Error', error.data?.message || 'Failed to save diary');
// //         } finally {
// //             setIsSaving(false);
// //         }
// //     };

// //     const handleBack = () => {
// //         const hasContent = formData.content && 
// //                           formData.content !== '<p><br></p>' && 
// //                           formData.content !== ' ' &&
// //                           formData.content.length > 50;
        
// //         const isEdited = isEditMode && formData.content !== editEntry.content;
        
// //         if ((hasContent && !isEditMode) || (isEdited)) {
// //             Alert.alert(
// //                 'Discard Changes',
// //                 'You have unsaved changes. Are you sure you want to leave?',
// //                 [
// //                     { text: 'Stay', style: 'cancel' },
// //                     { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
// //                 ]
// //             );
// //         } else {
// //             navigation.goBack();
// //         }
// //     };

// //     const toggleFullScreen = () => {
// //         setIsFullScreen(!isFullScreen);
// //         if (!isFullScreen) {
// //             // Focus editor when entering full screen
// //             setTimeout(() => {
// //                 richTextRef.current?.focus();
// //             }, 100);
// //         }
// //     };

// //     const renderClassModal = () => (
// //         <Modal visible={showClassModal} transparent animationType="slide" onRequestClose={() => setShowClassModal(false)}>
// //             <View style={styles.modalOverlay}>
// //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// //                     <View style={styles.modalHeader}>
// //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Class</Text>
// //                         <TouchableOpacity onPress={() => setShowClassModal(false)}>
// //                             <Icon name="close" size={24} color={theme.text} />
// //                         </TouchableOpacity>
// //                     </View>
// //                     <FlatList
// //                         data={classes}
// //                         keyExtractor={(item) => item.classId?.toString()}
// //                         renderItem={({ item }) => (
// //                             <TouchableOpacity
// //                                 style={[
// //                                     styles.modalItem,
// //                                     formData.classId === item.classId && { backgroundColor: theme.primary + '15' }
// //                                 ]}
// //                                 onPress={() => {
// //                                     setFormData({
// //                                         ...formData,
// //                                         classId: item.classId,
// //                                         className: item.className,
// //                                         sectionIds: [],
// //                                         sectionNames: [],
// //                                         subjectId: null,
// //                                         subjectName: '',
// //                                     });
// //                                     setSelectAllSections(true);
// //                                     setShowClassModal(false);
// //                                 }}
// //                             >
// //                                 <View style={[styles.modalItemIcon, { backgroundColor: theme.primary + '15' }]}>
// //                                     <Icon name="school" size={20} color={theme.primary} />
// //                                 </View>
// //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// //                                     {item.className}
// //                                 </Text>
// //                                 {formData.classId === item.classId && (
// //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// //                                 )}
// //                             </TouchableOpacity>
// //                         )}
// //                     />
// //                 </View>
// //             </View>
// //         </Modal>
// //     );

// //     const renderSectionModal = () => (
// //         <Modal visible={showSectionModal} transparent animationType="slide" onRequestClose={() => setShowSectionModal(false)}>
// //             <View style={styles.modalOverlay}>
// //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// //                     <View style={styles.modalHeader}>
// //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Sections</Text>
// //                         <TouchableOpacity onPress={() => setShowSectionModal(false)}>
// //                             <Icon name="close" size={24} color={theme.text} />
// //                         </TouchableOpacity>
// //                     </View>
                    
// //                     {sections.length > 1 && (
// //                         <TouchableOpacity
// //                             style={[styles.selectAllButton, { borderBottomColor: theme.border }]}
// //                             onPress={toggleSelectAllSections}
// //                         >
// //                             <Icon 
// //                                 name={selectAllSections ? "check-box" : "check-box-outline-blank"} 
// //                                 size={22} 
// //                                 color={theme.primary} 
// //                             />
// //                             <Text style={[styles.selectAllText, { color: theme.text }]}>
// //                                 {selectAllSections ? 'Deselect All' : 'Select All Sections'}
// //                             </Text>
// //                         </TouchableOpacity>
// //                     )}
                    
// //                     <FlatList
// //                         data={sections}
// //                         keyExtractor={(item) => item.sectionId?.toString()}
// //                         renderItem={({ item }) => {
// //                             const isSelected = formData.sectionIds.includes(item.sectionId);
// //                             return (
// //                                 <TouchableOpacity
// //                                     style={[styles.modalItem, isSelected && { backgroundColor: theme.primary + '10' }]}
// //                                     onPress={() => toggleSection(item)}
// //                                 >
// //                                     <Icon 
// //                                         name={isSelected ? "check-box" : "check-box-outline-blank"} 
// //                                         size={22} 
// //                                         color={isSelected ? theme.primary : theme.textSecondary} 
// //                                     />
// //                                     <Text style={[styles.modalItemText, { color: theme.text, marginLeft: 12 }]}>
// //                                         Section {item.sectionName}
// //                                     </Text>
// //                                 </TouchableOpacity>
// //                             );
// //                         }}
// //                     />
// //                     <View style={styles.modalFooter}>
// //                         <TouchableOpacity
// //                             style={[styles.confirmButton, { backgroundColor: theme.primary }]}
// //                             onPress={() => setShowSectionModal(false)}
// //                         >
// //                             <Text style={styles.confirmButtonText}>
// //                                 Confirm ({formData.sectionIds.length} selected)
// //                             </Text>
// //                         </TouchableOpacity>
// //                     </View>
// //                 </View>
// //             </View>
// //         </Modal>
// //     );

// //     const renderSubjectModal = () => (
// //         <Modal visible={showSubjectModal} transparent animationType="slide" onRequestClose={() => setShowSubjectModal(false)}>
// //             <View style={styles.modalOverlay}>
// //                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
// //                     <View style={styles.modalHeader}>
// //                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Subject</Text>
// //                         <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
// //                             <Icon name="close" size={24} color={theme.text} />
// //                         </TouchableOpacity>
// //                     </View>
// //                     <FlatList
// //                         data={subjects}
// //                         keyExtractor={(item) => item.subjectId?.toString()}
// //                         renderItem={({ item }) => (
// //                             <TouchableOpacity
// //                                 style={[
// //                                     styles.modalItem,
// //                                     formData.subjectId === item.subjectId && { backgroundColor: theme.primary + '15' }
// //                                 ]}
// //                                 onPress={() => {
// //                                     setFormData({
// //                                         ...formData,
// //                                         subjectId: item.subjectId,
// //                                         subjectName: item.subjectName,
// //                                     });
// //                                     setShowSubjectModal(false);
// //                                 }}
// //                             >
// //                                 <View style={[styles.subjectDot, { backgroundColor: item.colorCode || theme.primary }]} />
// //                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
// //                                     {item.subjectName}
// //                                 </Text>
// //                                 {formData.subjectId === item.subjectId && (
// //                                     <Icon name="check-circle" size={20} color={theme.primary} />
// //                                 )}
// //                             </TouchableOpacity>
// //                         )}
// //                     />
// //                 </View>
// //             </View>
// //         </Modal>
// //     );

// //     if (classesLoading) {
// //         return (
// //             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
// //                 <ActivityIndicator size="large" color={theme.primary} />
// //             </View>
// //         );
// //     }

// //     const toolbarActions = [
// //         actions.setBold,
// //         actions.setItalic,
// //         actions.setUnderline,
// //         actions.alignLeft,
// //         actions.alignCenter,
// //         actions.alignRight,
// //         actions.insertBulletsList,
// //         actions.insertOrderedList,
// //         actions.undo,
// //         actions.redo,
// //     ];

// //     // Full-screen mode render
// //     if (isFullScreen) {
// //         return (
// //             <View style={[styles.fullScreenContainer, { backgroundColor: theme.background }]}>
// //                 <View style={[styles.fullScreenHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// //                     <TouchableOpacity onPress={toggleFullScreen} style={styles.headerButton}>
// //                         <Icon name="fullscreen-exit" size={24} color={theme.text} />
// //                     </TouchableOpacity>
// //                     <Text style={[styles.headerTitle, { color: theme.text }]}>Full Screen Editor</Text>
// //                     <View style={{ width: 40 }} />
// //                 </View>
                
// //                 <RichToolbar
// //                     getEditor={() => richTextRef.current}
// //                     actions={toolbarActions}
// //                     iconMap={{
// //                         [actions.setBold]: ({ tintColor }) => <Icon name="format-bold" size={22} color={tintColor} />,
// //                         [actions.setItalic]: ({ tintColor }) => <Icon name="format-italic" size={22} color={tintColor} />,
// //                         [actions.setUnderline]: ({ tintColor }) => <Icon name="format-underlined" size={22} color={tintColor} />,
// //                         [actions.alignLeft]: ({ tintColor }) => <Icon name="format-align-left" size={22} color={tintColor} />,
// //                         [actions.alignCenter]: ({ tintColor }) => <Icon name="format-align-center" size={22} color={tintColor} />,
// //                         [actions.alignRight]: ({ tintColor }) => <Icon name="format-align-right" size={22} color={tintColor} />,
// //                         [actions.insertBulletsList]: ({ tintColor }) => <Icon name="format-list-bulleted" size={22} color={tintColor} />,
// //                         [actions.insertOrderedList]: ({ tintColor }) => <Icon name="format-list-numbered" size={22} color={tintColor} />,
// //                         [actions.undo]: ({ tintColor }) => <Icon name="undo" size={22} color={tintColor} />,
// //                         [actions.redo]: ({ tintColor }) => <Icon name="redo" size={22} color={tintColor} />,
// //                     }}
// //                     style={[styles.fullScreenToolbar, { backgroundColor: theme.background }]}
// //                 />
                
// //                 <View style={[styles.fullScreenImageRow, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
// //                     <TouchableOpacity
// //                         style={styles.imageButton}
// //                         onPress={pickAndInsertImage}
// //                         disabled={uploadingImage}
// //                     >
// //                         {uploadingImage ? (
// //                             <ActivityIndicator size="small" color={theme.primary} />
// //                         ) : (
// //                             <>
// //                                 <Icon name="image" size={22} color={theme.primary} />
// //                                 <Text style={[styles.imageButtonText, { color: theme.primary }]}>Insert Image</Text>
// //                             </>
// //                         )}
// //                     </TouchableOpacity>
// //                 </View>
                
// //                 <KeyboardAvoidingView 
// //                     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //                     style={styles.fullScreenEditorContainer}
// //                     keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
// //                 >
// //                     <RichEditor
// //                         ref={richTextRef}
// //                         useContainer={true}
// //                         initialFocus={true}
// //                         initialContentHTML={formData.content}
// //                         onChange={(html) => setFormData({ ...formData, content: html })}
// //                         editorStyle={{
// //                             backgroundColor: theme.background,
// //                             color: theme.text,
// //                             placeholderColor: theme.textSecondary,
// //                             contentCSS: `body { 
// //                                 font-family: -apple-system; 
// //                                 font-size: 16px; 
// //                                 padding: 16px; 
// //                                 line-height: 1.6;
// //                                 min-height: ${SCREEN_HEIGHT - 200}px;
// //                             }
// //                             img { 
// //                                 max-width: 100%; 
// //                                 height: auto; 
// //                                 border-radius: 12px; 
// //                                 margin: 10px 0;
// //                             }
// //                             p { margin-bottom: 12px; }
// //                             h1, h2, h3 { margin: 16px 0 8px; }`,
// //                         }}
// //                         placeholder="Write your diary entry here..."
// //                         style={[styles.fullScreenEditor, { backgroundColor: theme.background }]}
// //                     />
// //                 </KeyboardAvoidingView>
                
// //                 <View style={[styles.fullScreenActions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
// //                     <TouchableOpacity
// //                         style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15', borderColor: theme.warning }]}
// //                         onPress={() => handleSave(false)}
// //                         disabled={isSaving || uploadingImage}
// //                     >
// //                         {isSaving ? <ActivityIndicator size="small" color={theme.warning} /> : <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>}
// //                     </TouchableOpacity>
// //                     <TouchableOpacity
// //                         style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
// //                         onPress={() => handleSave(true)}
// //                         disabled={isSaving || uploadingImage}
// //                     >
// //                         {isSaving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>}
// //                     </TouchableOpacity>
// //                 </View>
// //             </View>
// //         );
// //     }

// //     // Normal mode render
// //     return (
// //         <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
// //             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
// //                 <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
// //                     <Icon name="arrow-back" size={24} color={theme.text} />
// //                 </TouchableOpacity>
// //                 <Text style={[styles.headerTitle, { color: theme.text }]}>
// //                     {isEditMode ? 'Edit Diary' : 'Create Diary'}
// //                 </Text>
// //                 <TouchableOpacity onPress={toggleFullScreen} style={styles.headerButton}>
// //                     <Icon name="fullscreen" size={24} color={theme.primary} />
// //                 </TouchableOpacity>
// //             </View>

// //             <KeyboardAvoidingView 
// //                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //                 style={styles.keyboardAvoidingView}
// //                 keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
// //             >
// //                 <ScrollView 
// //                     ref={scrollViewRef}
// //                     style={styles.scrollView}
// //                     showsVerticalScrollIndicator={true}
// //                     keyboardShouldPersistTaps="handled"
// //                     contentContainerStyle={styles.scrollContentContainer}
// //                 >
// //                     <View style={[styles.fixedSelectionContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
// //                         <View style={styles.selectionRow}>
// //                             <TouchableOpacity
// //                                 style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// //                                 onPress={() => setShowClassModal(true)}
// //                                 activeOpacity={0.7}
// //                             >
// //                                 <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// //                                     <Icon name="school" size={22} color={theme.primary} />
// //                                 </View>
// //                                 <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Class</Text>
// //                                 <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// //                                     {formData.className || 'Select Class'}
// //                                 </Text>
// //                             </TouchableOpacity>

// //                             <TouchableOpacity
// //                                 style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// //                                 onPress={() => formData.classId ? setShowSectionModal(true) : Alert.alert('Info', 'Please select a class first')}
// //                                 activeOpacity={0.7}
// //                             >
// //                                 <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// //                                     <Icon name="groups" size={22} color={theme.primary} />
// //                                 </View>
// //                                 <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Sections</Text>
// //                                 <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// //                                     {formData.sectionIds.length > 0 ? `${formData.sectionIds.length} section(s)` : 'Select Sections'}
// //                                 </Text>
// //                             </TouchableOpacity>

// //                             <TouchableOpacity
// //                                 style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
// //                                 onPress={() => formData.classId && formData.sectionIds.length > 0 ? setShowSubjectModal(true) : Alert.alert('Info', 'Please select class and sections first')}
// //                                 activeOpacity={0.7}
// //                             >
// //                                 <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
// //                                     <Icon name="book" size={22} color={theme.primary} />
// //                                 </View>
// //                                 <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Subject</Text>
// //                                 <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
// //                                     {formData.subjectName || 'Select Subject'}
// //                                 </Text>
// //                             </TouchableOpacity>
// //                         </View>

// //                         {formData.sectionIds.length > 0 && (
// //                             <View style={[styles.tagsContainer, { backgroundColor: theme.card }]}>
// //                                 <Text style={[styles.tagsLabel, { color: theme.textSecondary }]}>Sections:</Text>
// //                                 <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
// //                                     {formData.sectionNames.map((name, index) => (
// //                                         <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '15' }]}>
// //                                             <Text style={[styles.tagText, { color: theme.primary }]}>Sec {name}</Text>
// //                                         </View>
// //                                     ))}
// //                                 </ScrollView>
// //                             </View>
// //                         )}
// //                     </View>

// //                     <RichToolbar
// //                         getEditor={() => richTextRef.current}
// //                         actions={toolbarActions}
// //                         iconMap={{
// //                             [actions.setBold]: ({ tintColor }) => <Icon name="format-bold" size={22} color={tintColor} />,
// //                             [actions.setItalic]: ({ tintColor }) => <Icon name="format-italic" size={22} color={tintColor} />,
// //                             [actions.setUnderline]: ({ tintColor }) => <Icon name="format-underlined" size={22} color={tintColor} />,
// //                             [actions.alignLeft]: ({ tintColor }) => <Icon name="format-align-left" size={22} color={tintColor} />,
// //                             [actions.alignCenter]: ({ tintColor }) => <Icon name="format-align-center" size={22} color={tintColor} />,
// //                             [actions.alignRight]: ({ tintColor }) => <Icon name="format-align-right" size={22} color={tintColor} />,
// //                             [actions.insertBulletsList]: ({ tintColor }) => <Icon name="format-list-bulleted" size={22} color={tintColor} />,
// //                             [actions.insertOrderedList]: ({ tintColor }) => <Icon name="format-list-numbered" size={22} color={tintColor} />,
// //                             [actions.undo]: ({ tintColor }) => <Icon name="undo" size={22} color={tintColor} />,
// //                             [actions.redo]: ({ tintColor }) => <Icon name="redo" size={22} color={tintColor} />,
// //                         }}
// //                         style={[styles.toolbar, { backgroundColor: theme.background }]}
// //                     />
                    
// //                     <View style={[styles.imageButtonRow, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
// //                         <TouchableOpacity
// //                             style={styles.imageButton}
// //                             onPress={pickAndInsertImage}
// //                             disabled={uploadingImage}
// //                         >
// //                             {uploadingImage ? (
// //                                 <ActivityIndicator size="small" color={theme.primary} />
// //                             ) : (
// //                                 <>
// //                                     <Icon name="image" size={22} color={theme.primary} />
// //                                     <Text style={[styles.imageButtonText, { color: theme.primary }]}>Insert Image</Text>
// //                                 </>
// //                             )}
// //                         </TouchableOpacity>
// //                     </View>

// //                     <View style={styles.editorContainer}>
// //                         <RichEditor
// //                             ref={richTextRef}
// //                             useContainer={true}
// //                             initialFocus={false}
// //                             initialContentHTML={formData.content}
// //                             onChange={(html) => setFormData({ ...formData, content: html })}
// //                             editorStyle={{
// //                                 backgroundColor: theme.background,
// //                                 color: theme.text,
// //                                 placeholderColor: theme.textSecondary,
// //                                 contentCSS: `body { 
// //                                     font-family: -apple-system; 
// //                                     font-size: 16px; 
// //                                     padding: 16px; 
// //                                     line-height: 1.6;
// //                                     min-height: 500px;
// //                                 }
// //                                 img { 
// //                                     max-width: 100%; 
// //                                     height: auto; 
// //                                     border-radius: 12px; 
// //                                     margin: 10px 0;
// //                                 }
// //                                 p { margin-bottom: 12px; }
// //                                 h1, h2, h3 { margin: 16px 0 8px; }`,
// //                             }}
// //                             placeholder="Write your diary entry here..."
// //                             style={[styles.editor, { backgroundColor: theme.background, minHeight: 500 }]}
// //                             onFocus={() => {
// //                                 setTimeout(() => {
// //                                     scrollViewRef.current?.scrollToEnd({ animated: true });
// //                                 }, 100);
// //                             }}
// //                         />
// //                     </View>
                    
// //                     {/* Extra space at bottom for better keyboard handling */}
// //                     <View style={{ height: 80 }} />
// //                 </ScrollView>
// //             </KeyboardAvoidingView>

// //             <View style={[styles.fixedActions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
// //                 <TouchableOpacity
// //                     style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15', borderColor: theme.warning }]}
// //                     onPress={() => handleSave(false)}
// //                     disabled={isSaving || uploadingImage}
// //                 >
// //                     {isSaving ? <ActivityIndicator size="small" color={theme.warning} /> : <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>}
// //                 </TouchableOpacity>

// //                 <TouchableOpacity
// //                     style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
// //                     onPress={() => handleSave(true)}
// //                     disabled={isSaving || uploadingImage}
// //                 >
// //                     {isSaving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>}
// //                 </TouchableOpacity>
// //             </View>

// //             {renderClassModal()}
// //             {renderSectionModal()}
// //             {renderSubjectModal()}
// //         </SafeAreaView>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     safeArea: {
// //         flex: 1,
// //     },
// //     loadingContainer: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     keyboardAvoidingView: {
// //         flex: 1,
// //     },
// //     scrollView: {
// //         flex: 1,
// //     },
// //     scrollContentContainer: {
// //         paddingBottom: 20,
// //     },
// //     header: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         justifyContent: 'space-between',
// //         paddingHorizontal: 16,
// //         paddingVertical: 14,
// //         borderBottomWidth: 1,
// //     },
// //     headerButton: {
// //         width: 40,
// //         height: 40,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     headerTitle: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //     },
// //     fixedSelectionContainer: {
// //         paddingHorizontal: 16,
// //         paddingTop: 12,
// //         paddingBottom: 8,
// //         borderBottomWidth: 1,
// //     },
// //     selectionRow: {
// //         flexDirection: 'row',
// //         gap: 12,
// //         marginBottom: 8,
// //     },
// //     selectionCard: {
// //         flex: 1,
// //         alignItems: 'center',
// //         paddingVertical: 12,
// //         paddingHorizontal: 6,
// //         borderRadius: 12,
// //         borderWidth: 1,
// //     },
// //     cardIcon: {
// //         width: 40,
// //         height: 40,
// //         borderRadius: 20,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         marginBottom: 6,
// //     },
// //     cardLabel: {
// //         fontSize: 10,
// //         marginBottom: 2,
// //     },
// //     cardValue: {
// //         fontSize: 11,
// //         fontWeight: '600',
// //         textAlign: 'center',
// //     },
// //     tagsContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingHorizontal: 10,
// //         paddingVertical: 8,
// //         borderRadius: 10,
// //         marginTop: 4,
// //         gap: 6,
// //     },
// //     tagsLabel: {
// //         fontSize: 11,
// //     },
// //     tagsScroll: {
// //         flexDirection: 'row',
// //     },
// //     tag: {
// //         paddingHorizontal: 8,
// //         paddingVertical: 3,
// //         borderRadius: 14,
// //         marginRight: 6,
// //     },
// //     tagText: {
// //         fontSize: 10,
// //         fontWeight: '500',
// //     },
// //     toolbar: {
// //         borderBottomWidth: 1,
// //         minHeight: 48,
// //         paddingHorizontal: 8,
// //     },
// //     imageButtonRow: {
// //         flexDirection: 'row',
// //         paddingHorizontal: 12,
// //         paddingVertical: 8,
// //         borderTopWidth: 1,
// //     },
// //     imageButton: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         gap: 8,
// //         paddingHorizontal: 12,
// //         paddingVertical: 6,
// //         borderRadius: 8,
// //     },
// //     imageButtonText: {
// //         fontSize: 13,
// //         fontWeight: '500',
// //     },
// //     editorContainer: {
// //         paddingHorizontal: 16,
// //         paddingTop: 8,
// //     },
// //     editor: {
// //         minHeight: 500,
// //         padding: 0,
// //     },
// //     fixedActions: {
// //         flexDirection: 'row',
// //         gap: 12,
// //         paddingHorizontal: 16,
// //         paddingVertical: 12,
// //         borderTopWidth: 1,
// //     },
// //     actionButton: {
// //         flex: 1,
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         paddingVertical: 12,
// //         borderRadius: 10,
// //         gap: 8,
// //     },
// //     draftButton: {
// //         borderWidth: 1,
// //     },
// //     publishButton: {
// //         elevation: 2,
// //         shadowColor: '#000',
// //         shadowOffset: { width: 0, height: 2 },
// //         shadowOpacity: 0.1,
// //         shadowRadius: 3,
// //     },
// //     actionButtonText: {
// //         fontSize: 14,
// //         fontWeight: '600',
// //     },
// //     // Full-screen styles
// //     fullScreenContainer: {
// //         flex: 1,
// //     },
// //     fullScreenHeader: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         justifyContent: 'space-between',
// //         paddingHorizontal: 16,
// //         paddingVertical: 14,
// //         borderBottomWidth: 1,
// //     },
// //     fullScreenToolbar: {
// //         borderBottomWidth: 1,
// //         minHeight: 48,
// //         paddingHorizontal: 8,
// //     },
// //     fullScreenImageRow: {
// //         flexDirection: 'row',
// //         paddingHorizontal: 12,
// //         paddingVertical: 8,
// //         borderTopWidth: 1,
// //     },
// //     fullScreenEditorContainer: {
// //         flex: 1,
// //     },
// //     fullScreenEditor: {
// //         flex: 1,
// //         padding: 0,
// //     },
// //     fullScreenActions: {
// //         flexDirection: 'row',
// //         gap: 12,
// //         paddingHorizontal: 16,
// //         paddingVertical: 12,
// //         borderTopWidth: 1,
// //     },
// //     modalOverlay: {
// //         flex: 1,
// //         backgroundColor: 'rgba(0,0,0,0.5)',
// //         justifyContent: 'flex-end',
// //     },
// //     modalContent: {
// //         borderTopLeftRadius: 24,
// //         borderTopRightRadius: 24,
// //         padding: 20,
// //         maxHeight: '75%',
// //     },
// //     modalHeader: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         marginBottom: 20,
// //     },
// //     modalTitle: {
// //         fontSize: 20,
// //         fontWeight: 'bold',
// //     },
// //     selectAllButton: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingVertical: 12,
// //         marginBottom: 8,
// //         borderBottomWidth: 1,
// //         gap: 12,
// //     },
// //     selectAllText: {
// //         fontSize: 15,
// //         fontWeight: '500',
// //     },
// //     modalItem: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         padding: 14,
// //         borderRadius: 12,
// //         marginBottom: 8,
// //         gap: 12,
// //     },
// //     modalItemIcon: {
// //         width: 40,
// //         height: 40,
// //         borderRadius: 20,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     modalItemText: {
// //         fontSize: 15,
// //     },
// //     subjectDot: {
// //         width: 12,
// //         height: 12,
// //         borderRadius: 6,
// //     },
// //     modalFooter: {
// //         marginTop: 16,
// //     },
// //     confirmButton: {
// //         paddingVertical: 14,
// //         borderRadius: 12,
// //         alignItems: 'center',
// //     },
// //     confirmButtonText: {
// //         color: '#FFF',
// //         fontSize: 15,
// //         fontWeight: '600',
// //     },
// // });

// // export default CreateDiaryScreen;
// // CreateDiaryScreen.js - FIXED with Sticky Toolbar & Proper Full-Screen
// import React, { useState, useEffect, useRef } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     ScrollView,
//     TouchableOpacity,
//     ActivityIndicator,
//     Alert,
//     Modal,
//     FlatList,
//     Platform,
//     SafeAreaView,
//     Dimensions,
//     KeyboardAvoidingView,
//     Keyboard,
// } from 'react-native';
// import { useSelector } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
// import * as ImagePicker from 'expo-image-picker';
// import * as ImageManipulator from 'expo-image-manipulator';
// import { selectThemeData } from '../../store/slices/themeSlice';
// import { selectCurrentUser } from '../../store/slices/authSlice';
// import {
//     useGetTeacherClassesQuery,
//     useGetSubjectsFromClassWiseQuery,
//     useCreateBatchDiaryMutation,
// } from '../../store/diaryApi';

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// const CreateDiaryScreen = ({ navigation, route }) => {
//     const theme = useSelector(selectThemeData);
//     const user = useSelector(selectCurrentUser);
//     const richTextRef = useRef(null);
//     const scrollViewRef = useRef(null);
//     const toolbarRef = useRef(null);
    
//     const editEntry = route.params?.editEntry;
//     const isEditMode = !!editEntry;

//     const [formData, setFormData] = useState({
//         classId: editEntry?.classId || null,
//         className: editEntry?.className || '',
//         sectionIds: editEntry?.sectionIds || [],
//         sectionNames: editEntry?.sectionNames || [],
//         subjectId: editEntry?.subjectId || null,
//         subjectName: editEntry?.subjectName || '',
//         content: editEntry?.content || '<p><br></p>',
//     });
    
//     const [showClassModal, setShowClassModal] = useState(false);
//     const [showSectionModal, setShowSectionModal] = useState(false);
//     const [showSubjectModal, setShowSubjectModal] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);
//     const [selectAllSections, setSelectAllSections] = useState(true);
//     const [uploadingImage, setUploadingImage] = useState(false);
//     const [isInitialized, setIsInitialized] = useState(false);
//     const [isFullScreen, setIsFullScreen] = useState(false);
//     const [toolbarPosition, setToolbarPosition] = useState(0);

//     const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
//     const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsFromClassWiseQuery(
//         { classId: formData.classId },
//         { skip: !formData.classId }
//     );

//     const [createBatchDiary] = useCreateBatchDiaryMutation();

//     const classes = classesData?.data || [];
//     const subjects = subjectsData?.data || [];
//     const selectedClass = classes.find(c => c.classId === formData.classId);
//     const sections = selectedClass?.sections || [];

//     // Initialize edit mode data when classes are loaded
//     useEffect(() => {
//         if (isEditMode && !isInitialized && classes.length > 0 && formData.classId) {
//             const foundClass = classes.find(c => c.classId === formData.classId);
//             if (foundClass) {
//                 setFormData(prev => ({
//                     ...prev,
//                     className: foundClass.className,
//                 }));
//             }
//             setIsInitialized(true);
//         }
//     }, [classes, isEditMode, formData.classId, isInitialized]);

//     // Update selectAllSections based on section selection when editing
//     useEffect(() => {
//         if (sections.length > 0 && isInitialized) {
//             if (formData.sectionIds.length === sections.length) {
//                 setSelectAllSections(true);
//             } else {
//                 setSelectAllSections(false);
//             }
//         }
//     }, [sections, formData.sectionIds, isInitialized]);

//     // Auto-select all sections when class changes (only for new diary)
//     useEffect(() => {
//         if (!isEditMode && selectedClass && sections.length > 0 && selectAllSections) {
//             setFormData(prev => ({
//                 ...prev,
//                 sectionIds: sections.map(s => s.sectionId),
//                 sectionNames: sections.map(s => s.sectionName),
//             }));
//         }
//     }, [selectedClass, sections]);

//     const pickAndInsertImage = async () => {
//         try {
//             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//             if (status !== 'granted') {
//                 Alert.alert('Permission Required', 'Please grant camera roll permissions');
//                 return;
//             }

//             const result = await ImagePicker.launchImageLibraryAsync({
//                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                 quality: 1,
//                 allowsEditing: true,
//             });

//             if (result.canceled) return;

//             const image = result.assets[0];

//             if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
//                 Alert.alert('Image Too Large', 'Please select an image smaller than 2MB');
//                 return;
//             }

//             setUploadingImage(true);

//             const manipulatedImage = await ImageManipulator.manipulateAsync(
//                 image.uri,
//                 [{ resize: { width: 600 } }],
//                 {
//                     compress: 0.5,
//                     format: ImageManipulator.SaveFormat.JPEG,
//                     base64: true,
//                 }
//             );

//             const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;

//             const imageHtml = `<div style="text-align: center; margin: 12px 0;">
//                 <img src="${base64Image}" alt="Diary Image" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
//             </div>`;

//             richTextRef.current?.insertHTML(imageHtml);
            
//             Alert.alert('Success', 'Image added to diary');
//         } catch (error) {
//             console.error('Image pick error:', error);
//             Alert.alert('Error', 'Failed to add image');
//         } finally {
//             setUploadingImage(false);
//         }
//     };

//     const toggleSelectAllSections = () => {
//         if (selectAllSections) {
//             setFormData(prev => ({
//                 ...prev,
//                 sectionIds: [],
//                 sectionNames: [],
//             }));
//             setSelectAllSections(false);
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 sectionIds: sections.map(s => s.sectionId),
//                 sectionNames: sections.map(s => s.sectionName),
//             }));
//             setSelectAllSections(true);
//         }
//     };

//     const toggleSection = (section) => {
//         const isSelected = formData.sectionIds.includes(section.sectionId);
        
//         if (isSelected) {
//             setFormData(prev => ({
//                 ...prev,
//                 sectionIds: prev.sectionIds.filter(id => id !== section.sectionId),
//                 sectionNames: prev.sectionNames.filter(name => name !== section.sectionName),
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 sectionIds: [...prev.sectionIds, section.sectionId],
//                 sectionNames: [...prev.sectionNames, section.sectionName],
//             }));
//         }
//     };

//     const handleSave = async (publish = false) => {
//         if (!formData.classId) {
//             Alert.alert('Error', 'Please select a class');
//             return;
//         }
//         if (formData.sectionIds.length === 0) {
//             Alert.alert('Error', 'Please select at least one section');
//             return;
//         }
//         if (!formData.subjectId) {
//             Alert.alert('Error', 'Please select a subject');
//             return;
//         }
        
//         let htmlContent = formData.content;
//         if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === ' ') {
//             Alert.alert('Error', 'Please write some content');
//             return;
//         }

//         setIsSaving(true);
//         try {
//             const diaryData = {
//                 Date: editEntry?.date || new Date().toISOString().split('T')[0],
//                 ClassID: formData.classId,
//                 SectionIds: formData.sectionIds,
//                 SubjectID: formData.subjectId,
//                 ClassWork: null,
//                 HomeWork: htmlContent,
//                 CreatedBy: user?.id || 1,
//                 isPublished: publish,
//             };

//             await createBatchDiary(diaryData).unwrap();
//             Alert.alert('Success', `Diary ${publish ? 'published' : 'saved as draft'} successfully!`, [
//                 { text: 'OK', onPress: () => navigation.goBack() }
//             ]);
//         } catch (error) {
//             console.error('Save error:', error);
//             Alert.alert('Error', error.data?.message || 'Failed to save diary');
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     const handleBack = () => {
//         const hasContent = formData.content && 
//                           formData.content !== '<p><br></p>' && 
//                           formData.content !== ' ' &&
//                           formData.content.length > 50;
        
//         const isEdited = isEditMode && formData.content !== editEntry.content;
        
//         if ((hasContent && !isEditMode) || (isEdited)) {
//             Alert.alert(
//                 'Discard Changes',
//                 'You have unsaved changes. Are you sure you want to leave?',
//                 [
//                     { text: 'Stay', style: 'cancel' },
//                     { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
//                 ]
//             );
//         } else {
//             navigation.goBack();
//         }
//     };

//     const toggleFullScreen = () => {
//         setIsFullScreen(!isFullScreen);
//     };

//     const handleEditorFocus = () => {
//         setTimeout(() => {
//             scrollViewRef.current?.scrollToEnd({ animated: true });
//         }, 100);
//     };

//     const renderClassModal = () => (
//         <Modal visible={showClassModal} transparent animationType="slide" onRequestClose={() => setShowClassModal(false)}>
//             <View style={styles.modalOverlay}>
//                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
//                     <View style={styles.modalHeader}>
//                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Class</Text>
//                         <TouchableOpacity onPress={() => setShowClassModal(false)}>
//                             <Icon name="close" size={24} color={theme.text} />
//                         </TouchableOpacity>
//                     </View>
//                     <FlatList
//                         data={classes}
//                         keyExtractor={(item) => item.classId?.toString()}
//                         renderItem={({ item }) => (
//                             <TouchableOpacity
//                                 style={[
//                                     styles.modalItem,
//                                     formData.classId === item.classId && { backgroundColor: theme.primary + '15' }
//                                 ]}
//                                 onPress={() => {
//                                     setFormData({
//                                         ...formData,
//                                         classId: item.classId,
//                                         className: item.className,
//                                         sectionIds: [],
//                                         sectionNames: [],
//                                         subjectId: null,
//                                         subjectName: '',
//                                     });
//                                     setSelectAllSections(true);
//                                     setShowClassModal(false);
//                                 }}
//                             >
//                                 <View style={[styles.modalItemIcon, { backgroundColor: theme.primary + '15' }]}>
//                                     <Icon name="school" size={20} color={theme.primary} />
//                                 </View>
//                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
//                                     {item.className}
//                                 </Text>
//                                 {formData.classId === item.classId && (
//                                     <Icon name="check-circle" size={20} color={theme.primary} />
//                                 )}
//                             </TouchableOpacity>
//                         )}
//                     />
//                 </View>
//             </View>
//         </Modal>
//     );

//     const renderSectionModal = () => (
//         <Modal visible={showSectionModal} transparent animationType="slide" onRequestClose={() => setShowSectionModal(false)}>
//             <View style={styles.modalOverlay}>
//                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
//                     <View style={styles.modalHeader}>
//                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Sections</Text>
//                         <TouchableOpacity onPress={() => setShowSectionModal(false)}>
//                             <Icon name="close" size={24} color={theme.text} />
//                         </TouchableOpacity>
//                     </View>
                    
//                     {sections.length > 1 && (
//                         <TouchableOpacity
//                             style={[styles.selectAllButton, { borderBottomColor: theme.border }]}
//                             onPress={toggleSelectAllSections}
//                         >
//                             <Icon 
//                                 name={selectAllSections ? "check-box" : "check-box-outline-blank"} 
//                                 size={22} 
//                                 color={theme.primary} 
//                             />
//                             <Text style={[styles.selectAllText, { color: theme.text }]}>
//                                 {selectAllSections ? 'Deselect All' : 'Select All Sections'}
//                             </Text>
//                         </TouchableOpacity>
//                     )}
                    
//                     <FlatList
//                         data={sections}
//                         keyExtractor={(item) => item.sectionId?.toString()}
//                         renderItem={({ item }) => {
//                             const isSelected = formData.sectionIds.includes(item.sectionId);
//                             return (
//                                 <TouchableOpacity
//                                     style={[styles.modalItem, isSelected && { backgroundColor: theme.primary + '10' }]}
//                                     onPress={() => toggleSection(item)}
//                                 >
//                                     <Icon 
//                                         name={isSelected ? "check-box" : "check-box-outline-blank"} 
//                                         size={22} 
//                                         color={isSelected ? theme.primary : theme.textSecondary} 
//                                     />
//                                     <Text style={[styles.modalItemText, { color: theme.text, marginLeft: 12 }]}>
//                                         Section {item.sectionName}
//                                     </Text>
//                                 </TouchableOpacity>
//                             );
//                         }}
//                     />
//                     <View style={styles.modalFooter}>
//                         <TouchableOpacity
//                             style={[styles.confirmButton, { backgroundColor: theme.primary }]}
//                             onPress={() => setShowSectionModal(false)}
//                         >
//                             <Text style={styles.confirmButtonText}>
//                                 Confirm ({formData.sectionIds.length} selected)
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         </Modal>
//     );

//     const renderSubjectModal = () => (
//         <Modal visible={showSubjectModal} transparent animationType="slide" onRequestClose={() => setShowSubjectModal(false)}>
//             <View style={styles.modalOverlay}>
//                 <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
//                     <View style={styles.modalHeader}>
//                         <Text style={[styles.modalTitle, { color: theme.text }]}>Select Subject</Text>
//                         <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
//                             <Icon name="close" size={24} color={theme.text} />
//                         </TouchableOpacity>
//                     </View>
//                     <FlatList
//                         data={subjects}
//                         keyExtractor={(item) => item.subjectId?.toString()}
//                         renderItem={({ item }) => (
//                             <TouchableOpacity
//                                 style={[
//                                     styles.modalItem,
//                                     formData.subjectId === item.subjectId && { backgroundColor: theme.primary + '15' }
//                                 ]}
//                                 onPress={() => {
//                                     setFormData({
//                                         ...formData,
//                                         subjectId: item.subjectId,
//                                         subjectName: item.subjectName,
//                                     });
//                                     setShowSubjectModal(false);
//                                 }}
//                             >
//                                 <View style={[styles.subjectDot, { backgroundColor: item.colorCode || theme.primary }]} />
//                                 <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
//                                     {item.subjectName}
//                                 </Text>
//                                 {formData.subjectId === item.subjectId && (
//                                     <Icon name="check-circle" size={20} color={theme.primary} />
//                                 )}
//                             </TouchableOpacity>
//                         )}
//                     />
//                 </View>
//             </View>
//         </Modal>
//     );

//     if (classesLoading) {
//         return (
//             <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
//                 <ActivityIndicator size="large" color={theme.primary} />
//             </View>
//         );
//     }

//     const toolbarActions = [
//         actions.setBold,
//         actions.setItalic,
//         actions.setUnderline,
//         actions.alignLeft,
//         actions.alignCenter,
//         actions.alignRight,
//         actions.insertBulletsList,
//         actions.insertOrderedList,
//         actions.undo,
//         actions.redo,
//         actions.insertImage,
//     ];

//     const renderToolbar = () => (
//         <View style={[styles.toolbarWrapper, { backgroundColor: theme.card, borderTopColor: theme.border, borderBottomColor: theme.border }]}>
//             <RichToolbar
//                 getEditor={() => richTextRef.current}
//                 actions={toolbarActions}
//                 iconMap={{
//                     [actions.setBold]: ({ tintColor }) => <Icon name="format-bold" size={22} color={tintColor} />,
//                     [actions.setItalic]: ({ tintColor }) => <Icon name="format-italic" size={22} color={tintColor} />,
//                     [actions.setUnderline]: ({ tintColor }) => <Icon name="format-underlined" size={22} color={tintColor} />,
//                     [actions.alignLeft]: ({ tintColor }) => <Icon name="format-align-left" size={22} color={tintColor} />,
//                     [actions.alignCenter]: ({ tintColor }) => <Icon name="format-align-center" size={22} color={tintColor} />,
//                     [actions.alignRight]: ({ tintColor }) => <Icon name="format-align-right" size={22} color={tintColor} />,
//                     [actions.insertBulletsList]: ({ tintColor }) => <Icon name="format-list-bulleted" size={22} color={tintColor} />,
//                     [actions.insertOrderedList]: ({ tintColor }) => <Icon name="format-list-numbered" size={22} color={tintColor} />,
//                     [actions.undo]: ({ tintColor }) => <Icon name="undo" size={22} color={tintColor} />,
//                     [actions.redo]: ({ tintColor }) => <Icon name="redo" size={22} color={tintColor} />,
//                     [actions.insertImage]: ({ tintColor }) => <TouchableOpacity
//                 style={styles.imageButton}
//                 onPress={pickAndInsertImage}
//                 disabled={uploadingImage}
//             >
//                 {uploadingImage ? (
//                     <ActivityIndicator size="small" color={theme.primary} />
//                 ) : (<Icon name="image" size={22}  />
                  
//                 )}
//             </TouchableOpacity>,
//                 }}
//                 style={[styles.toolbar, { backgroundColor: theme.background }]}
//                 flatContainerStyle={styles.toolbarFlatContainer}
//                 onPressInsertImage={pickAndInsertImage}
//             />
            
//             <TouchableOpacity
//                 style={styles.imageButton}
//                 onPress={pickAndInsertImage}
//                 disabled={uploadingImage}
//             >
//                 {uploadingImage ? (
//                     <ActivityIndicator size="small" color={theme.primary} />
//                 ) : (<Icon name="image" size={22}  />
                  
//                 )}
//             </TouchableOpacity>
//         </View>
//     );

//     // Full-screen mode render
//     if (isFullScreen) {
//         return (
//             <View style={[styles.fullScreenContainer, { backgroundColor: theme.background }]}>
//                 <View style={[styles.fullScreenHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
//                     <TouchableOpacity onPress={toggleFullScreen} style={styles.headerButton}>
//                         <Icon name="fullscreen-exit" size={24} color={theme.text} />
//                     </TouchableOpacity>
//                     <Text style={[styles.headerTitle, { color: theme.text }]}>Full Screen Editor</Text>
//                     <TouchableOpacity onPress={() => handleSave(false)} style={styles.headerButton}>
//                         <Icon name="save" size={24} color={theme.primary} />
//                     </TouchableOpacity>
//                 </View>
                
//                 {renderToolbar()}
                
//                 <KeyboardAvoidingView 
//                     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                     style={styles.fullScreenEditorContainer}
//                     keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
//                 >
//                     <RichEditor
//                         ref={richTextRef}
//                         useContainer={true}
//                         initialFocus={true}
//                         initialContentHTML={formData.content}
//                         onChange={(html) => setFormData({ ...formData, content: html })}
//                         editorStyle={{
//                             backgroundColor: theme.background,
//                             color: theme.text,
//                             placeholderColor: theme.textSecondary,
//                             contentCSS: `body { 
//                                 font-family: -apple-system; 
//                                 font-size: 16px; 
//                                 padding: 16px; 
//                                 line-height: 1.6;
//                                 min-height: ${SCREEN_HEIGHT - 200}px;
//                             }
//                             img { 
//                                 max-width: 100%; 
//                                 height: auto; 
//                                 border-radius: 12px; 
//                                 margin: 10px 0;
//                             }
//                             p { margin-bottom: 12px; }
//                             h1, h2, h3 { margin: 16px 0 8px; }`,
//                         }}
//                         placeholder="Write your diary entry here..."
//                         style={[styles.fullScreenEditor, { backgroundColor: theme.background }]}
//                         onFocus={handleEditorFocus}
//                     />
//                 </KeyboardAvoidingView>
                
//                 <View style={[styles.fullScreenActions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
//                     <TouchableOpacity
//                         style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
//                         onPress={() => handleSave(true)}
//                         disabled={isSaving || uploadingImage}
//                     >
//                         {isSaving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>}
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         );
//     }

//     // Normal mode render
//     return (
//         <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
//             <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
//                 <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
//                     <Icon name="arrow-back" size={24} color={theme.text} />
//                 </TouchableOpacity>
//                 <Text style={[styles.headerTitle, { color: theme.text }]}>
//                     {isEditMode ? 'Edit Diary' : 'Create Diary'}
//                 </Text>
//                 <TouchableOpacity onPress={toggleFullScreen} style={styles.headerButton}>
//                     <Icon name="fullscreen" size={24} color={theme.primary} />
//                 </TouchableOpacity>
//             </View>

//             <KeyboardAvoidingView 
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 style={styles.keyboardAvoidingView}
//                 keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
//             >
//                 <ScrollView 
//                     ref={scrollViewRef}
//                     style={styles.scrollView}
//                     showsVerticalScrollIndicator={true}
//                     keyboardShouldPersistTaps="handled"
//                     contentContainerStyle={styles.scrollContentContainer}
//                     stickyHeaderIndices={[1]}
//                 >
//                     {/* Selection Cards Section */}
//                     <View style={[styles.fixedSelectionContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
//                         <View style={styles.selectionRow}>
//                             <TouchableOpacity
//                                 style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
//                                 onPress={() => setShowClassModal(true)}
//                                 activeOpacity={0.7}
//                             >
//                                 <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
//                                     <Icon name="school" size={22} color={theme.primary} />
//                                 </View>
//                                 <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Class</Text>
//                                 <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
//                                     {formData.className || 'Select Class'}
//                                 </Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
//                                 onPress={() => formData.classId ? setShowSectionModal(true) : Alert.alert('Info', 'Please select a class first')}
//                                 activeOpacity={0.7}
//                             >
//                                 <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
//                                     <Icon name="groups" size={22} color={theme.primary} />
//                                 </View>
//                                 <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Sections</Text>
//                                 <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
//                                     {formData.sectionIds.length > 0 ? `${formData.sectionIds.length} section(s)` : 'Select Sections'}
//                                 </Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
//                                 onPress={() => formData.classId && formData.sectionIds.length > 0 ? setShowSubjectModal(true) : Alert.alert('Info', 'Please select class and sections first')}
//                                 activeOpacity={0.7}
//                             >
//                                 <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
//                                     <Icon name="book" size={22} color={theme.primary} />
//                                 </View>
//                                 <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Subject</Text>
//                                 <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
//                                     {formData.subjectName || 'Select Subject'}
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>

//                         {formData.sectionIds.length > 0 && (
//                             <View style={[styles.tagsContainer, { backgroundColor: theme.card }]}>
//                                 <Text style={[styles.tagsLabel, { color: theme.textSecondary }]}>Sections:</Text>
//                                 <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
//                                     {formData.sectionNames.map((name, index) => (
//                                         <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '15' }]}>
//                                             <Text style={[styles.tagText, { color: theme.primary }]}>Sec {name}</Text>
//                                         </View>
//                                     ))}
//                                 </ScrollView>
//                             </View>
//                         )}
//                     </View>

//                     {/* Sticky Toolbar */}
//                     <View style={[styles.stickyToolbarContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
//                         {renderToolbar()}
//                     </View>

//                     {/* Editor Container */}
//                     <View style={styles.editorContainer}>
//                         <RichEditor
//                             ref={richTextRef}
//                             useContainer={true}
//                             initialFocus={false}
//                             initialContentHTML={formData.content}
//                             onChange={(html) => setFormData({ ...formData, content: html })}
//                             editorStyle={{
//                                 backgroundColor: theme.background,
//                                 color: theme.text,
//                                 placeholderColor: theme.textSecondary,
//                                 contentCSS: `body { 
//                                     font-family: -apple-system; 
//                                     font-size: 16px; 
//                                     padding: 16px; 
//                                     line-height: 1.6;
//                                     min-height: 500px;
//                                 }
//                                 img { 
//                                     max-width: 100%; 
//                                     height: auto; 
//                                     border-radius: 12px; 
//                                     margin: 10px 0;
//                                 }
//                                 p { margin-bottom: 12px; }
//                                 h1, h2, h3 { margin: 16px 0 8px; }`,
//                             }}
//                             placeholder="Write your diary entry here..."
//                             style={[styles.editor, { backgroundColor: theme.background, minHeight: 500 }]}
//                             onFocus={handleEditorFocus}
//                         />
//                     </View>
                    
//                     {/* Extra space at bottom for better keyboard handling */}
//                     <View style={{ height: 100 }} />
//                 </ScrollView>
//             </KeyboardAvoidingView>

//             <View style={[styles.fixedActions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
//                 <TouchableOpacity
//                     style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15', borderColor: theme.warning }]}
//                     onPress={() => handleSave(false)}
//                     disabled={isSaving || uploadingImage}
//                 >
//                     {isSaving ? <ActivityIndicator size="small" color={theme.warning} /> : <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>}
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
//                     onPress={() => handleSave(true)}
//                     disabled={isSaving || uploadingImage}
//                 >
//                     {isSaving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>}
//                 </TouchableOpacity>
//             </View>

//             {renderClassModal()}
//             {renderSectionModal()}
//             {renderSubjectModal()}
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     keyboardAvoidingView: {
//         flex: 1,
//     },
//     scrollView: {
//         flex: 1,
//     },
//     scrollContentContainer: {
//         paddingBottom: 20,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         paddingVertical: 14,
//         borderBottomWidth: 1,
//     },
//     headerButton: {
//         width: 40,
//         height: 40,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//     },
//     fixedSelectionContainer: {
//         paddingHorizontal: 16,
//         paddingTop: 12,
//         paddingBottom: 8,
//         borderBottomWidth: 1,
//     },
//     selectionRow: {
//         flexDirection: 'row',
//         gap: 12,
//         marginBottom: 8,
//     },
//     selectionCard: {
//         flex: 1,
//         alignItems: 'center',
//         paddingVertical: 12,
//         paddingHorizontal: 6,
//         borderRadius: 12,
//         borderWidth: 1,
//     },
//     cardIcon: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 6,
//     },
//     cardLabel: {
//         fontSize: 10,
//         marginBottom: 2,
//     },
//     cardValue: {
//         fontSize: 11,
//         fontWeight: '600',
//         textAlign: 'center',
//     },
//     tagsContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 10,
//         paddingVertical: 8,
//         borderRadius: 10,
//         marginTop: 4,
//         gap: 6,
//     },
//     tagsLabel: {
//         fontSize: 11,
//     },
//     tagsScroll: {
//         flexDirection: 'row',
//     },
//     tag: {
//         paddingHorizontal: 8,
//         paddingVertical: 3,
//         borderRadius: 14,
//         marginRight: 6,
//     },
//     tagText: {
//         fontSize: 10,
//         fontWeight: '500',
//     },
//     stickyToolbarContainer: {
//         borderBottomWidth: 1,
//         borderTopWidth: 1,
//         zIndex: 10,
//     },
//     toolbarWrapper: {
//         borderBottomWidth: 1,
//     },
//     toolbar: {
//         minHeight: 48,
//         paddingHorizontal: 4,
//     },
//     toolbarFlatContainer: {
//         flexWrap: 'wrap',
//         justifyContent: 'center',
//     },
//     imageButton: {
//         alignItems: 'center',
//         paddingVertical: 6,
//         paddingHorizontal: 12,
//         borderTopWidth: 0.5,
//     },
//     imageButtonText: {
//         fontSize: 12,
//         fontWeight: '500',
//     },
//     editorContainer: {
//         paddingHorizontal: 16,
//         paddingTop: 8,
//     },
//     editor: {
//         minHeight: 500,
//         padding: 0,
//     },
//     fixedActions: {
//         flexDirection: 'row',
//         gap: 12,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderTopWidth: 1,
//     },
//     actionButton: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 12,
//         borderRadius: 10,
//         gap: 8,
//     },
//     draftButton: {
//         borderWidth: 1,
//     },
//     publishButton: {
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//     },
//     actionButtonText: {
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     // Full-screen styles
//     fullScreenContainer: {
//         flex: 1,
//     },
//     fullScreenHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         paddingVertical: 14,
//         borderBottomWidth: 1,
//     },
//     fullScreenEditorContainer: {
//         flex: 1,
//     },
//     fullScreenEditor: {
//         flex: 1,
//         padding: 0,
//     },
//     fullScreenActions: {
//         flexDirection: 'row',
//         gap: 12,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderTopWidth: 1,
//     },
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         justifyContent: 'flex-end',
//     },
//     modalContent: {
//         borderTopLeftRadius: 24,
//         borderTopRightRadius: 24,
//         padding: 20,
//         maxHeight: '75%',
//     },
//     modalHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     modalTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//     },
//     selectAllButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 12,
//         marginBottom: 8,
//         borderBottomWidth: 1,
//         gap: 12,
//     },
//     selectAllText: {
//         fontSize: 15,
//         fontWeight: '500',
//     },
//     modalItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 14,
//         borderRadius: 12,
//         marginBottom: 8,
//         gap: 12,
//     },
//     modalItemIcon: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     modalItemText: {
//         fontSize: 15,
//     },
//     subjectDot: {
//         width: 12,
//         height: 12,
//         borderRadius: 6,
//     },
//     modalFooter: {
//         marginTop: 16,
//     },
//     confirmButton: {
//         paddingVertical: 14,
//         borderRadius: 12,
//         alignItems: 'center',
//     },
//     confirmButtonText: {
//         color: '#FFF',
//         fontSize: 15,
//         fontWeight: '600',
//     },
// });

// export default CreateDiaryScreen;

// CreateDiaryScreen.js - COMPLETE WORKING CODE with Full-Screen Scrolling
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    FlatList,
    Platform,
    SafeAreaView,
    Dimensions,
    KeyboardAvoidingView,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { selectThemeData } from '../../store/slices/themeSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import {
    useGetTeacherClassesQuery,
    useGetSubjectsFromClassWiseQuery,
    useCreateBatchDiaryMutation,
} from '../../store/diaryApi';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const CreateDiaryScreen = ({ navigation, route }) => {
    const theme = useSelector(selectThemeData);
    const user = useSelector(selectCurrentUser);
    const richTextRef = useRef(null);
    const scrollViewRef = useRef(null);
    const fullScreenScrollViewRef = useRef(null);
    
    const editEntry = route.params?.editEntry;
    const isEditMode = !!editEntry;

    const [formData, setFormData] = useState({
        classId: editEntry?.classId || null,
        className: editEntry?.className || '',
        sectionIds: editEntry?.sectionIds || [],
        sectionNames: editEntry?.sectionNames || [],
        subjectId: editEntry?.subjectId || null,
        subjectName: editEntry?.subjectName || '',
        content: editEntry?.content || '<p><br></p>',
    });
    
    const [showClassModal, setShowClassModal] = useState(false);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectAllSections, setSelectAllSections] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const { data: classesData, isLoading: classesLoading } = useGetTeacherClassesQuery();
    const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsFromClassWiseQuery(
        { classId: formData.classId },
        { skip: !formData.classId }
    );

    const [createBatchDiary] = useCreateBatchDiaryMutation();

    const classes = classesData?.data || [];
    const subjects = subjectsData?.data || [];
    const selectedClass = classes.find(c => c.classId === formData.classId);
    const sections = selectedClass?.sections || [];

    // Initialize edit mode data when classes are loaded
    useEffect(() => {
        if (isEditMode && !isInitialized && classes.length > 0 && formData.classId) {
            const foundClass = classes.find(c => c.classId === formData.classId);
            if (foundClass) {
                setFormData(prev => ({
                    ...prev,
                    className: foundClass.className,
                }));
            }
            setIsInitialized(true);
        }
    }, [classes, isEditMode, formData.classId, isInitialized]);

    // Update selectAllSections based on section selection when editing
    useEffect(() => {
        if (sections.length > 0 && isInitialized) {
            if (formData.sectionIds.length === sections.length) {
                setSelectAllSections(true);
            } else {
                setSelectAllSections(false);
            }
        }
    }, [sections, formData.sectionIds, isInitialized]);

    // Auto-select all sections when class changes (only for new diary)
    useEffect(() => {
        if (!isEditMode && selectedClass && sections.length > 0 && selectAllSections) {
            setFormData(prev => ({
                ...prev,
                sectionIds: sections.map(s => s.sectionId),
                sectionNames: sections.map(s => s.sectionName),
            }));
        }
    }, [selectedClass, sections]);

    const pickAndInsertImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant camera roll permissions');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: true,
            });

            if (result.canceled) return;

            const image = result.assets[0];

            if (image.fileSize && image.fileSize > 2 * 1024 * 1024) {
                Alert.alert('Image Too Large', 'Please select an image smaller than 2MB');
                return;
            }

            setUploadingImage(true);

            const manipulatedImage = await ImageManipulator.manipulateAsync(
                image.uri,
                [{ resize: { width: 600 } }],
                {
                    compress: 0.5,
                    format: ImageManipulator.SaveFormat.JPEG,
                    base64: true,
                }
            );

            const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;

            const imageHtml = `<div style="text-align: center; margin: 12px 0;">
                <img src="${base64Image}" alt="Diary Image" style="max-width: 100%; height: auto; border-radius: 12px;" />
            </div>`;

            richTextRef.current?.insertHTML(imageHtml);
            
            Alert.alert('Success', 'Image added to diary');
        } catch (error) {
            console.error('Image pick error:', error);
            Alert.alert('Error', 'Failed to add image');
        } finally {
            setUploadingImage(false);
        }
    };

    const toggleSelectAllSections = () => {
        if (selectAllSections) {
            setFormData(prev => ({
                ...prev,
                sectionIds: [],
                sectionNames: [],
            }));
            setSelectAllSections(false);
        } else {
            setFormData(prev => ({
                ...prev,
                sectionIds: sections.map(s => s.sectionId),
                sectionNames: sections.map(s => s.sectionName),
            }));
            setSelectAllSections(true);
        }
    };

    const toggleSection = (section) => {
        const isSelected = formData.sectionIds.includes(section.sectionId);
        
        if (isSelected) {
            setFormData(prev => ({
                ...prev,
                sectionIds: prev.sectionIds.filter(id => id !== section.sectionId),
                sectionNames: prev.sectionNames.filter(name => name !== section.sectionName),
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                sectionIds: [...prev.sectionIds, section.sectionId],
                sectionNames: [...prev.sectionNames, section.sectionName],
            }));
        }
    };

    const handleSave = async (publish = false) => {
        if (!formData.classId) {
            Alert.alert('Error', 'Please select a class');
            return;
        }
        if (formData.sectionIds.length === 0) {
            Alert.alert('Error', 'Please select at least one section');
            return;
        }
        if (!formData.subjectId) {
            Alert.alert('Error', 'Please select a subject');
            return;
        }
        
        let htmlContent = formData.content;
        if (!htmlContent || htmlContent === '<p><br></p>' || htmlContent === ' ') {
            Alert.alert('Error', 'Please write some content');
            return;
        }

        setIsSaving(true);
        try {
            const diaryData = {
                Date: editEntry?.date || new Date().toISOString().split('T')[0],
                ClassID: formData.classId,
                SectionIds: formData.sectionIds,
                SubjectID: formData.subjectId,
                ClassWork: null,
                HomeWork: htmlContent,
                CreatedBy: user?.id || 1,
                isPublished: publish,
            };

            await createBatchDiary(diaryData).unwrap();
            Alert.alert('Success', `Diary ${publish ? 'published' : 'saved as draft'} successfully!`, [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', error.data?.message || 'Failed to save diary');
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        const hasContent = formData.content && 
                          formData.content !== '<p><br></p>' && 
                          formData.content !== ' ' &&
                          formData.content.length > 50;
        
        const isEdited = isEditMode && formData.content !== editEntry.content;
        
        if ((hasContent && !isEditMode) || (isEdited)) {
            Alert.alert(
                'Discard Changes',
                'You have unsaved changes. Are you sure you want to leave?',
                [
                    { text: 'Stay', style: 'cancel' },
                    { text: 'Leave', onPress: () => navigation.goBack(), style: 'destructive' }
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const handleEditorFocus = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleFullScreenEditorFocus = () => {
        setTimeout(() => {
            fullScreenScrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const renderClassModal = () => (
        <Modal visible={showClassModal} transparent animationType="slide" onRequestClose={() => setShowClassModal(false)}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Select Class</Text>
                        <TouchableOpacity onPress={() => setShowClassModal(false)}>
                            <Icon name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={classes}
                        keyExtractor={(item) => item.classId?.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    formData.classId === item.classId && { backgroundColor: theme.primary + '15' }
                                ]}
                                onPress={() => {
                                    setFormData({
                                        ...formData,
                                        classId: item.classId,
                                        className: item.className,
                                        sectionIds: [],
                                        sectionNames: [],
                                        subjectId: null,
                                        subjectName: '',
                                    });
                                    setSelectAllSections(true);
                                    setShowClassModal(false);
                                }}
                            >
                                <View style={[styles.modalItemIcon, { backgroundColor: theme.primary + '15' }]}>
                                    <Icon name="school" size={20} color={theme.primary} />
                                </View>
                                <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
                                    {item.className}
                                </Text>
                                {formData.classId === item.classId && (
                                    <Icon name="check-circle" size={20} color={theme.primary} />
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );

    const renderSectionModal = () => (
        <Modal visible={showSectionModal} transparent animationType="slide" onRequestClose={() => setShowSectionModal(false)}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Select Sections</Text>
                        <TouchableOpacity onPress={() => setShowSectionModal(false)}>
                            <Icon name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                    
                    {sections.length > 1 && (
                        <TouchableOpacity
                            style={[styles.selectAllButton, { borderBottomColor: theme.border }]}
                            onPress={toggleSelectAllSections}
                        >
                            <Icon 
                                name={selectAllSections ? "check-box" : "check-box-outline-blank"} 
                                size={22} 
                                color={theme.primary} 
                            />
                            <Text style={[styles.selectAllText, { color: theme.text }]}>
                                {selectAllSections ? 'Deselect All' : 'Select All Sections'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    
                    <FlatList
                        data={sections}
                        keyExtractor={(item) => item.sectionId?.toString()}
                        renderItem={({ item }) => {
                            const isSelected = formData.sectionIds.includes(item.sectionId);
                            return (
                                <TouchableOpacity
                                    style={[styles.modalItem, isSelected && { backgroundColor: theme.primary + '10' }]}
                                    onPress={() => toggleSection(item)}
                                >
                                    <Icon 
                                        name={isSelected ? "check-box" : "check-box-outline-blank"} 
                                        size={22} 
                                        color={isSelected ? theme.primary : theme.textSecondary} 
                                    />
                                    <Text style={[styles.modalItemText, { color: theme.text, marginLeft: 12 }]}>
                                        Section {item.sectionName}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[styles.confirmButton, { backgroundColor: theme.primary }]}
                            onPress={() => setShowSectionModal(false)}
                        >
                            <Text style={styles.confirmButtonText}>
                                Confirm ({formData.sectionIds.length} selected)
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderSubjectModal = () => (
        <Modal visible={showSubjectModal} transparent animationType="slide" onRequestClose={() => setShowSubjectModal(false)}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Select Subject</Text>
                        <TouchableOpacity onPress={() => setShowSubjectModal(false)}>
                            <Icon name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={subjects}
                        keyExtractor={(item) => item.subjectId?.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    formData.subjectId === item.subjectId && { backgroundColor: theme.primary + '15' }
                                ]}
                                onPress={() => {
                                    setFormData({
                                        ...formData,
                                        subjectId: item.subjectId,
                                        subjectName: item.subjectName,
                                    });
                                    setShowSubjectModal(false);
                                }}
                            >
                                <View style={[styles.subjectDot, { backgroundColor: item.colorCode || theme.primary }]} />
                                <Text style={[styles.modalItemText, { color: theme.text, flex: 1, marginLeft: 12 }]}>
                                    {item.subjectName}
                                </Text>
                                {formData.subjectId === item.subjectId && (
                                    <Icon name="check-circle" size={20} color={theme.primary} />
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );

    if (classesLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    const toolbarActions = [
        actions.setBold,
        actions.setItalic,
        actions.setUnderline,
        actions.alignLeft,
        actions.alignCenter,
        actions.alignRight,
        actions.insertBulletsList,
        actions.insertOrderedList,
        actions.undo,
        actions.redo,
        actions.insertImage,
    ];

    const renderToolbar = () => (
        <View style={[styles.toolbarWrapper, { backgroundColor: theme.card, borderTopColor: theme.border, borderBottomColor: theme.border }]}>
            <RichToolbar
                getEditor={() => richTextRef.current}
                actions={toolbarActions}
                iconMap={{
                    [actions.setBold]: ({ tintColor }) => <Icon name="format-bold" size={22} color={tintColor} />,
                    [actions.setItalic]: ({ tintColor }) => <Icon name="format-italic" size={22} color={tintColor} />,
                    [actions.setUnderline]: ({ tintColor }) => <Icon name="format-underlined" size={22} color={tintColor} />,
                    [actions.alignLeft]: ({ tintColor }) => <Icon name="format-align-left" size={22} color={tintColor} />,
                    [actions.alignCenter]: ({ tintColor }) => <Icon name="format-align-center" size={22} color={tintColor} />,
                    [actions.alignRight]: ({ tintColor }) => <Icon name="format-align-right" size={22} color={tintColor} />,
                    [actions.insertBulletsList]: ({ tintColor }) => <Icon name="format-list-bulleted" size={22} color={tintColor} />,
                    [actions.insertOrderedList]: ({ tintColor }) => <Icon name="format-list-numbered" size={22} color={tintColor} />,
                    [actions.undo]: ({ tintColor }) => <Icon name="undo" size={22} color={tintColor} />,
                    [actions.redo]: ({ tintColor }) => <Icon name="redo" size={22} color={tintColor} />,
                    [actions.insertImage]: ({ tintColor }) => 
                    <TouchableOpacity
                style={styles.imageButton}
                onPress={pickAndInsertImage}
                disabled={uploadingImage}
            >
                 {uploadingImage ? (
                    <ActivityIndicator size="small" color={theme.primary} />
                ) : (<Icon name="image" size={22} color={tintColor}   />
                  
                )}
            </TouchableOpacity>,
                }}
                style={[styles.toolbar, { backgroundColor: theme.background }]}
                flatContainerStyle={styles.toolbarFlatContainer}
                onPressInsertImage={pickAndInsertImage}
            />
        </View>
    );

    // Full-screen mode render with proper scrolling
    if (isFullScreen) {
        return (
            <View style={[styles.fullScreenContainer, { backgroundColor: theme.background }]}>
                <View style={[styles.fullScreenHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={toggleFullScreen} style={styles.headerButton}>
                        <Icon name="fullscreen-exit" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Full Screen Editor</Text>
                    <TouchableOpacity onPress={() => handleSave(false)} style={styles.headerButton}>
                        <Icon name="save" size={24} color={theme.primary} />
                    </TouchableOpacity>
                </View>
                
                {renderToolbar()}
                
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.fullScreenKeyboardView}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <ScrollView 
                        ref={fullScreenScrollViewRef}
                        style={styles.fullScreenScrollView}
                        contentContainerStyle={styles.fullScreenScrollContent}
                        showsVerticalScrollIndicator={true}
                        keyboardShouldPersistTaps="handled"
                    >
                        <RichEditor
                            ref={richTextRef}
                            useContainer={true}
                            initialFocus={true}
                            initialContentHTML={formData.content}
                            onChange={(html) => setFormData({ ...formData, content: html })}
                            editorStyle={{
                                backgroundColor: theme.background,
                                color: theme.text,
                                placeholderColor: theme.textSecondary,
                                contentCSS: `body { 
                                    font-family: -apple-system; 
                                    font-size: 16px; 
                                    padding: 16px; 
                                    line-height: 1.6;
                                    min-height: ${SCREEN_HEIGHT - 200}px;
                                }
                                img { 
                                    max-width: 100%; 
                                    height: auto; 
                                    border-radius: 12px; 
                                    margin: 10px 0;
                                }
                                p { margin-bottom: 12px; }
                                h1, h2, h3 { margin: 16px 0 8px; }`,
                            }}
                            placeholder="Write your diary entry here..."
                            style={[styles.fullScreenEditor, { backgroundColor: theme.background }]}
                            onFocus={handleFullScreenEditorFocus}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
                
                <View style={[styles.fullScreenActions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15', borderColor: theme.warning, flex: 1 }]}
                        onPress={() => handleSave(false)}
                        disabled={isSaving || uploadingImage}
                    >
                        {isSaving ? <ActivityIndicator size="small" color={theme.warning} /> : <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success, flex: 1 }]}
                        onPress={() => handleSave(true)}
                        disabled={isSaving || uploadingImage}
                    >
                        {isSaving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Normal mode render
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                    <Icon name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                    {isEditMode ? 'Edit Diary' : 'Create Diary'}
                </Text>
                <TouchableOpacity onPress={toggleFullScreen} style={styles.headerButton}>
                    <Icon name="fullscreen" size={24} color={theme.primary} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
            >
                <ScrollView 
                    ref={scrollViewRef}
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContentContainer}
                    stickyHeaderIndices={[1]}
                >
                    {/* Selection Cards Section */}
                    <View style={[styles.fixedSelectionContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
                        <View style={styles.selectionRow}>
                            <TouchableOpacity
                                style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                                onPress={() => setShowClassModal(true)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
                                    <Icon name="school" size={22} color={theme.primary} />
                                </View>
                                <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Class</Text>
                                <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
                                    {formData.className || 'Select Class'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                                onPress={() => formData.classId ? setShowSectionModal(true) : Alert.alert('Info', 'Please select a class first')}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
                                    <Icon name="groups" size={22} color={theme.primary} />
                                </View>
                                <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Sections</Text>
                                <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
                                    {formData.sectionIds.length > 0 ? `${formData.sectionIds.length} section(s)` : 'Select Sections'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.selectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                                onPress={() => formData.classId && formData.sectionIds.length > 0 ? setShowSubjectModal(true) : Alert.alert('Info', 'Please select class and sections first')}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.cardIcon, { backgroundColor: theme.primary + '15' }]}>
                                    <Icon name="book" size={22} color={theme.primary} />
                                </View>
                                <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Subject</Text>
                                <Text style={[styles.cardValue, { color: theme.text }]} numberOfLines={1}>
                                    {formData.subjectName || 'Select Subject'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {formData.sectionIds.length > 0 && (
                            <View style={[styles.tagsContainer, { backgroundColor: theme.card }]}>
                                <Text style={[styles.tagsLabel, { color: theme.textSecondary }]}>Sections:</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
                                    {formData.sectionNames.map((name, index) => (
                                        <View key={index} style={[styles.tag, { backgroundColor: theme.primary + '15' }]}>
                                            <Text style={[styles.tagText, { color: theme.primary }]}>Sec {name}</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    {/* Sticky Toolbar */}
                    <View style={[styles.stickyToolbarContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                        {renderToolbar()}
                    </View>

                    {/* Editor Container */}
                    <View style={styles.editorContainer}>
                        <RichEditor
                            ref={richTextRef}
                            useContainer={true}
                            initialFocus={false}
                            initialContentHTML={formData.content}
                            onChange={(html) => setFormData({ ...formData, content: html })}
                            editorStyle={{
                                backgroundColor: theme.background,
                                color: theme.text,
                                placeholderColor: theme.textSecondary,
                                contentCSS: `body { 
                                    font-family: -apple-system; 
                                    font-size: 16px; 
                                    padding: 16px; 
                                    line-height: 1.6;
                                    min-height: 500px;
                                }
                                img { 
                                    max-width: 100%; 
                                    height: auto; 
                                    border-radius: 12px; 
                                    margin: 10px 0;
                                }
                                p { margin-bottom: 12px; }
                                h1, h2, h3 { margin: 16px 0 8px; }`,
                            }}
                            placeholder="Write your diary entry here..."
                            style={[styles.editor, { backgroundColor: theme.background, minHeight: 500 }]}
                            onFocus={handleEditorFocus}
                        />
                    </View>
                    
                    {/* Extra space at bottom for better keyboard handling */}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={[styles.fixedActions, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.draftButton, { backgroundColor: theme.warning + '15', borderColor: theme.warning }]}
                    onPress={() => handleSave(false)}
                    disabled={isSaving || uploadingImage}
                >
                    {isSaving ? <ActivityIndicator size="small" color={theme.warning} /> : <Text style={[styles.actionButtonText, { color: theme.warning }]}>Save Draft</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.publishButton, { backgroundColor: theme.success }]}
                    onPress={() => handleSave(true)}
                    disabled={isSaving || uploadingImage}
                >
                    {isSaving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={[styles.actionButtonText, { color: '#FFF' }]}>Publish</Text>}
                </TouchableOpacity>
            </View>

            {renderClassModal()}
            {renderSectionModal()}
            {renderSubjectModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    fixedSelectionContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
    },
    selectionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    selectionCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 6,
        borderRadius: 12,
        borderWidth: 1,
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    cardLabel: {
        fontSize: 10,
        marginBottom: 2,
    },
    cardValue: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        marginTop: 4,
        gap: 6,
    },
    tagsLabel: {
        fontSize: 11,
    },
    tagsScroll: {
        flexDirection: 'row',
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 14,
        marginRight: 6,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '500',
    },
    stickyToolbarContainer: {
        borderBottomWidth: 1,
        borderTopWidth: 1,
        zIndex: 10,
    },
    toolbarWrapper: {
        borderBottomWidth: 1,
    },
    toolbar: {
        minHeight: 48,
        paddingHorizontal: 4,
    },
    toolbarFlatContainer: {
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    editorContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    editor: {
        minHeight: 500,
        padding: 0,
    },
    fixedActions: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    draftButton: {
        borderWidth: 1,
    },
    publishButton: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    // Full-screen styles
    fullScreenContainer: {
        flex: 1,
    },
    fullScreenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    fullScreenKeyboardView: {
        flex: 1,
    },
    fullScreenScrollView: {
        flex: 1,
    },
    fullScreenScrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    fullScreenEditor: {
        flex: 1,
        padding: 0,
        minHeight: SCREEN_HEIGHT - 200,
    },
    fullScreenActions: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '75%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    selectAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 8,
        borderBottomWidth: 1,
        gap: 12,
    },
    selectAllText: {
        fontSize: 15,
        fontWeight: '500',
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        marginBottom: 8,
        gap: 12,
    },
    modalItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalItemText: {
        fontSize: 15,
    },
    subjectDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    modalFooter: {
        marginTop: 16,
    },
    confirmButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default CreateDiaryScreen;