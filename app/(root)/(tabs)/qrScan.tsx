import { CameraView } from "expo-camera";
import { router } from "expo-router";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  Animated,
} from "react-native";
import { ScanLine, CheckCircle } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import { useQRStore } from "@/store/qrStore";
import CustomHeader from "@/components/CustomHeader";

// Función para validar QR UUID en la BD
const validateQRInDatabase = async (qrCode: string) => {
  try {
    if (qrCode.startsWith("exp://") || qrCode.startsWith("http")) {
      return null;
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(qrCode)) {
      return null;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const API_URL = `/(api)/user?clerkId=${qrCode}`;

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("User API Error:", response.status);
        return null;
      }

      const data = await response.json();

      if (data.success && data.user) {
        return data.user.id;
      }

      return null;
    } catch (error) {
      console.error("Network Error calling User API:", error);
      return null;
    }
  } catch (error) {
    console.error("Error validando QR:", error);
    return null;
  }
};

export default function QRScan() {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const setQRData = useQRStore((state) => state.setQRData);

  // Animaciones
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cornerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de la línea de escaneo
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación de pulso en las esquinas
    Animated.loop(
      Animated.sequence([
        Animated.timing(cornerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(cornerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);

    try {
      const userData = await validateQRInDatabase(data);

      if (userData) {
        setQRData(userData);

        Alert.alert(
          "✅ Destinatario Encontrado",
          `${userData.name}\n${userData.email}\n\nUUID: ${userData.qrId}`,
          [
            {
              text: "Cancelar",
              onPress: () => {
                setScanned(false);
                setLoading(false);
              },
              style: "cancel",
            },
            {
              text: "Confirmar",
              onPress: () => {
                try {
                  router.dismiss();
                  router.push("/(root)/(tabs)/send-tip");
                } catch (error) {
                  router.replace("/(root)/(tabs)/send-tip");
                }
              },
            },
          ]
        );
      } else {
        let errorMessage = "Este código QR no está registrado en el sistema.";

        if (data.startsWith("exp://") || data.startsWith("http")) {
          errorMessage =
            "Este es un QR de Expo/URL, no de un usuario.\n\nNecesitas escanear el QR personal de otro usuario.";
        } else if (
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            data
          )
        ) {
          errorMessage =
            "El QR escaneado no tiene formato válido de UUID.\n\nDebe ser algo como: 9873cf23-0aae-4ab5-9631-34186e6eb787";
        }

        Alert.alert("❌ QR No Válido", errorMessage, [
          {
            text: "Ver QR Completo",
            onPress: () => {
              Alert.alert("QR Escaneado", data);
              setScanned(false);
              setLoading(false);
            },
          },
          {
            text: "Reintentar",
            onPress: () => {
              setScanned(false);
              setLoading(false);
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error validando QR:", error);
      Alert.alert(
        "Error",
        "No se pudo validar el código QR. Intenta nuevamente.",
        [
          {
            text: "Reintentar",
            onPress: () => {
              setScanned(false);
              setLoading(false);
            },
          },
        ]
      );
    }
  };

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 120],
  });

  const cornerOpacity = cornerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <View style={styles.container}>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleBarCodeScanned}
      />

      {/* Overlay oscuro */}
      <View style={styles.overlay}>
        {/* Instrucciones superiores */}
        <View style={styles.topInstructions}>
          <View style={styles.instructionBadge}>
            <Text style={styles.instructionBadgeText}>
              {loading ? "🔄 Validando..." : "📸 Listo"}
            </Text>
          </View>
          <Text style={styles.instructionTitle}>
            {loading ? "Verificando QR" : "Apunta al código QR"}
          </Text>
          <Text style={styles.instructionSubtitle}>
            {loading
              ? "Consultando base de datos..."
              : "Asegúrate de tener buena iluminación"}
          </Text>
        </View>

        {/* Área de escaneo central */}
        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            {/* Esquinas animadas */}
            <Animated.View
              style={[
                styles.corner,
                styles.cornerTopLeft,
                { opacity: cornerOpacity },
              ]}
            />
            <Animated.View
              style={[
                styles.corner,
                styles.cornerTopRight,
                { opacity: cornerOpacity },
              ]}
            />
            <Animated.View
              style={[
                styles.corner,
                styles.cornerBottomLeft,
                { opacity: cornerOpacity },
              ]}
            />
            <Animated.View
              style={[
                styles.corner,
                styles.cornerBottomRight,
                { opacity: cornerOpacity },
              ]}
            />

            {/* Línea de escaneo animada */}
            {!loading && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: scanLineTranslateY }],
                  },
                ]}
              />
            )}

            {/* Estado de carga */}
            {loading && (
              <Animated.View
                style={[
                  styles.loadingContainer,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <View style={styles.loadingCircle}>
                  <ScanLine size={40} color="#10b981" />
                </View>
              </Animated.View>
            )}
          </View>
        </View>

        {/* Footer con ayuda */}
        <View style={styles.footer}>
          <View style={styles.helpCard}>
            <View style={styles.helpIcon}>
              <CheckCircle size={20} color="#10b981" />
            </View>
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>Consejos</Text>
              <Text style={styles.helpText}>
                • Mantén el QR centrado en el marco{"\n"}• Evita movimientos
                bruscos{"\n"}• Verifica que el código esté bien iluminado
              </Text>
            </View>
          </View>

          {/* Indicador de estado */}
          <View style={styles.statusBar}>
            <View
              style={[styles.statusDot, loading && styles.statusDotActive]}
            />
            <Text style={styles.statusText}>
              {loading ? "Procesando código QR..." : "Esperando código QR"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  topInstructions: {
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  instructionBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.5)",
    marginBottom: 16,
  },
  instructionBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  instructionSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  scanArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: "relative",
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#10b981",
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: "#10b981",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderRadius: 2,
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -40,
    marginTop: -40,
  },
  loadingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#10b981",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  helpCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  helpIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 6,
  },
  helpText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6b7280",
    marginRight: 8,
  },
  statusDotActive: {
    backgroundColor: "#10b981",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});
