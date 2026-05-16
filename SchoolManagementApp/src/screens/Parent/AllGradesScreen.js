// // src/screens/Parent/AllGradesScreen.js
// import React from 'react';
// import { View, Text, StyleSheet, FlatList } from 'react-native';
// import { useSelector } from 'react-redux';
// import { useGetChildGradesQuery } from '../../services/gradesApi';

// const AllGradesScreen = ({ route }) => {
//   const { childId, childName } = route.params;
//   const theme = useSelector(selectThemeData);
  
//   const { data: grades = [], isLoading } = useGetChildGradesQuery({ childId });
  
//   // Similar rendering logic as ChildGradesScreen but shows all grades
  
//   return (
//     // Your implementation
//   );
// };

// export default AllGradesScreen;