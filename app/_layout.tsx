import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
    initialRouteName="welcome"
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="splashscreen" options={{ title: "Splash", headerShown: false }} />
      <Stack.Screen name="welcome" options={{ title: "Welcome" }} />
    </Stack>
  );
}
