import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        {/* Header rojo */}
        <View className="bg-[#EC0000] px-4 pt-3 pb-3">
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-start gap-2 flex-1">
              <View className="bg-white rounded-full p-1.5 mt-0.5">
                <Text className="text-[#EC0000] text-sm">👤</Text>
              </View>
              <View>
                <Text className="text-white text-base font-medium mb-0.5">
                  Hola Daniela
                </Text>
                <Text className="text-xs text-white/90 leading-tight">
                  Último ingreso{"\n"}24-10-2025 04:05 p.m. Móvil
                </Text>
              </View>
            </View>
            <TouchableOpacity className="relative mt-0.5">
              <Text className="text-white text-lg">🔔</Text>
              <View className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full border border-[#EC0000]" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Navegación */}
        <View className="bg-[#3a3a3a] px-2 py-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity className="flex-col items-center gap-1 px-2">
              <Text className="text-white text-lg">💰</Text>
              <Text className="text-[10px] text-white text-center leading-tight">
                Mis{"\n"}cuentas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-col items-center gap-1 px-2">
              <Text className="text-gray-400 text-lg">📈</Text>
              <Text className="text-[10px] text-gray-400 text-center leading-tight">
                Mis{"\n"}inversiones
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-col items-center gap-1 px-2"
              onPress={() => router.push(`/(root)/(tabs)/payments`)}
            >
              <Text className="text-gray-400 text-lg">🧾</Text>
              <Text className="text-[10px] text-gray-400 text-center leading-tight">
                Pago de{"\n"}servicios
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-col items-center gap-1 px-2">
              <Text className="text-gray-400 text-lg">↔️</Text>
              <Text className="text-[10px] text-gray-400 text-center leading-tight">
                Transferir
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-col items-center gap-1 px-2"
              onPress={() => router.push(`/(root)/(tabs)/hormi`)}
            >
              <View className="w-6 h-6 items-center justify-center">
                <View className="w-5 h-6">
                  <View className="w-3 h-3.5 bg-gray-400 rounded-full mx-auto" />
                  <View className="w-2.5 h-2 bg-gray-400 rounded-full mx-auto mt-0.5" />
                  <View className="w-4 h-4.5 bg-gray-400 rounded-full mx-auto mt-0.5" />
                </View>
              </View>
              <Text className="text-[10px] text-gray-400 text-center leading-tight">
                Hormi
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenido principal */}
        <View className="flex-1 px-3 py-3 pb-20">
          {/* Banner promocional */}
          <View className="bg-[#f15a29] rounded-lg p-3 h-[100px] mb-3">
            <View className="flex-row items-center justify-between h-full">
              <View className="flex-1">
                <Text className="text-white text-sm mb-1">Daniela</Text>
                <Text className="text-white text-xs leading-tight">
                  Conoce las promociones{"\n"}que tenemos para ti
                </Text>
              </View>
              <TouchableOpacity className="bg-white px-3 py-1.5 rounded">
                <Text className="text-[#f15a29] text-xs">Ver ofertas</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mis cuentas */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-900 text-base font-medium">
              Mis cuentas
            </Text>
            <TouchableOpacity className="p-1">
              <Text className="text-gray-600 text-lg">⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Cuenta Nómina */}
          <View className="bg-white p-3 rounded-lg shadow-sm mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-gray-200 rounded-lg items-center justify-center">
                  <Text className="text-gray-600 text-lg">💳</Text>
                </View>
                <View>
                  <Text className="text-gray-900 text-base mb-0.5">
                    Nómina Banorte 2
                  </Text>
                  <Text className="text-sm text-gray-600">****7355</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-gray-900">$ 8.02 MN</Text>
                <Text className="text-gray-400 text-lg">›</Text>
              </View>
            </View>
          </View>

          {/* Beneficios de mis tarjetas */}
          <View className="bg-[#f9c74f] p-3 rounded-lg mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-white/30 rounded-lg items-center justify-center">
                  <Text className="text-white text-lg">💳</Text>
                </View>
                <View>
                  <Text className="text-gray-900 text-base mb-0.5">
                    Beneficios de mis tarjetas
                  </Text>
                  <Text className="text-sm text-gray-700">
                    Promociones, puntos y más...
                  </Text>
                </View>
              </View>
              <Text className="text-gray-700 text-lg">›</Text>
            </View>
          </View>

          {/* Contrata aquí */}
          <View className="bg-[#f15a29] p-3 rounded-lg mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-white/30 rounded-lg items-center justify-center">
                  <Text className="text-white text-lg">📄</Text>
                </View>
                <View>
                  <Text className="text-white text-base mb-0.5">
                    Contrata aquí
                  </Text>
                  <Text className="text-sm text-white/90">
                    Tarjeta de Crédito, Pagarés y más
                  </Text>
                </View>
              </View>
              <Text className="text-white text-lg">›</Text>
            </View>
          </View>

          {/* Icono Hormi */}
          <View className="pt-1 items-center">
            <TouchableOpacity
              onPress={() => router.push(`/(root)/(tabs)/hormi`)}
            >
              <View className="w-12 h-12 bg-[#EC0000] rounded-full items-center justify-center shadow-lg">
                <View className="w-7 h-9">
                  <View className="w-5 h-6 bg-white rounded-full mx-auto" />
                  <View className="w-4 h-3 bg-white rounded-full mx-auto mt-1" />
                  <View className="w-6 h-7 bg-white rounded-full mx-auto mt-1" />
                </View>
              </View>
              <Text className="text-[10px] text-gray-600 mt-1.5 text-center">
                Hormi
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón Menú inferior */}
        <View className="bg-[#5a5e66] py-3">
          <TouchableOpacity>
            <Text className="text-white text-center">Menú</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
