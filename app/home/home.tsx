// HomeListScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchHomes, Home } from "../../constants/api";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export type RootStackParamList = {
  HomeDetailsScreen: { home: object } | undefined;
};

const HomeListScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(true);

  const houses = useSelector((state: any) => state?.houses?.data);

  useEffect(() => {
    //api call to fetch homes
    const loadHomes = async () => {
      const fetchedHomes = await fetchHomes();
      setLoading(false);
    };

    loadHomes();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading homes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <Text style={styles.container}>Homes</Text>
      <FlatList
        data={houses}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("HomeDetailsScreen", { home: item })
            }>
            <Image
              source={{
                uri: item?.image,
              }}
              style={styles.image}
            />
            <Text style={styles.address}>{item?.address}</Text>
            <Text style={styles.description}>{item?.description}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { alignSelf: "center" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  address: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export default HomeListScreen;
