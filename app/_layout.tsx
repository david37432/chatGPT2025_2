import { Stack } from "expo-router";

export default function RootLayout() {
  return   <Stack
    screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home" options={{ title: "Home" }} />
      <Stack.Screen name="dashboard" options={{ title: "dashboard", headerShown: false }} />
    </Stack>
  
}
