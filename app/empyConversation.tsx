import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, Text as RNText } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";
import { APIResponse } from '@/interfaces/Responses';
import { Message } from '@/interfaces/AppInterfaces';

interface MessageWithKey extends Message {
    key: string;
}

const EmpyConversation = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<MessageWithKey[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            if (id) {
                const docRef = doc(db, "conversations", id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setMessages(data.messages.map((msg: Message, index: number) => ({ ...msg, key: index.toString() })));
                } else {
                    console.log("No such document!");
                }
            }
        };

        fetchMessages();
    }, [id]);

    const getResponse = async () => {
        if (!message.trim()) return; // Evitar enviar mensajes vacíos

        const newMessage: MessageWithKey = {
            idts: Date.now().toString(),
            text: message,
            sender: "user",
            fecha: new Date().toISOString(),
            emisor: "Usuario",
            message: message,
            key: Date.now().toString(),
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessage(""); // Limpiar el input después de enviar

        try {
            setIsLoading(true);
            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDo0NUkRMYfqvdJWrCn0Ty5LU8NAXHW4tw", {
                method: "POST",
                body: JSON.stringify({
                    "contents": [{ "parts": [{ "text": newMessage.text }] }]
                })
            });

            const data: APIResponse = await response.json();
            const aiMessage: MessageWithKey = {
                idts: Date.now().toString(),
                text: data?.candidates[0]?.content?.parts[0]?.text || "No response",
                sender: "bot",
                fecha: new Date().toISOString(),
                emisor: "AI",
                message: data?.candidates[0]?.content?.parts[0]?.text || "No response",
                key: Date.now().toString(),
            };

            setMessages(prevMessages => [...prevMessages, aiMessage]);

            // Actualizar la conversación en Firebase
            const docRef = doc(db, "conversations", id as string);
            await updateDoc(docRef, {
                messages: arrayUnion(newMessage, aiMessage),
                title: messages.length === 0 ? newMessage.text : messages[0].text // Actualizar el título si es el primer mensaje
            });
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = async () => {
        if (messages.length > 0) {
            try {
                const docRef = doc(db, "conversations", id as string);
                await updateDoc(docRef, {
                    messages: messages.map(msg => ({
                        idts: msg.idts,
                        text: msg.text,
                        sender: msg.sender,
                        fecha: msg.fecha,
                        emisor: msg.emisor,
                        message: msg.message,
                    })),
                    title: messages[0].text // Actualizar el título con el primer mensaje
                });
            } catch (error) {
                console.log("Error updating conversation:", error);
            }
        } else {
            try {
                const docRef = doc(db, "conversations", id as string);
                await deleteDoc(docRef); // Eliminar la conversación si no hay mensajes
            } catch (error) {
                console.log("Error deleting conversation:", error);
            }
        }
        router.push("/dashboard"); // Navegar de vuelta al Dashboard
    };

    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Image source={require("../assets/images/Vector 1 (Stroke).png")} style={styles.icon} />
                </TouchableOpacity>
                <Image source={require("../assets/images/Vector.png")} style={styles.logo} />
            </View>

            {/* Área de chat */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.key}
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
    newConversationButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: "center",
        marginBottom: 10,
    },
    newConversationText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
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

export default EmpyConversation;