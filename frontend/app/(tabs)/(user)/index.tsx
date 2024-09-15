import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// @ts-expect-error
import Icon from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';

export default function RootLayout() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={()=>{
                router.push("/Created Courses")
            }}>
                <Icon name="book-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>All My Courses</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={()=>{}}>
                <Icon name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Create New Course</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#c4210b',
        padding: 15,
        width:200,
        margin: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        marginLeft: 10,
    },
});
