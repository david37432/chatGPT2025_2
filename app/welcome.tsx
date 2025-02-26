import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

const SplashScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo más pequeño */}
      <Image source={require("../assets/images/Vector.png")} style={styles.logo} />

      {/* Título */}
      <Text style={styles.title}>ChatGPT</Text>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>Ask anything, get your answer</Text>

      {/* Imagen encima de "Examples" con su tamaño original */}
      <Image source={require("../assets/images/Frame.png")} style={styles.frame} resizeMode="contain" />

      {/* Sección de ejemplos */}
      <View style={styles.examplesContainer}>
        <Text style={styles.exampleTitle}>Examples</Text>

        <View style={styles.exampleBox}>
          <Text style={styles.exampleText}>
            "Explain quantum computing in simple terms"
          </Text>
        </View>

        <View style={styles.exampleBox}>
          <Text style={styles.exampleText}>
            "Got any creative ideas for a 10-year-old's birthday?"
          </Text>
        </View>

        <View style={styles.exampleBox}>
          <Text style={styles.exampleText}>
            "How do I make an HTTP request in JavaScript?"
          </Text>
        </View>
      </View>

      {/* Botón Next */}
      <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E", // Fondo gris oscuro
    padding: 20,
  },
  logo: {
    width: 80, // Reducido para que sea más pequeño
    height: 80,
    marginBottom: 20,
  },
  frame: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC", // Gris claro
    textAlign: "center",
    marginVertical: 20,
  },
  examplesContainer: {
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10A37F",
    marginBottom: 10,
  },
  exampleBox: {
    backgroundColor: "#2E2E2E", // Gris más claro para los recuadros
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: "90%",
  },
  exampleText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#10A37F",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SplashScreen;
