// screens/Parent/CreateComplaintScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { selectThemeData } from '../../store/slices/themeSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useGetComplaintCategoriesQuery, useCreateComplaintMutation } from '../../store/complaintApi';
import { Picker } from '@react-native-picker/picker';

const CreateComplaintScreen = ({ route, navigation }) => {
    const theme = useSelector(selectThemeData);
    const currentUser = useSelector(selectCurrentUser);
    const { childId, childName, childData } = route.params || {};

    const [formData, setFormData] = useState({
        categoryId: '',
        subject: '',
        details: '',
        contactName: currentUser?.name || '',
        contactNumber: '',
        priority: 'Medium',
    });

    const { data: categories = [], isLoading: categoriesLoading } = useGetComplaintCategoriesQuery();
    const [createComplaint, { isLoading: submitting }] = useCreateComplaintMutation();
console.log("categories:", categories);
    const handleSubmit = async () => {
        if (!formData.categoryId) {
            Alert.alert('Error', 'Please select a complaint category');
            return;
        }
        if (!formData.subject.trim()) {
            Alert.alert('Error', 'Please enter complaint subject');
            return;
        }
        if (!formData.details.trim()) {
            Alert.alert('Error', 'Please enter complaint details');
            return;
        }
        if (!formData.contactNumber.trim()) {
            Alert.alert('Error', 'Please enter your contact number');
            return;
        }

        try {
            const payload = {
                reg_Id: childId,
                complainCategory: parseInt(formData.categoryId),
                complaintSubject: formData.subject,
                complainDetails: formData.details,
                complaintantName: formData.contactName,
                complaintantNumber: formData.contactNumber,
                priority: formData.priority,
                campusID: childData?.campusID || 1,
                sessionYear: new Date().getFullYear(),
                createdBy: currentUser?.id,
            };

            const result = await createComplaint(payload).unwrap();
            if (result.success) {
                Alert.alert('Success', 'Complaint submitted successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error('Submit error:', error);
            Alert.alert('Error', 'Failed to submit complaint. Please try again.');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient colors={[theme.primary, theme.primary + 'CC']} style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>File Complaint</Text>
                    <View style={{ width: 40 }} />
                </View>
                <Text style={styles.studentName}>For: {childName}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={[styles.formCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Complaint Details</Text>

                    {/* Category Dropdown */}
                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Category *</Text>
                        <View style={[styles.pickerWrapper, { borderColor: theme.border, backgroundColor: theme.background }]}>
                            <Picker
                                selectedValue={formData.categoryId}
                                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                                style={[styles.picker, { color: theme.text }]}
                                dropdownIconColor={theme.textSecondary}
                            >
                                <Picker.Item label="Select a category" value="" />
                                {categories.map((cat) => (
                                    <Picker.Item key={cat.id} label={cat.title} value={cat.id.toString()} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Subject */}
                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Subject *</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                            placeholder="Brief subject of complaint"
                            placeholderTextColor={theme.textSecondary}
                            value={formData.subject}
                            onChangeText={(text) => setFormData({ ...formData, subject: text })}
                        />
                    </View>

                    {/* Details */}
                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Details *</Text>
                        <TextInput
                            style={[styles.textArea, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                            placeholder="Describe your complaint in detail"
                            placeholderTextColor={theme.textSecondary}
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={formData.details}
                            onChangeText={(text) => setFormData({ ...formData, details: text })}
                        />
                    </View>

                    {/* Priority */}
                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Priority</Text>
                        <View style={styles.priorityRow}>
                            {['Low', 'Medium', 'High'].map((priority) => (
                                <TouchableOpacity
                                    key={priority}
                                    style={[
                                        styles.priorityOption,
                                        { borderColor: theme.border, backgroundColor: theme.background },
                                        formData.priority === priority && { backgroundColor: theme.primary + '20', borderColor: theme.primary }
                                    ]}
                                    onPress={() => setFormData({ ...formData, priority })}
                                >
                                    <Text style={[styles.priorityOptionText, { color: formData.priority === priority ? theme.primary : theme.textSecondary }]}>
                                        {priority}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Contact Information */}
                    <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 10 }]}>Contact Information</Text>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Your Name *</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                            placeholder="Your full name"
                            placeholderTextColor={theme.textSecondary}
                            value={formData.contactName}
                            onChangeText={(text) => setFormData({ ...formData, contactName: text })}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Contact Number *</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                            placeholder="Your phone number"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="phone-pad"
                            value={formData.contactNumber}
                            onChangeText={(text) => setFormData({ ...formData, contactNumber: text })}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitBtn, { backgroundColor: theme.primary }]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <>
                                <Icon name="send" size={20} color="#FFF" />
                                <Text style={styles.submitBtnText}>Submit Complaint</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 10 : 18, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '700' },
    studentName: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 12 },
    contentContainer: { padding: 16 },
    formCard: { borderRadius: 18, padding: 20, elevation: 2 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
    formGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
    pickerWrapper: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
    picker: { height: 50, width: '100%' },
    input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
    textArea: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, minHeight: 100 },
    priorityRow: { flexDirection: 'row', gap: 12 },
    priorityOption: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
    priorityOptionText: { fontSize: 14, fontWeight: '500' },
    submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8, marginTop: 20 },
    submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default CreateComplaintScreen;