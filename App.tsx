import { StyleSheet, ScrollView, View, Text, Button } from "react-native";
import React, { useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReclaimScreen } from "./ReclaimScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { ReclaimWebview } from "./ReclaimWebview";

const prefix = Linking.createURL("/");

const Stack = createNativeStackNavigator();

export default function App() {
  const linking = {
    prefixes: [prefix],
  };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator initialRouteName="ReclaimWebview">
        <Stack.Screen name="Reclaim" component={ReclaimScreen} />
        <Stack.Screen name="ReclaimWebview" component={ReclaimWebview} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  messages: { flex: 1, maxHeight: "70%" },

  divider: {
    height: 1,
    margin: 10,
    width: "100%",
    backgroundColor: "white",
  },
  replyOptions: {
    position: "absolute",
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
