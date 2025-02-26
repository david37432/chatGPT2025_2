import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const ChatScreen = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require("../assets/images/Vector 1 (Stroke).png")} style={styles.icon} />
        </TouchableOpacity>

        <Image source={require("../assets/images/Vector.png")} style={styles.logo} />
      </View>

      {/* Espacio para mensajes */}
      <View style={styles.chatArea} />

      {/* Barra de entrada */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Image source={require("../assets/images/Frame 12.png")} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#1E1E1E",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  icon: {
    tintColor: "#FFFFFF",
    resizeMode: "contain",
  },
  logo: {
    width: 30, 
    height: 30, 
    tintColor: "#FFFFFF",
  },
  chatArea: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#1E1E1E",
  },
  input: {
    flex: 1,
    backgroundColor: "#2E2E2E",
    color: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain", // Para que mantenga su apariencia original
  },
});

export default ChatScreen;
