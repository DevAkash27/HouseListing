// HomeDetailsScreen.tsx
import React, { useState, useEffect } from "react";
import { Text, Image, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Home } from "../../constants/api";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { schedulePushNotification } from "@/hooks/usePushNotifications";
import { Colors } from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { unlockHouse } from "../../redux/apiSlice";

type HomeDetailsScreenRouteProp = RouteProp<
  { HomeDetails: { home: Home } },
  "HomeDetails"
>;

interface HomeDetailsScreenProps {
  route: HomeDetailsScreenRouteProp;
}

const HomeDetailsScreen: React.FC<HomeDetailsScreenProps> = ({ route }) => {
  const { home } = route.params;
  const [isNearby, setIsNearby] = useState(false);
  const [unlocked, setUnLocked] = useState(home?.unlocked);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkProximity = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});

      //how to actually get the distance from  live location

      // const distance = calculateDistance(
      //   userLocation.coords.latitude,
      //   userLocation.coords.longitude,
      //   37.7749,  // Replace with the latitude of the home
      //   -122.4194 // Replace with the longitude of the home
      // );

      //for dummy data
      const distance = 29;

      if (distance <= 30) {
        setIsNearby(true);
      }
    };

    checkProximity();
  }, []);

  //dummy api call to unlock home
  const unlockHome = async (id: string) => {
    if (unlocked == false) {
      setUnLocked(true);

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              house: home.address,
              body: "bar",
              userId: 1,
            }),
          }
        );

        const json = await response.json();

        if (response.ok) {
          Alert.alert("Success", `House Unlocked Id: ${json.id}`);
          //reducer action to unlock home
          dispatch(unlockHouse(id));

          //method for notification
          schedulePushNotification();
        } else {
          Alert.alert("Error", `Failed to unlock: ${json.message}`);
        }
      } catch (error) {
        Alert.alert("Error", `Failed to unlock: ${error}`);
      }
    } else {
      Alert.alert("House is already unlocked");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ zIndex: 999 }}
        onPress={() => unlockHome(home?.id)}>
        <Image
          source={
            unlocked == false
              ? require("../../assets/images/lock.png")
              : require("../../assets/images/unlock.png")
          }
          style={styles.lockStyle}
        />
      </TouchableOpacity>

      <Image source={{ uri: home.image }} style={styles.image} />
      <Text style={styles.address}>{home.address ?? ""}</Text>
      <Text style={styles.description}>{home.detailedDescription ?? ""}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  address: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: Colors.dark.details,
    marginBottom: 20,
  },
  warning: {
    color: Colors.dark.red,
    marginTop: 20,
    fontWeight: "bold",
  },
  lockStyle: {
    height: 30,
    width: 30,
    alignSelf: "flex-end",
  },
});

export default HomeDetailsScreen;
