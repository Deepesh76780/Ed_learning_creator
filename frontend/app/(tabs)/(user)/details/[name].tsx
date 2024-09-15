import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router'; // To access route parameters

export default function CourseDetails() {
    const { name } = useLocalSearchParams(); // Get the course name from the URL

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerTitle: Array.isArray(name) ? name[0] : name || 'Course Details',
            }} />
            <Text style={styles.title}>Course Details</Text>
            <Text style={styles.courseName}>Course Name: {name}</Text>
            {/* Add more details about the course */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    courseName: {
        fontSize: 18,
    },
});
