import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/utils/FirebaseConfig";
import { APIResponse } from "@/interfaces/Responses";
import { Message } from "@/interfaces/AppInterfaces";

interface MessageWithKey extends Message {
    key: string;
}

interface DataContextType {
    messages: MessageWithKey[];
    isLoading: boolean;
    fetchMessages: (id: string) => Promise<void>;
    sendMessage: (text: string, id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType>({
    messages: [],
    isLoading: false,
    fetchMessages: async () => {},
    sendMessage: async () => {},
});

export const DataContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<MessageWithKey[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMessages = async (id: string) => {
        if (!id) return;
        const docRef = doc(db, "conversations", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const formattedMessages = data.messages.map((msg: Message, index: number) => ({
                ...msg,
                key: index.toString()
            }));
            setMessages(formattedMessages);
        }
    };

    const sendMessage = async (text: string, id: string) => {
        if (!text.trim()) return;

        const newMessage: MessageWithKey = {
            idts: Date.now().toString(),
            text,
            sender: "user",
            fecha: new Date().toISOString(),
            emisor: "Usuario",
            message: text,
            key: Date.now().toString(),
        };

        setIsLoading(true);
        setMessages((prev) => [...prev, newMessage]);

        try {
            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCFPEdbkbO_90iTylK8KrsOtQzKSVCxiNE", {
                method: "POST",
                body: JSON.stringify({ contents: [{ parts: [{ text }] }] }),
            });

            const data: APIResponse = await response.json();
            const aiMessage: MessageWithKey = {
                idts: Date.now().toString(),
                text: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
                sender: "bot",
                fecha: new Date().toISOString(),
                emisor: "AI",
                message: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
                key: Date.now().toString(),
            };

            setMessages((prev) => [...prev, aiMessage]);

            const docRef = doc(db, "conversations", id);
            await updateDoc(docRef, {
                messages: arrayUnion(newMessage, aiMessage),
            });
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DataContext.Provider value={{ messages, isLoading, fetchMessages, sendMessage }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => useContext(DataContext);