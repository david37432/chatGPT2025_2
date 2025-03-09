import { Stack } from "expo-router";

export default function RootLayout() {
  return   <Stack
    screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home" options={{ title: "Home" }} />
      <Stack.Screen name="capabilities" options={{ title: "capabilities" }} />
      <Stack.Screen name="empyConversation" options={{ title: "empyConversation" }} />
      <Stack.Screen name="examples" options={{ title: "examples" }} />
      <Stack.Screen name="index" options={{ title: "index" }} />
      <Stack.Screen name="limitations" options={{ title: "limitations" }} />
      <Stack.Screen name="welcome" options={{ title: "welcome" }} />
      <Stack.Screen name="dashboard" options={{ title: "dashboard", headerShown: false }} />
    </Stack>
  
}
