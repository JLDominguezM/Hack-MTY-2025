import { useEffect } from "react";
import { useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function CameraPermissions() {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    // Solicitar permisos automáticamente al montar el componente
    if (permission === null) {
      requestPermission();
    }

    // Navegar automáticamente cuando se otorguen los permisos
    if (permission?.granted) {
      router.replace("./qrScan");
    }
  }, [permission]);

  // Mostrar loading mientras se solicitan permisos
  if (permission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>📷</Text>
          </View>
          <Text style={styles.title}>Escáner QR</Text>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.description}>
            Solicitando permisos de cámara...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar mensaje si se denegaron los permisos
  if (permission.granted === false) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.content}>
          <View style={[styles.iconContainer, styles.errorIcon]}>
            <Text style={styles.iconText}>⚠️</Text>
          </View>
          <Text style={styles.title}>Permiso Denegado</Text>
          <Text style={styles.description}>
            Se necesita acceso a la cámara para escanear códigos QR.
          </Text>
          <Text style={styles.hint}>
            Por favor, habilita el permiso en la configuración de tu
            dispositivo.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar loading mientras se navega al scanner
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.description}>Abriendo escáner...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    borderWidth: 3,
    borderColor: "#334155",
  },
  errorIcon: {
    borderColor: "#ef4444",
    backgroundColor: "#1e293b",
  },
  iconText: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 16,
  },
  hint: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },
});
