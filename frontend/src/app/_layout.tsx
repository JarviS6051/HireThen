// app/_layout.js
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="white" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "white",
            // Add conditional top margin for Android
            ...Platform.select({
              android: {
                marginTop: 35, // Adjust this value as needed
              },
            }),
          },
        }}
      />
    </>
  );
}
