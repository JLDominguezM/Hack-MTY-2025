import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";
import QRCode from "react-native-qrcode-svg";
import { useUser } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";

const RecieveTip = () => {
  const { user } = useUser();
  const [qrId, setQrId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQRId = async () => {
    try {
      setLoading(true);
      const response = await fetchAPI(`/(api)/user?clerkId=${user?.id}`);

      if (response && response.user && response.user.qr_id) {
        setQrId(response.user.qr_id);
      } else {
        Alert.alert(
          "Error",
          "No se encontró el código QR del usuario. Por favor, cierra sesión y vuelve a iniciarla."
        );
      }
    } catch (error) {
      console.error("Error fetching QR ID:", error);
      Alert.alert(
        "Error",
        "No se pudo cargar el código QR: " + (error as Error).message
      );
    } finally {
      setLoading(false);
    }
  };

  const regenerateQRId = async () => {
    Alert.alert(
      "Renovar QR",
      "¿Estás seguro de que quieres generar un nuevo código QR? El anterior dejará de funcionar.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Renovar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await fetchAPI(`/(api)/user`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  clerkId: user?.id,
                  regenerateQR: true,
                }),
              });

              if (response && response.user && response.user.qr_id) {
                setQrId(response.user.qr_id);
                Alert.alert("Éxito", "Tu código QR ha sido renovado");
              }
            } catch (error) {
              console.error("Error regenerating QR ID:", error);
              Alert.alert("Error", "No se pudo renovar el código QR");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (user?.id) {
      fetchQRId();
    }
  }, [user?.id]);

  return (
    <View className="flex-1 bg-white">
      <CustomHeader title="Recibir Propina" showBackButton={true} />

      <ScrollView
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {/* Título principal */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-center text-gray-800 mb-2">
            Mi Código QR
          </Text>
          <Text className="text-base text-center text-gray-600 leading-6">
            Comparte este código QR para que otros puedan enviarte propinas de
            forma fácil y segura
          </Text>
        </View>

        {/* QR Code Container */}
        <View className="bg-white rounded-2xl shadow-lg p-8 mb-6 items-center">
          {loading ? (
            <ActivityIndicator size="large" color="#E2231A" />
          ) : qrId ? (
            <QRCode
              value={qrId}
              size={250}
              color="#000000"
              backgroundColor="#FFFFFF"
              logoSize={50}
              logoBackgroundColor="white"
            />
          ) : (
            <Text className="text-gray-600">No se pudo cargar el QR</Text>
          )}
        </View>

        {/* Botón para renovar QR */}
        {!loading && qrId && (
          <TouchableOpacity
            onPress={regenerateQRId}
            className="bg-BanorteRed rounded-xl py-3 px-6 mb-6"
          >
            <Text className="text-white font-semibold text-center">
              🔄 Renovar Código QR
            </Text>
          </TouchableOpacity>
        )}

        {/* Información adicional */}
        <View className="mt-8 bg-gray-50 rounded-xl p-6 w-full">
          <Text className="text-lg font-semibold text-gray-800 mb-3 text-center">
            ¿Cómo funciona?
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-start">
              <Text className="text-BanorteRed text-lg mr-3">1.</Text>
              <Text className="flex-1 text-gray-700 leading-6">
                Muestra tu código QR a la persona que quiere enviarte una
                propina
              </Text>
            </View>

            <View className="flex-row items-start">
              <Text className="text-BanorteRed text-lg mr-3">2.</Text>
              <Text className="flex-1 text-gray-700 leading-6">
                Ellos lo escanean desde su aplicación Banorte
              </Text>
            </View>

            <View className="flex-row items-start">
              <Text className="text-BanorteRed text-lg mr-3">3.</Text>
              <Text className="flex-1 text-gray-700 leading-6">
                Reciben la propina directamente en tu cuenta
              </Text>
            </View>
          </View>
        </View>

        {/* Nota de seguridad */}
        <View className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl w-full">
          <Text className="text-sm text-blue-800 font-medium mb-1">
            💡 Consejo de seguridad
          </Text>
          <Text className="text-sm text-blue-700 leading-5">
            Tu código QR es único y seguro. Si sospechas que ha sido
            comprometido, puedes generar uno nuevo usando el botón "Renovar".
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecieveTip;
