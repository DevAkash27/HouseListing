//LoginScreen.tsx

import { router } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { registerForPushNotificationsAsync } from "@/hooks/usePushNotifications";
import { Colors } from "@/constants/Colors";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export type RootStackParamList = {
  HomeListScreen: { item: object } | undefined;
};

const SignInScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const buttonScale = useSharedValue(1);

  //notifications

  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  //to enable the notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleLogin = () => {
    // Animate the button when clicked
    buttonScale.value = withTiming(0.8, { duration: 100 }, () => {
      buttonScale.value = withTiming(1, { duration: 100 });
    });
    if (validateEmail(username) && validatePassword(password)) {
      navigation.navigate("HomeListScreen");
    } else {
      Alert.alert(
        "Please check login details , Password must contain a capital letter , a small case letter , a special character and a number"
      );
    }
  };

  //animate method on login click
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  //method to validate email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  //method to validate password
  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return passwordRegex.test(password);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        placeholderTextColor={Colors.dark.placeholderText}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        placeholderTextColor={Colors.dark.placeholderText}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
        <TouchableOpacity style={styles.loginBar} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: "#333",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#007BFF",
  },
  loginBar: {
    backgroundColor: "blue",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  loginText: { color: "white", fontWeight: 700, fontSize: 18 },
});

export default SignInScreen;
