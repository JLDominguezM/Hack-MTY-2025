import CustomHeader from "@/components/CustomHeader";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";

const Verificacion = () => {
  const [placa, setPlaca] = useState("");

  const handleConsultar = () => {
    // Aquí irá la lógica para consultar el vehículo
  };

  return (
    <View className="flex-1 bg-gray-100">
      <CustomHeader title="Verificación Vehicular" showBackButton={true} />

      <View className="p-4">
        {/* Info Section */}
        <View className="flex-row bg-white p-4 rounded-lg mb-6 items-center shadow-sm">
          <MaterialCommunityIcons name="car" size={32} color="#666" />
          <View className="ml-4 flex-1">
            <Text className="text-base font-semibold text-gray-800 mb-1">
              Verificacion Vehicular
            </Text>
            <Text className="text-sm text-gray-600">
              Consulta y programa tu cita
            </Text>
          </View>
        </View>

        {/* Placa Input */}
        <View className="mb-6">
          <Text className="text-sm text-gray-800 mb-2 font-medium">
            Número de Placa
          </Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg p-4 text-base"
            placeholder="Ej: ABC-123-D"
            value={placa}
            onChangeText={setPlaca}
            autoCapitalize="characters"
          />
        </View>

        {/* Consultar Button */}
        <TouchableOpacity
          className="bg-red-600 p-4 rounded-lg items-center"
          onPress={handleConsultar}
        >
          <Text className="text-white text-base font-semibold">
            Consultar Vehiculo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Verificacion;
