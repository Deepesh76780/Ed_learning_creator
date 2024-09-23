import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useTeacherContext } from '@/context/TeacherId';

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



export default function RootLayout() {
    const [courseList, setCourseList] = useState([])
    const [loading, setLoading] = useState(true);
    const { teacherName } = useTeacherContext()

    const handlePress = (courseName: string) => {
        // @ts-expect-error
        router.push(`/details/${courseName}`, { relativeToDirectory: true });
    };

    useEffect(() => {
        (async () => {

            try {
                const response = await fetch('http://127.0.0.1:8000/courses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify({
                        teacher_id: teacherName
                    }),
                });

                // console.log(respose)
                const data = await response.json();
                setCourseList(data.courses)

            } catch (error) {
                Alert.alert('Error', 'Failed to connect to the server.');
                console.error('Error:', error);
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <Stack.Screen options={{
                    headerTitle: "loading...",
                }} />

                <ActivityIndicator size="large" color="#c4210b" />
            </View>
        );
    }


    const renderCourseCard = ({ item }: { item: any }) => {

        const keys = Object.keys(item)

        console.log(keys)

        return (<View style={styles.card}>
            <TouchableOpacity
                onPress={() => handlePress(item._id)}
            >
                <Text style={styles.courseName}>{keys[1]}</Text>
                <Text style={styles.courseWeeks}>{item.teacher_id}</Text>
            </TouchableOpacity>
        </View>)
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerTitle: "created course",
            }} />
            <FlatList
                data={courseList}
                renderItem={renderCourseCard}
                keyExtractor={(item) => item._id}
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
