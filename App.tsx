import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import "./global.css";
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from "react-native-toast-message";
import { toastConfig } from "./src/components/ToastConfig";

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}
