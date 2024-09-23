import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { useState } from 'react';
// @ts-expect-error
import Icon from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';

export default function RootLayout() {
    const [modalVisible, setModalVisible] = useState(false);
    const [content, setContent] = useState('');
    const [context, setContext] = useState('');
    const [courseName, setCourseName] = useState('');
    const [teacherId, setTeacherId] = useState('');

    const handleCreateCourse = async () => {

        try {
            const response = await fetch('http://127.0.0.1:8000/generate_layout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    context: context,
                    course_name: courseName,
                    teacher_id: teacherId
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.message === 'Course Generated Successfully') {
                    Alert.alert('Success', data.message);
                    router.push("/Created Courses")
                } else {
                    Alert.alert('Error', data.message);
                }
            } else {
                Alert.alert('Error', 'Something went wrong, please try again later.');
            }

        } catch (error) {
            Alert.alert('Error', 'Failed to connect to the server.');
            console.error('Error:', error);
        }
        setModalVisible(false); 
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => {
                router.push("/Created Courses")
            }}>
                <Icon name="book-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>All My Courses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}
            >
                <Icon name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Create New Course</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Course</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Course Name"
                            value={courseName}
                            onChangeText={setCourseName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Teacher ID"
                            value={teacherId}
                            onChangeText={setTeacherId}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Content"
                            value={content}
                            onChangeText={setContent}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Context"
                            value={context}
                            onChangeText={setContext}
                        />

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleCreateCourse}
                        >
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
        width: 200,
        margin: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    submitButton: {
        backgroundColor: '#6200EE',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
