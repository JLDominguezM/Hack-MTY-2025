import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";

const RecieveTip = () => {
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
