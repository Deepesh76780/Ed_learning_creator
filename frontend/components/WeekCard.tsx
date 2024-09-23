


import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
type WeekCardProp = {
    week: string,
}

const WeekCard = ({ week }: WeekCardProp) => {
    const [isOpen, setIsOpen] = useState(false);
    

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSubtopicPress = (subtopic: string) => {
        // Handle subtopic press, e.g., navigate to a details page
        router.push(`/subtopic/${subtopic} - ${week}`)
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={toggleDropdown} style={styles.header}>
                <Text style={styles.weekText}>{week}</Text>
            </TouchableOpacity>
            {/* {isOpen && (
                <View style={styles.subtopicsContainer}>
                    {subtopics.map((subtopic, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleSubtopicPress(subtopic)}
                            style={styles.subtopicButton}
                        >
                            <Text style={styles.subtopicText}>{subtopic}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
    },
    header: {
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    weekText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtopicsContainer: {
        padding: 10,
    },
    subtopicButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 5,
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    subtopicText: {
        fontSize: 16,
        color: '#333',
    },
});

export default WeekCard;
