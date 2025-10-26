import CustomHeader from "@/components/CustomHeader";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const Predial = () => {
  const [accountNumber, setAccountNumber] = useState("");

  return (
    <View className="flex-1 bg-gray-50">
      <CustomHeader title="Pago de Predial" showBackButton={true} />

      <ScrollView className="flex-1">
        {/* Service Info Card */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
          <View className="flex-row items-start">
            <View className="bg-gray-100 p-3 rounded-full mr-3">
              <Ionicons name="location-outline" size={24} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                Impuesto Predial
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Ciudad de México
              </Text>
            </View>
          </View>

          <Text className="text-gray-600 mt-4 leading-5">
            Realiza el pago de tu impuesto predial de manera rápida y segura.
          </Text>
        </View>

        {/* Account Number Input */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
          <Text className="text-gray-700 font-medium mb-3">
            Número de Cuenta Predial
          </Text>

          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700"
            placeholder="Ej: 123-456-789-0"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="default"
          />

          <TouchableOpacity className="bg-red-600 rounded-lg py-4 mt-4">
            <Text className="text-white text-center font-semibold text-base">
              Consultar Adeudo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Benefits Section */}
        <View className="bg-white mx-4 mt-4 mb-6 p-4 rounded-lg shadow-sm">
          <View className="flex-row items-center mb-3">
            <Text className="text-xl mr-2">💡</Text>
            <Text className="text-gray-800 font-semibold text-base">
              Beneficios
            </Text>
          </View>

          <View className="space-y-2">
            <Text className="text-gray-600 leading-5">
              • Hasta 15% de descuento por pago anticipado
            </Text>
            <Text className="text-gray-600 leading-5">
              • Sin comisiones adicionales
            </Text>
            <Text className="text-gray-600 leading-5">
              • Comprobante de pago inmediato
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Predial;
