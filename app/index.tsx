import { Button, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router, useRouter } from "expo-router";

export default function Index() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Ir a Dashboard" onPress={() => router.push("/dashboard")} />
      <Button title="Ir a Welcome" onPress={() => router.push("/welcome")} />
    </View>
  );
}
