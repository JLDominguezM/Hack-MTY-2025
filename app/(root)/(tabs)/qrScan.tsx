import { CameraView } from "expo-camera";
import { router } from "expo-router";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { useQRStore } from "@/store/qrStore";

// Función para validar QR UUID en la BD
const validateQRInDatabase = async (qrCode: string) => {
  try {
    // Verificar si es una URL de Expo (ignorar)
    if (qrCode.startsWith("exp://") || qrCode.startsWith("http")) {
      console.log("QR detectado es una URL, no un UUID de usuario");
      return null;
    }

    // Verificar que sea un UUID válido (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(qrCode)) {
      console.log("QR no es un UUID válido:", qrCode);
      return null;
    }

    console.log("Validando UUID:", qrCode);

    // BD Mock con UUIDs reales para pruebas
    const mockDatabase = [
      {
        id: "1",
        qrId: "9873cf23-0aae-4ab5-9631-34186e6eb787",
        name: "Juan Pérez",
        email: "juan.perez@email.com",
      },
      {
        id: "2",
        qrId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        name: "María García",
        email: "maria.garcia@email.com",
      },
      {
        id: "3",
        qrId: "12345678-90ab-cdef-1234-567890abcdef",
        name: "Carlos López",
        email: "carlos.lopez@email.com",
      },
    ];

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Buscar por UUID exacto
    const user = mockDatabase.find((u) => u.qrId === qrCode);

    if (user) {
      console.log("Usuario encontrado:", user);
      return user;
    }

    console.log("Usuario no encontrado para UUID:", qrCode);
    return null;
  } catch (error) {
    console.error("Error validando QR:", error);
    return null;
  }
};

export default function qrScan() {
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const setQRData = useQRStore((state) => state.setQRData);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);

    try {
      console.log("QR escaneado:", data);

      // Validar QR en la base de datos
      const userData = await validateQRInDatabase(data);

      if (userData) {
        // Guardar datos en el store
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
                // Navegar de vuelta a send-tip de forma segura
                try {
                  router.dismiss(); // Cierra todos los modales
                  router.push("/(root)/(tabs)/send-tip");
                } catch (error) {
                  console.log("Error navegando:", error);
                  // Fallback: intentar con replace
                  router.replace("/(root)/(tabs)/send-tip");
                }
              },
            },
          ]
        );
      } else {
        // Determinar el tipo de QR escaneado para dar mejor feedback
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

  return (
    <SafeAreaView style={styleSheet.container}>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      {/* Header con botón de regreso */}
      <View className="absolute top-12 left-4 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-black/50 p-3 rounded-lg flex-row items-center"
        >
          <ArrowLeft size={20} color="white" />
          <Text className="text-white ml-2 font-semibold">Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Overlay con instrucciones */}
      <View className="absolute top-1/4 left-4 right-4 z-10">
        <View className="bg-black/70 p-4 rounded-lg">
          <Text className="text-white text-center text-lg font-semibold mb-2">
            {loading ? "Validando QR..." : "Escanear Código QR"}
          </Text>
          <Text className="text-white text-center">
            {loading
              ? "Verificando en la base de datos..."
              : "Apunta la cámara hacia el código QR del destinatario"}
          </Text>
        </View>
      </View>

      <CameraView
        style={styleSheet.camStyle}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleBarCodeScanned}
      />

      {/* Marco del escáner */}
      <View className="absolute inset-0 justify-center items-center">
        <View className="w-64 h-64 border-2 border-white border-dashed rounded-lg" />
      </View>
    </SafeAreaView>
  );
}

const styleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 20,
  },
  camStyle: {
    position: "absolute",
    width: 300,
    height: 300,
  },
});
