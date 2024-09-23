import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import WeekCard from '@/components/WeekCard';
import { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
// @ts-expect-error
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTeacherContext } from '@/context/TeacherId';



export default function CourseDetails() {

    const Tab = createBottomTabNavigator()
    const { name } = useLocalSearchParams();
    const [courseList, setCourseList] = useState<any>()
    const [loading, setLoading] = useState(true);
    const [week, setWeeks] = useState<any>([])
    const [header, setHeader] = useState()
    const { teacherName } = useTeacherContext()

    useEffect(() => {


        if (courseList) {

            const data = courseList && Object.keys(courseList["content_layout"])

            if (data.length > 0) {
                const dataChanged = data.map((item: any) => {
                    return {
                        "week": item,
                    }
                })
                setWeeks(dataChanged)
            }

        }

    }, [courseList])


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

                const data = await response.json();

                const filterData: any = data.courses.filter((item: any) => item._id === name)
                const getKeys: any = Object.keys(filterData[0])
                setHeader(getKeys[1]);
                const getContext = Object.keys(filterData[0][getKeys[1]])
                setCourseList(filterData[0][getKeys[1]][getContext[0]])

            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        })()
    }, [])

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                {/* <Stack.Screen options={{
                    headerTitle: "loading...",
                }} /> */}

                <ActivityIndicator size="large" color="#c4210b" />
            </View>
        );
    }

    function Description() {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{
                    headerTitle: header || "course details",
                }} />
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.section}>
                        <Text style={styles.header}>Description</Text>
                        <Text style={styles.content}>{courseList?.description}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.header}>Grading Policy</Text>
                        <Text style={styles.content}>{courseList?.grading_policy}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.header}>Prerequisites</Text>
                        <Text style={styles.content}>{courseList?.pre_requisites}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.header}>References</Text>
                        <Text style={styles.content}>{courseList?.references}</Text>
                    </View>
                </ScrollView>
            </View>

        )
    }

    function Weeks() {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{
                    headerTitle: header || "course details",
                }} />
                <ScrollView>
                    {
                        week.map((weekData: any, index: any) => (
                            <WeekCard
                                key={index}
                                week={weekData.week}
                            />
                        ))
                    }
                </ScrollView>
            </View >
        )
    }


    return (

        <NavigationContainer independent={true}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'details') {
                            iconName = 'information-circle-outline'; // Ionicons name for Login
                        } else if (route.name === 'week') {
                            iconName = 'calendar-outline'; // Ionicons name for Signup
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: "#a81400",
                    headerShown: true,
                })}
            >

                <Tab.Screen name="details" component={Description} />
                <Tab.Screen name="week" component={Weeks} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    scrollContainer: {
        flex: 1,
    },
    section: {
        marginBottom: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
