import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, Text as RNText } from "react-native";
import { useRouter } from "expo-router";
import { APIResponse } from '@/interfaces/Responses';
import { Message } from '@/interfaces/AppInterfaces';

const ChatScreen = () => {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getResponse = async () => {
        if (!message.trim()) return; // Evitar enviar mensajes vacíos

        const newMessage: Message = {
          idts: Date.now().toString(),  // Genera un ID único basado en el tiempo
          text: message,
          sender: "user",
          fecha: new Date().toISOString(), // Fecha en formato ISO
          emisor: "Usuario",  // Puedes cambiarlo si tienes un sistema de autenticación
          message: message,  // Si `message` es redundante con `text`, considera modificar la interfaz
      };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessage(""); // Limpiar el input después de enviar

        try {
            setIsLoading(true);
            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDo0NUkRMYfqvdJWrCn0Ty5LU8NAXHW4tw", {
                method: "POST",
                body: JSON.stringify({
                    "contents": [{
                        "parts": [{ "text": newMessage.text }]
                    }]
                })
            });

            const data: APIResponse = await response.json();
            const aiMessage: Message = {
              idts: Date.now().toString(), // Genera un ID único basado en el tiempo
              text: data?.candidates[0]?.content?.parts[0]?.text || "No response",
              sender: "bot",
              fecha: new Date().toISOString(), // Fecha en formato ISO
              emisor: "AI",  // Nombre del emisor
              message: data?.candidates[0]?.content?.parts[0]?.text || "No response", // Si es redundante, considera eliminarlo de la interfaz
          };
          
            setMessages(prevMessages => [...prevMessages, aiMessage]);
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Image source={require("../assets/images/Vector 1 (Stroke).png")} style={styles.icon} />
                </TouchableOpacity>
                <Image source={require("../assets/images/Vector.png")} style={styles.logo} />
            </View>

            {/* Área de chat */}
            <FlatList
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.sender === "user" ? styles.userBubble : styles.botBubble]}>
                        <RNText style={styles.messageText}>{item.text}</RNText>
                    </View>
                )}
                contentContainerStyle={{ padding: 10 }}
            />

            {isLoading && <RNText style={styles.loadingText}>Cargando...</RNText>}

            {/* Barra de entrada */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#888"
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={getResponse}>
                    <Image source={require("../assets/images/Frame 12.png")} style={styles.sendIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1E1E1E" },
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
    icon: { tintColor: "#FFFFFF", resizeMode: "contain" },
    logo: { width: 30, height: 30, tintColor: "#FFFFFF" },
    messageBubble: {
        maxWidth: "80%",
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    userBubble: { alignSelf: "flex-end", backgroundColor: "#4CAF50" },
    botBubble: { alignSelf: "flex-start", backgroundColor: "#333" },
    messageText: { color: "#FFF", fontSize: 16 },
    loadingText: { textAlign: "center", color: "#FFF", marginVertical: 10 },
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
    sendButton: { marginLeft: 10, padding: 10 },
    sendIcon: { width: 24, height: 24, resizeMode: "contain" },
});

export default ChatScreen;
