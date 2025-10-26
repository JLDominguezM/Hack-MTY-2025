import { useState } from "react";
import CustomHeader from "@/components/CustomHeader";
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";

const Multas = () => {
  const [numeroPlaca, setNumeroPlaca] = useState("");
  const [numeroLicencia, setNumeroLicencia] = useState("");

  const handleConsultarMultas = () => {
    if (!numeroPlaca.trim() && !numeroLicencia.trim()) {
      Alert.alert(
        "Campos vacíos",
        "Por favor ingresa al menos el número de placa o número de licencia"
      );
      return;
    }

    // Aquí puedes agregar la lógica para consultar las multas
    Alert.alert(
      "Consultando",
      `Buscando multas para:\n${numeroPlaca ? `Placa: ${numeroPlaca}` : ""}\n${
        numeroLicencia ? `Licencia: ${numeroLicencia}` : ""
      }`
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <CustomHeader title="Multas y Licencias" showBackButton={true} />

      <View className="flex-1 px-6 py-6">
        {/* Header Card */}
        <View className="bg-red-50 rounded-2xl p-4 mb-6 flex-row items-center border border-red-100">
          <View className="bg-red-100 rounded-full p-3 mr-4">
            <Text className="text-2xl">⚠️</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 mb-1">
              Multas de Tránsito
            </Text>
            <Text className="text-sm text-gray-600">
              Consulta y paga tus multas
            </Text>
          </View>
        </View>

        {/* Número de Placa Input */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-2xl mr-2">🚗</Text>
            <Text className="text-base font-semibold text-gray-900">
              Número de Placa
            </Text>
          </View>
          <TextInput
            className="bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900"
            placeholder="Ej: ABC-123-D"
            placeholderTextColor="#9CA3AF"
            value={numeroPlaca}
            onChangeText={setNumeroPlaca}
            autoCapitalize="characters"
          />
        </View>

        {/* Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500 font-medium">o</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Número de Licencia Input */}
        <View className="mb-8">
          <Text className="text-base font-semibold text-gray-900 mb-2">
            Número de Licencia
          </Text>
          <TextInput
            className="bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900"
            placeholder="Ej: 123456789"
            placeholderTextColor="#9CA3AF"
            value={numeroLicencia}
            onChangeText={setNumeroLicencia}
            keyboardType="numeric"
          />
        </View>

        {/* Consultar Button */}
        <Pressable
          onPress={handleConsultarMultas}
          className="bg-red-600 rounded-xl py-4 items-center active:bg-red-700"
        >
          <Text className="text-white text-lg font-bold">Consultar Multas</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Multas;
