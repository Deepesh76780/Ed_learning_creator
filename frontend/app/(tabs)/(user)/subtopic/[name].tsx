import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import WebView from 'react-native-webview'; // Make sure to install react-native-webview
import { Stack, useLocalSearchParams } from 'expo-router';

const Subtopic = () => {
    const { name } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerTitle: Array.isArray(name) ? name[0] : name || 'Course Details',
            }} />

            <Text style={styles.subtopicTitle}>Hello</Text>
            <View style={styles.videoContainer}>
                <WebView
                    style={styles.video}
                    source={{ uri: "https://www.youtube.com/embed/jzD_yyEcp0M" }}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                />
            </View>
            <Text style={styles.content}>
                To make the Subtopic component mobile-friendly, you'll need to adjust the styling and replace the  with a more suitable method for embedding YouTube videos in a React Native app. The WebView component from react-native-webview is typically used for embedding web content, including YouTube videos.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        padding: 20,
        backgroundColor: '#f8f8f8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        elevation: 5,
    },
    subtopicTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    videoContainer: {
        marginBottom: 15,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
    },
});

export default Subtopic;
