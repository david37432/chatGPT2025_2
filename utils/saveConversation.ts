import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "./FirebaseConfig"; // Asegúrate de que la ruta sea correcta

interface Conversation {
  title: string;
  messages: string[];
  create_at: Timestamp;
}

const saveConversation = async (messages: string[]): Promise<any> => {
  try {
    if (messages.length === 0) return null; // No crear conversaciones vacías

    const newConversation: Conversation = {
      title: messages[0], // Primer mensaje como título
      messages,
      create_at: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "conversations"), newConversation);
    return docRef;
  } catch (error) {
    console.error("Error saving conversation:", error);
  }
};


export { saveConversation };