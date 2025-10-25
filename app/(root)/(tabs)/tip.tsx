import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useBalanceStore } from "./balance";
import CustomHeader from "@/components/CustomHeader";

export default function TipView() {
  const router = useRouter();

  const currentBalance = useBalanceStore((state) => state.accountBalance);
  const decreaseBalance = useBalanceStore((state) => state.decreaseBalance);

  const [tipAmount, setTipAmount] = useState("");
  const [showAirdrop, setShowAirdrop] = useState(false);
  const [sending, setSending] = useState(false);

  const tipValue = parseFloat(tipAmount) || 0;
  const remainingBalance = currentBalance - tipValue;
  const isInvalid = tipValue > currentBalance;
  const isDisabled = tipValue <= 0 || isInvalid || sending;

  const handleSend = () => {
    if (isDisabled) return;

    setSending(true);

    setTimeout(() => {
      decreaseBalance(tipValue);
      setSending(false);

      setTimeout(() => {
        Alert.alert(
          "¡Propina Enviada!",
          `Se han descontado $${tipValue.toFixed(2)} MN de tu cuenta.`
        );
        setShowAirdrop(false);
        router.back();
      }, 2500);
    }, 1500);
  };

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
          {/* Header con ícono mejorado */}
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

            <Text className="text-gray-900 text-2xl font-bold mb-2 text-center">
              ¿Cuánto quieres enviar?
            </Text>
            <Text className="text-gray-600 text-base text-center px-4">
              Ingresa el monto de la propina que deseas dar
            </Text>
          </View>

          {/* Input de monto mejorado */}
          <View className="mb-8">
            <Text className="text-gray-800 text-base font-semibold mb-3">
              Monto de la propina
            </Text>
            <View className="relative">
              <View className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <TextInput
                  keyboardType="numeric"
                  value={tipAmount}
                  onChangeText={setTipAmount}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  className="text-3xl text-center bg-white text-gray-900 font-bold"
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
            <Text className="text-gray-800 text-base font-semibold mb-4">
              Montos sugeridos
            </Text>
            <View className="flex-row justify-between gap-3">
              {[0.5, 1.0, 2.0, 5.0].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => setTipAmount(amount.toFixed(2))}
                  className="flex-1 bg-white border-2 border-gray-200 rounded-xl py-4 items-center shadow-md active:border-blue-400 active:bg-blue-50"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text className="text-gray-800 font-bold text-lg">
                    ${amount.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Información de saldo mejorada */}
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-600 text-base">Saldo actual:</Text>
              <Text className="text-gray-900 font-bold text-xl">
                ${currentBalance.toFixed(2)} MN
              </Text>
            </View>
            <View className="h-px bg-gray-200 mb-4"></View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600 text-base">Te quedaría:</Text>
              <Text
                className={`font-bold text-xl ${
                  isInvalid ? "text-red-600" : "text-green-600"
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
                ? "bg-gray-300"
                : "bg-gradient-to-r from-red-500 to-red-600 active:from-red-600 active:to-red-700"
            }`}
            style={{
              shadowColor: isDisabled ? "#000" : "#EF4444",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDisabled ? 0.1 : 0.3,
              shadowRadius: 8,
              elevation: isDisabled ? 2 : 6,
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
