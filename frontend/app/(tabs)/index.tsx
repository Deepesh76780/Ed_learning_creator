import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { router } from 'expo-router';
import { useTeacherContext } from '@/context/TeacherId';
import { Switch } from 'react-native-paper';

// @ts-expect-error
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Icon

const Tab = createBottomTabNavigator();

function LoginScreen() {

    const [username, setName] = useState();
    const [password, setPassword] = useState();
    const [isSwitchOn, setIsSwitchOn] = React.useState(true);

    const { setTeacherData } = useTeacherContext()
    const onToggleSwitch = () => setIsSwitchOn(isSwitchOn);

    const userType = isSwitchOn ? "teacher" : "user";

    const url = `http://34.45.174.70:80/login?username=${username}&password=${password}&user_type=${userType}`;

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill out all fields');
            return;
        }

        console.log("yes")
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            console.log(data)
            if (response.ok) {
                setTeacherData({
                    teacherName: username
                })
                
                if (data.message === 'Login successful') {
                    Alert.alert('Success', data.message);
                    router.push("/(tabs)/(user)/")

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
    };

    const handleGuest = () => {
        router.push("/(tabs)/(user)/")
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <TextInput style={styles.input} placeholder="Name" onChangeText={(newText: any) => setName(newText)}
            />
            <TextInput style={styles.input} placeholder="Password" onChangeText={(newText: any) => setPassword(newText)} secureTextEntry />
            <View style={styles.box}>
                <Text>user</Text>
                <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color='#a81400' />
                <Text>teacher</Text>
                <br />
            </View>
            <Button title="Login" onPress={handleLogin} color={"#a81400"} />
            <br />
            <Button title="Guest" onPress={handleGuest} color={"#a81400"} />
        </View>
    );
}


function SignupScreen({ navigation }: { navigation: any }) {

    const [username, setName] = useState();
    const [password, setPassword] = useState();
    const [isSwitchOn, setIsSwitchOn] = React.useState(true);

    const onToggleSwitch = () => setIsSwitchOn(isSwitchOn);

    const userType = isSwitchOn ? "teacher" : "user";

    const url = `http://34.45.174.70:80/signup?username=${username}&password=${password}&user_type=${userType}`;


    const handleSignup = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill out all fields');
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            if (response.ok) {
                if (data.message === 'User created successfully') {
                    Alert.alert('Success', data.message);
                    navigation.navigate("Login");

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
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Signup</Text>
            <TextInput style={styles.input} placeholder="Name" onChangeText={(newText: any) => setName(newText)}
            />
            <TextInput style={styles.input} placeholder="Password" onChangeText={(newText: any) => setPassword(newText)} secureTextEntry />
            <View style={styles.box}>
                <Text>user</Text>
                <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color='#a81400' />
                <Text>teacher</Text>
                <br />
            </View>
            <Button title="Signup" onPress={handleSignup} color={"#a81400"} />
        </View>
    );
}

export default function Login() {
    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'Login') {
                            iconName = 'log-in-outline'; // Ionicons name for Login
                        } else if (route.name === 'Signup') {
                            iconName = 'person-add-outline'; // Ionicons name for Signup
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: "#a81400",
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Login" component={LoginScreen} />
                <Tab.Screen name="Signup" component={SignupScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    box:{
        display:"flex",
        flexDirection:"row",
        gap:10,
        padding:10
    }
});
