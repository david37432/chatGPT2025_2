import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, Text as RNText, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";
import { APIResponse } from '@/interfaces/Responses';
import { Message } from '@/interfaces/AppInterfaces';
import { Ionicons } from '@expo/vector-icons';

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
                }
            }
        };
        fetchMessages();
    }, [id]);

    const getResponse = async () => {
        if (!message.trim()) return;
        
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
        setMessage("");

        try {
            setIsLoading(true);
            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCFPEdbkbO_90iTylK8KrsOtQzKSVCxiNE", {
                method: "POST",
                body: JSON.stringify({ "contents": [{ "parts": [{ "text": newMessage.text }] }] })
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
            
            const docRef = doc(db, "conversations", id as string);
            await updateDoc(docRef, {
                messages: arrayUnion(newMessage, aiMessage),
                title: messages.length === 0 ? newMessage.text : messages[0].text
            });
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => router.navigate("/dashboard")}>
                    <Ionicons name="menu" size={30} color="white" />
                </TouchableOpacity>
                <Image source={require("../assets/images/Vector.png")} style={styles.logo} />
            </View>

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

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#888"
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={getResponse}>
                    <Ionicons name="send" size={24} color="#10A37F" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#343541', paddingTop: 40, paddingBottom: 25 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
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
        paddingBottom: 30,
        borderTopWidth: 1,
        borderTopColor: "#333",
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
    sendButton: { marginLeft: 10 },
});

export default EmpyConversation;
