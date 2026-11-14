import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, validateToken, selectIsLoading, selectAuthError } from '../store/slices/authSlice';
import { selectThemeData } from '../store/slices/themeSlice';
export default function RoleAccessScreen() {
  const dispatch = useDispatch(); const theme = useSelector(selectThemeData);
  const loading = useSelector(selectIsLoading); const error = useSelector(selectAuthError);
  return <View style={[styles.page,{backgroundColor:theme.background}]}>
    <Text style={[styles.title,{color:theme.text}]}>Access not configured</Text>
    <Text style={[styles.message,{color:theme.textSecondary}]}>Your account does not have a supported school app role. Ask your school administrator to assign Admin, Teacher or Parent access, then refresh your account.</Text>
    {error ? <Text accessibilityRole="alert" style={{color:theme.error}}>{error}</Text> : null}
    <TouchableOpacity accessibilityRole="button" disabled={loading} style={[styles.button,{backgroundColor:theme.primary}]} onPress={()=>dispatch(validateToken())}><Text style={styles.label}>{loading?'Refreshing account…':'Refresh account'}</Text></TouchableOpacity>
    <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={()=>dispatch(logoutUser())}><Text style={{color:theme.primary}}>Sign out</Text></TouchableOpacity>
  </View>;
}
const styles=StyleSheet.create({page:{flex:1,justifyContent:'center',padding:28},title:{fontSize:25,fontWeight:'700',marginBottom:16},message:{fontSize:16,lineHeight:25,marginBottom:24},button:{padding:16,alignItems:'center',borderRadius:10,marginTop:12},label:{color:'#fff',fontWeight:'700'}});
