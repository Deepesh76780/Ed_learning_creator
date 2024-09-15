import { router } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Sample course data
const courses = [
    { id: '1', name: 'React Native Basics', weeks: 4 },
    { id: '2', name: 'Advanced React Native', weeks: 6 },
    { id: '3', name: 'JavaScript Essentials', weeks: 3 },
    { id: '4', name: 'Full Stack Development', weeks: 8 },
    { id: '5', name: 'Blockchain Development', weeks: 5 },
    { id: '6', name: 'AI Model Integration', weeks: 7 },
    { id: '7', name: 'React Native Basics', weeks: 4 },
    { id: '8', name: 'Advanced React Native', weeks: 6 },
    { id: '9', name: 'JavaScript Essentials', weeks: 3 },
    { id: '10', name: 'Full Stack Development', weeks: 8 },
    { id: '11', name: 'Blockchain Development', weeks: 5 },
    { id: '12', name: 'AI Model Integration', weeks: 7 },
    // Add more courses as needed
];

type CourseProp = {
    id: string,
    name: string,
    weeks: number
}

export default function RootLayout() {
    const handlePress = (courseName: string) => {
        // @ts-expect-error
        router.push(`/details/${courseName}`, { relativeToDirectory: true });
    };

    const renderCourseCard = ({ item }: { item: CourseProp }) => (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => handlePress(item.name)}
            >
                <Text style={styles.courseName}>{item.name}</Text>
                <Text style={styles.courseWeeks}>{item.weeks} weeks</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={courses}
                renderItem={renderCourseCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 4, // Shadow effect for Android
        shadowColor: '#000', // Shadow effect for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        position: 'relative',
    },
    courseName: {
        fontSize: 15,
        fontWeight: '500',
    },
    courseWeeks: {
        fontSize: 14,
        color: '#777',
    },
});
