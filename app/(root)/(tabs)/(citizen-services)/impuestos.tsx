import CustomHeader from "@/components/CustomHeader";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";

const Impuestos = () => {
  const [rfc, setRfc] = useState("");

  const handleConsultar = () => {
    // Aquí irá la lógica para consultar impuestos
  };

  return (
    <View className="flex-1 bg-gray-100">
      <CustomHeader title="Impuestos Locales" showBackButton={true} />

      <View className="p-4">
        {/* Info Section */}
        <View className="flex-row bg-white p-4 rounded-lg mb-6 items-center shadow-sm">
          <MaterialCommunityIcons
            name="office-building"
            size={32}
            color="#666"
          />
          <View className="ml-4 flex-1">
            <Text className="text-base font-semibold text-gray-800 mb-1">
              Impuestos Locales
            </Text>
            <Text className="text-sm text-gray-600">
              Pago de obligaciones fiscales
            </Text>
          </View>
        </View>

        {/* RFC Input */}
        <View className="mb-6">
          <Text className="text-sm text-gray-800 mb-2 font-medium">
            RFC (Registro Federal de Contribuyentes)
          </Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg p-4 text-base"
            placeholder="Ej: XAXX010101000"
            value={rfc}
            onChangeText={setRfc}
            autoCapitalize="characters"
            maxLength={13}
          />
        </View>

        {/* Consultar Button */}
        <TouchableOpacity
          className="bg-red-600 p-4 rounded-lg items-center"
          onPress={handleConsultar}
        >
          <Text className="text-white text-base font-semibold">
            Consultar Impuestos
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Impuestos;
