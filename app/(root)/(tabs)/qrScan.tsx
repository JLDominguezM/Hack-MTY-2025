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

//function to get a user by it's qr_code
async function getUserByQrId(qrCode: string) {
  const API_URL = `/(api)/user?qr_id=${qrCode}`;

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", response.status, errorData);
      return null;
    }

    const data = await response.json();
    console.log("Usuario encontrado:", data);

    if (data.success && data.user) {
      return {
        id: data.user.id,
        qrId: data.user.qr_id,
        name: data.user.name,
        email: data.user.email,
      };
    }

    return null;
  } catch (error) {
    console.error("Network Error calling user API:", error);
    return null;
  }
}

//call to get the user balance with it's id
async function getBalanceByUser(user_id: string) {
  const API_URL = `/(api)/balance?user_id=${user_id}`;

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // GET no lleva body
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", response.status, errorData);
      return null;
    }

    const data = await response.json();

    if (data.success && data.user) {
      return {
        balance: data.user.balance,
        updated_at: data.user.updated_at,
      };
    }

    return null;
  } catch (error) {
    console.error("Network Error calling balance API:", error);
    return null;
  }
}

// Función para validar QR en la BD usando APIs reales
const validateQRInDatabase = async (qrCode: string) => {
  try {
    console.log("Validando QR:", qrCode);

    // Buscar usuario por QR ID en la base de datos
    const user = await getUserByQrId(qrCode);

    if (user) {
      console.log("Usuario encontrado:", user);

      // Opcional: También obtener su balance para mostrar info completa
      const balance = await getBalanceByUser(user.id);

      return {
        ...user,
        balance: balance?.balance || 0,
      };
    }

    console.log("Usuario no encontrado para QR:", qrCode);
    return null;
  } catch (error) {
    console.error("Error validando QR en BD:", error);
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
          "QR Válido",
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
          "QR No Válido",
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
