import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";
import { saveConversation } from "../utils/saveConversation"; // Asegúrate de importar la función correctamente
import { useEffect, useState } from "react";

interface Conversation {
  id: string;
  title: string;
  messages: string[];
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "conversations"));
      const data: Conversation[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Conversation[];
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleNewChat = async () => {
    const newChatRef = await saveConversation([]); // Iniciar una nueva conversación sin mensajes predefinidos
    if (newChatRef) {
      fetchConversations(); // Actualiza el historial después de guardar la nueva conversación
      router.push({ pathname: `/empyConversation`, params: { id: newChatRef.id } });
    }
  };

  const handleClearConversations = async () => {
    Alert.alert(
      "Clear Conversations",
      "Are you sure you want to delete all conversations?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const querySnapshot = await getDocs(collection(db, "conversations"));
              const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
              await Promise.all(deletePromises);
              setConversations([]); // Limpiar el estado local
            } catch (error) {
              console.error("Error clearing conversations:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <TouchableOpacity style={styles.header} onPress={handleNewChat}>
        <Image source={require("../assets/images/mensaje.png")} style={styles.chatIcon} />
        <Text style={styles.headerText}>New Chat</Text>
        <Image source={require("../assets/images/ir2.png")} style={styles.arrowIcon} />
      </TouchableOpacity>

      {/* Historial de conversaciones */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.historyItem}
            onPress={() => router.push({ pathname: `/empyConversation`, params: { id: item.id } })}
          >
            <Text style={styles.historyText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Opciones del menú */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={handleClearConversations}>
          <Image source={require("../assets/images/basura.png")} style={styles.icon} />
          <Text style={styles.menuText}>Clear conversations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Image source={require("../assets/images/persona.png")} style={styles.icon} />
          <Text style={styles.menuText}>Upgrade to Plus</Text>
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Image source={require("../assets/images/Frame.png")} style={styles.icon} />
          <Text style={styles.menuText}>Light mode</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Image source={require("../assets/images/ir.png")} style={styles.icon} />
          <Text style={styles.menuText}>Updates & FAQ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logout]}>
          <Image source={require("../assets/images/LogOut.png")} style={[styles.icon, styles.logoutIcon]} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343541",
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  chatIcon: {
    width: 20,
    height: 20,
    tintColor: "#FFFFFF",
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  arrowIcon: {
    width: 15,
    height: 15,
    tintColor: "#FFFFFF",
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  historyText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: "#FFFFFF",
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    color: "#FFFFFF",
    fontSize: 16,
  },
  newBadge: {
    backgroundColor: "#FFD700",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  logout: {
    marginTop: 15,
  },
  logoutIcon: {
    tintColor: "#FF4D4D",
  },
  logoutText: {
    marginLeft: 15,
    color: "#FF4D4D",
    fontSize: 16,
  },
});

export default Dashboard;