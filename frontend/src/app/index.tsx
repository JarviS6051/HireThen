// src/App.js
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "../navigation";
import { AuthProvider } from "../context/AuthContext";
import { GlobalProvider } from "../context/GlobalContext";
import { COLORS } from "../utils/constants";

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" backgroundColor={COLORS.white} />
      <AuthProvider>
        <GlobalProvider>
          <Navigation />
        </GlobalProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
