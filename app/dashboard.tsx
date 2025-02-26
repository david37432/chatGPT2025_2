import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const Dashboard = () => {
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <TouchableOpacity style={styles.header}>
        <Image source={require("../assets/images/mensaje.png")} style={styles.chatIcon} />
        <Text style={styles.headerText}>New Chat</Text>
        <Image source={require("../assets/images/ir2.png")} style={styles.arrowIcon} />
      </TouchableOpacity>

      {/* Opciones del menú */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
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
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 15,
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
