import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { selectThemeData } from '../../store/slices/themeSlice';
export default function AdminDashboardScreen({navigation}) {
  const user=useSelector(selectCurrentUser);const theme=useSelector(selectThemeData);
  return <ScrollView style={{flex:1,backgroundColor:theme.background}} contentContainerStyle={styles.page}>
    <Text style={{color:theme.textSecondary}}>Administrator</Text>
    <Text style={[styles.title,{color:theme.text}]}>Welcome, {user?.name || user?.fullName || user?.username || 'Administrator'}</Text>
    <Text style={[styles.subtitle,{color:theme.textSecondary}]}>School app administration</Text>
    {[['Notifications','Review account notifications'],['AdminProfile','View your administrator profile'],['AdminSettings','Manage app preferences']].map(([name,label])=><TouchableOpacity key={name} accessibilityRole="button" accessibilityLabel={label} onPress={()=>navigation.navigate(name)} style={[styles.card,{backgroundColor:theme.card,borderColor:theme.border}]}><Text style={{fontSize:17,fontWeight:'600',color:theme.primary}}>{label}</Text></TouchableOpacity>)}
    <View style={[styles.card,{borderColor:theme.border}]}><Text style={{fontSize:17,fontWeight:'600',color:theme.text}}>School management tools</Text><Text style={[styles.note,{color:theme.textSecondary}]}>Use your school’s configured web administration portal for administrative workflows. Student, staff and rule-management editors are not implemented in this mobile app.</Text></View>
  </ScrollView>;
}
const styles=StyleSheet.create({page:{padding:24},title:{fontSize:26,fontWeight:'700',marginTop:12},subtitle:{fontSize:16,marginTop:8,marginBottom:24},card:{padding:20,borderRadius:12,borderWidth:1,marginBottom:16},note:{fontSize:15,lineHeight:23,marginTop:10}});
