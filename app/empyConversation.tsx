import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Text as RNText,
    KeyboardAvoidingView,
    Platform,
    Image
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDataContext } from "@/context/dataContext/DataContext";
import { Ionicons } from "@expo/vector-icons";

const EmptyConversation = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { messages, isLoading, fetchMessages, sendMessage } = useDataContext();
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (id) fetchMessages(id as string);
    }, [id]);

    const handleSend = async () => {
        if (!message.trim() || !id) return;
        await sendMessage(message, id as string);
        setMessage("");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.navigate("/dashboard")}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Image
                        source={require("../assets/images/Vector.png")}
                        style={styles.logo}
                    />
                    <View style={{ width: 24 }} />
                </View>

                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.messageBubble,
                                item.sender === "user" ? styles.userBubble : styles.botBubble,
                            ]}
                        >
                            <RNText style={styles.messageText}>{item.text}</RNText>
                        </View>
                    )}
                    contentContainerStyle={{ padding: 10 }}
                    ListEmptyComponent={
                        <RNText style={styles.loadingText}>
                            {isLoading ? "Cargando..." : "No hay mensajes aún."}
                        </RNText>
                    }
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe un mensaje..."
                        placeholderTextColor="#888"
                        value={message}
                        onChangeText={setMessage}
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity onPress={handleSend} disabled={isLoading} style={styles.sendButton}>
                        <Ionicons name="send" size={24} color={isLoading ? "#888" : "#4CAF50"} />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#343541", paddingTop: 40, paddingBottom: 25 },
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

export default EmptyConversation;