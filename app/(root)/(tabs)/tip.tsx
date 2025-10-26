

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



function CustomHeader({ router }) {
  return (
    <View className="bg-[#EC0000] px-4 py-4 pt-12">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-lg transition-colors"
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold">Enviar Propina</Text>
        <View className="w-10"></View>
      </View>
    </View>
  );
}


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
      setShowAirdrop(true);

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

  // --- Animación de Éxito (Simplified Native) ---
  if (showAirdrop) {
    return (
      <LinearGradient
        colors={["#3B82F6", "#A855F7", "#EC4899"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 items-center justify-center p-6"
      >
        <View className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm items-center">
          <View className="mb-6">

            <View className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Text className="text-white text-4xl">✅</Text>
            </View>
          </View>

          <Text className="text-gray-900 text-2xl font-bold mb-1">
            ¡Propina Enviada!
          </Text>
          <Text className="text-gray-600 mb-2">Has enviado</Text>
          <Text className="text-[#EC0000] text-4xl font-bold mb-6">

            {tipValue.toFixed(2)} MN
          </Text>

          <View className="w-full rounded-2xl p-4 mb-4 flex-row justify-between items-center bg-gray-50">
            <Text className="text-sm text-gray-600">Saldo restante:</Text>
            <Text className="text-gray-900 font-medium text-lg">
              ${remainingBalance.toFixed(2)} MN
            </Text>
          </View>

        </View>
      </LinearGradient>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <CustomHeader router={router} />

      <ScrollView
        style={{ flex: 1 }}
        className="p-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-sm mx-auto">
          {/* Ícono de propina */}
          <View className="mb-8 items-center">
            <LinearGradient
              colors={["#FACC15", "#F97316"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg mb-4"
            >
              <Text className="text-5xl">💰</Text>
            </LinearGradient>
            <Text className="text-gray-900 text-lg font-semibold mb-1">
              ¿Cuánto quieres enviar?
            </Text>
            <Text className="text-sm text-gray-600">
              Ingresa el monto de la propina
            </Text>
          </View>

          {/* Input de monto */}
          <View className="mb-6">
            <Text className="block text-sm text-gray-700 mb-2">Monto</Text>
            <View className="relative">
              <TextInput
                keyboardType="numeric"
                value={tipAmount}
                onChangeText={setTipAmount}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                className="text-2xl text-center border-2 border-gray-300 rounded-xl"
                style={{
                  paddingVertical: 15,
                  paddingLeft: 40,
                  paddingRight: 60,
                }}
              />
              <Text
                className="absolute left-4 top-1/2 text-gray-500 text-2xl"
                style={{ transform: [{ translateY: -15 }] }}
              >
                $
              </Text>
              <Text
                className="absolute right-4 top-1/2 text-gray-500 text-lg"
                style={{ transform: [{ translateY: -12 }] }}
              >
                MN
              </Text>
            </View>
          </View>

          {/* Montos sugeridos */}
          <View className="mb-6">
            <Text className="text-sm text-gray-600 mb-2">
              Montos sugeridos:
            </Text>
            <View className="flex-row flex-wrap justify-between gap-2">
              {[0.5, 1.0, 2.0, 5.0].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => setTipAmount(amount.toFixed(2))}
                  className="bg-white border border-gray-300 rounded-lg py-2 flex-1 items-center active:bg-gray-100"
                >
                  <Text className="text-sm font-medium text-gray-700">
                    ${amount.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Saldo actual y restante */}
          <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm text-gray-600">Saldo actual:</Text>
              <Text className="text-gray-900 font-medium">
                ${currentBalance.toFixed(2)} MN
              </Text>
            </View>
            <View className="border-t border-gray-200 pt-3 flex-row justify-between items-center">
              <Text className="text-sm text-gray-600">Te quedaría:</Text>
              <Text
                className={`font-semibold ${
                  isInvalid ? "text-red-600" : "text-green-600"
                }`}
              >
                ${remainingBalance.toFixed(2)} MN
              </Text>
            </View>
          </View>

          {/* Advertencia si el monto es mayor */}
          {isInvalid && (
            <View className="bg-red-100 border border-red-300 rounded-lg p-3 mb-6">
              <Text className="text-sm text-red-700 text-center font-medium">
                ⚠️ No tienes saldo suficiente
              </Text>
            </View>
          )}

          {/* Botón de enviar */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={isDisabled}
            className={`w-full py-4 rounded-xl shadow-lg flex-row items-center justify-center ${
              isDisabled ? "bg-gray-400" : "bg-[#EC0000] active:bg-[#CC0000]"
            }`}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
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
