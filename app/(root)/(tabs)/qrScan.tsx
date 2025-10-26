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

// Función para validar QR en la BD (mock)
const validateQRInDatabase = async (qrCode: string) => {
  // Simular llamada a BD
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // BD Mock - aquí iría tu llamada real a la BD
  const mockDatabase = [
    {
      id: "1",
      qrId: "usr_12345",
      name: "Juan Pérez",
      email: "juan.perez@email.com",
    },
    {
      id: "2",
      qrId: "usr_67890",
      name: "María García",
      email: "maria.garcia@email.com",
    },
    {
      id: "3",
      qrId: "demo_qr",
      name: "Usuario Demo",
      email: "demo@email.com",
    },
  ];

  // Buscar por QR exacto o por contener el código
  const user = mockDatabase.find(
    (u) => u.qrId === qrCode || qrCode.includes(u.qrId)
  );

  if (user) {
    return user;
  }

  // Si no se encuentra, crear usuario mock con el QR escaneado
  return {
    id: "temp_" + Date.now(),
    qrId: qrCode.substring(0, 16),
    name: "Usuario QR",
    email: "usuario@email.com",
  };
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
          "QR Válido ✅",
          `Destinatario encontrado:\n${userData.name}\n${userData.email}`,
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
                // Regresar a send-tip
                router.back();
                router.back(); // Para regresar también de cameraPermissions
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "QR No Válido ❌",
          "Este código QR no está registrado en el sistema.",
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
