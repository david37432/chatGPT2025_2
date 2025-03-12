import { DataContextProvider } from "@/context/dataContext/DataContext";
import { AuthProvider } from "@/context/dataContext/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <DataContextProvider>
        <Stack 
          screenOptions={{ headerShown: false }} 
          initialRouteName="welcome"
        >
          <Stack.Screen name="Home" options={{ title: "Home" }} />
          <Stack.Screen name="capabilities" options={{ title: "Capabilities" }} />
          <Stack.Screen name="emptyConversation" options={{ title: "Empty Conversation" }} />
          <Stack.Screen name="examples" options={{ title: "Examples" }} />
          <Stack.Screen name="index" options={{ title: "Index" }} />
          <Stack.Screen name="limitations" options={{ title: "Limitations" }} />
          <Stack.Screen name="authentication" options={{ title: "Authentication" }} />
          <Stack.Screen name="welcome" options={{ title: "Welcome" }} />
          <Stack.Screen name="dashboard" options={{ title: "Dashboard", headerShown: false }} />
        </Stack>
      </DataContextProvider>
    </AuthProvider>
  );
}
