import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/index";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "./auth/SignInScreen";
import HomeListScreen from "./home/home";
import HomeDetailsScreen from "./home/homeDetails";

const Stack = createStackNavigator();

const RootLayout = () => {
  return (
    <Provider store={store}>
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="SignInScreen">
          <Stack.Screen
            name="SignInScreen"
            component={SignInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeListScreen"
            component={HomeListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeDetailsScreen"
            component={HomeDetailsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default RootLayout;
