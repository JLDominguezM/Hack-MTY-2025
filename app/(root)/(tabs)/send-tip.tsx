import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { QrCode } from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useBalanceStore } from "@/components/Balance";
import CustomHeader from "@/components/CustomHeader";
import { useQRStore } from "@/store/qrStore";

export default function TipView() {
  const router = useRouter();

  const currentBalance = useBalanceStore((state) => state.accountBalance);
  const decreaseBalance = useBalanceStore((state) => state.decreaseBalance);

  const qrData = useQRStore((state) => state.qrData);
  const clearQRData = useQRStore((state) => state.clearQRData);

  const [tipAmount, setTipAmount] = useState("");
  const [showAirdrop, setShowAirdrop] = useState(false);
  const [sending, setSending] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [recipientData, setRecipientData] = useState<any>(null);

  const tipValue = parseFloat(tipAmount) || 0;
  const remainingBalance = currentBalance - tipValue;
  const isInvalid = tipValue > currentBalance;
  const isDisabled = tipValue <= 0 || isInvalid || sending || !recipientData;

  const handleQRScan = (qrData: any) => {
    setRecipientData(qrData);
    setShowQRScanner(false);
    Alert.alert(
      "Destinatario Seleccionado",
      `Enviarás la propina a:\n${qrData.name}\n${qrData.email}`,
      [{ text: "OK" }]
    );
  };

  const handleSend = async () => {
    if (isDisabled) return;

    setSending(true);

    try {
      // TODO: Obtener el ID del usuario actual (del que envía)
      // Por ahora usamos un ID mock - debes reemplazarlo con el ID real del usuario logueado
      const currentUserId = "user_sender_id"; // Reemplazar con Clerk user ID o el ID real

      const response = await fetch(`http://localhost:8081/api/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromUserId: currentUserId,
          toUserId: recipientData.id,
          amount: tipValue,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Actualizar balance local solo si la transferencia fue exitosa
        decreaseBalance(tipValue);

        Alert.alert(
          "¡Propina Enviada! ✅",
          `Se han enviado $${tipValue.toFixed(2)} MN a ${recipientData.name}.\n\nTu nuevo balance: $${result.transfer.senderNewBalance.toFixed(2)} MN`
        );

        setRecipientData(null);
        setTipAmount("");
        clearQRData();
        router.back();
      } else {
        Alert.alert(
          "Error en la transferencia ❌",
          result.error || "No se pudo completar la transferencia"
        );
      }
    } catch (error) {
      console.error("Error sending tip:", error);
      Alert.alert(
        "Error de conexión ❌",
        "No se pudo conectar con el servidor. Verifica tu conexión."
      );
    } finally {
      setSending(false);
    }
  };

  // Efecto para manejar navegación al QR scanner
  useEffect(() => {
    if (showQRScanner) {
      router.push("/(root)/(tabs)/cameraPermissions");
      setShowQRScanner(false); // Reset para evitar navegación múltiple
    }
  }, [showQRScanner, router]);

  // Efecto para recibir datos del QR escaneado
  useEffect(() => {
    if (qrData && !recipientData) {
      setRecipientData(qrData);
      Alert.alert(
        "Destinatario Seleccionado ✅",
        `Enviarás la propina a:\n${qrData.name}\n${qrData.email}`,
        [{ text: "OK" }]
      );
    }
  }, [qrData, recipientData]);

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <CustomHeader title="Enviar Propina" showBackButton={true} />

      <ScrollView
        style={{ flex: 1 }}
        className="px-6"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-md mx-auto">
          <View className="mb-10 items-center">
            <View className="relative mb-6">
              <LinearGradient
                colors={["#FFD700", "#FFA500", "#FF6347"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Text className="text-6xl">💰</Text>
              </LinearGradient>
              {/* Decorative elements */}
              <View className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full opacity-80"></View>
              <View className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-400 rounded-full opacity-60"></View>
            </View>

            <Text className="text-BanorteGray text-2xl font-bold mb-2 text-center">
              ¿Cuánto quieres enviar?
            </Text>
            <Text className="text-BanorteGray text-base text-center px-4">
              Escanea el código QR del destinatario e ingresa el monto
            </Text>
          </View>

          {/* Sección de destinatario */}
          <View className="mb-8">
            <Text className="text-BanorteGray text-base font-semibold mb-3">
              Destinatario
            </Text>

            {!recipientData ? (
              <TouchableOpacity
                onPress={() => setShowQRScanner(true)}
                className="bg-white rounded-2xl border-2 border-dashed border-BanorteRed p-6 items-center shadow-lg"
              >
                <QrCode size={48} color="#EC0000" />
                <Text className="text-BanorteRed text-lg font-semibold mt-3 mb-1">
                  Escanear Código QR
                </Text>
                <Text className="text-gray-500 text-sm text-center">
                  Apunta la cámara al código QR del destinatario
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="bg-white rounded-2xl border-2 border-green-200 p-4 shadow-lg">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800 mb-1">
                      {recipientData.name}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-2">
                      {recipientData.email}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      ID: {recipientData.qrId.substring(0, 8)}...
                    </Text>
                  </View>
                  <View className="ml-4">
                    <TouchableOpacity
                      onPress={() => setShowQRScanner(true)}
                      className="bg-BanorteRed px-4 py-2 rounded-lg"
                    >
                      <Text className="text-white text-sm font-semibold">
                        Cambiar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Input de monto mejorado */}
          <View className="mb-8">
            <Text className="text-BanorteGray text-base font-semibold mb-3">
              Monto de la propina
            </Text>
            <View className="relative">
              <View className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <TextInput
                  keyboardType="numeric"
                  value={tipAmount} //cantidad a donar a la persona
                  onChangeText={setTipAmount}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  className="text-3xl text-center bg-white text-BanorteGray font-bold"
                  style={{
                    paddingVertical: 20,
                    paddingLeft: 50,
                    paddingRight: 70,
                  }}
                />
                {/* Dollar sign */}
                <View className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Text className="text-gray-500 text-3xl font-bold">$</Text>
                </View>
                {/* Currency */}
                <View className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Text className="text-gray-500 text-xl font-semibold">
                    MN
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Montos sugeridos mejorados */}
          <View className="mb-8">
            <Text className="text-BanorteGray text-base font-semibold mb-4">
              Montos sugeridos
            </Text>
            <View className="flex-row justify-between gap-3">
              {[0.5, 1.0, 2.0, 5.0].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => setTipAmount(amount.toFixed(2))}
                  className="flex-1 rounded-xl py-4 items-center shadow-md active:border-blue-400 active:bg-blue-50"
                >
                  <Text className="text-BanorteGray font-bold text-lg">
                    ${amount.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Información de saldo mejorada */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-BanorteGray text-base">Saldo actual:</Text>
              <Text className="text-BanorteGray font-bold text-xl">
                ${currentBalance.toFixed(2)} MN
              </Text>
            </View>
            <View className="h-px bg-gray-200 mb-4"></View>
            <View className="flex-row justify-between items-center">
              <Text className="text-BanorteGray text-base">Te quedaría:</Text>
              <Text
                className={`font-bold text-xl ${
                  isInvalid ? "text-BanorteRed" : "text-Sucess"
                }`}
              >
                ${remainingBalance.toFixed(2)} MN
              </Text>
            </View>
          </View>

          {/* Advertencia mejorada */}
          {isInvalid && (
            <View className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex-row items-center">
              <View className="mr-3">
                <Text className="text-red-500 text-2xl">⚠️</Text>
              </View>
              <View className="flex-1">
                <Text className="text-red-800 font-semibold text-base">
                  Saldo insuficiente
                </Text>
                <Text className="text-red-600 text-sm">
                  No tienes suficiente saldo para esta propina
                </Text>
              </View>
            </View>
          )}

          {/* Botón de enviar mejorado */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={isDisabled}
            className={`w-full py-5 rounded-2xl shadow-lg flex-row items-center justify-center ${
              isDisabled
                ? "bg-gray-400 opacity-70"
                : "bg-green-500 active:bg-green-600"
            }`}
            style={{
              shadowColor: isDisabled ? "#9CA3AF" : "#10B981",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDisabled ? 0.2 : 0.4,
              shadowRadius: 8,
              elevation: isDisabled ? 3 : 8,
            }}
          >
            {sending ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="white"
                  className="mr-2"
                />
                <Text className="text-white text-lg font-bold">
                  Enviando...
                </Text>
              </>
            ) : (
              <Text className="text-white text-lg font-bold">
                Enviar Propina
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
