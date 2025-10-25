import React, { useState } from "react";
import {
  Wallet,
  TrendingUp,
  Receipt,
  ArrowLeftRight,
  ChevronDown,
  Leaf,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";

import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";

const benefits = [
  {
    company: "Starbucks",
    logo: "☕",
    benefit: "20% de descuento",
    points: 50,
    description: "En todas tus bebidas",
  },
  {
    company: "Cinépolis",
    logo: "🎬",
    benefit: "2x1 en boletos",
    points: 100,
    description: "Martes y miércoles",
  },
  {
    company: "Liverpool",
    logo: "🛍️",
    benefit: "15% descuento",
    points: 150,
    description: "En compras mayores a $1,000",
  },
  {
    company: "Uber",
    logo: "🚗",
    benefit: "$100 de descuento",
    points: 80,
    description: "En tu próximo viaje",
  },
  {
    company: "Spotify",
    logo: "🎵",
    benefit: "3 meses gratis",
    points: 200,
    description: "Suscripción Premium",
  },
  {
    company: "Netflix",
    logo: "📺",
    benefit: "1 mes gratis",
    points: 180,
    description: "Plan estándar",
  },
];

const API_URL = "/gemini";

async function askHormi(userMessage: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", response.status, errorData);
      return `Hormi tuvo un problema (${response.status}): ${
        errorData.error || "Error desconocido del servidor"
      }`;
    }
    const data = await response.json();
    return data.ai_response || "Hormi no respondió como esperaba.";
  } catch (error) {
    console.error("Network Error calling Hormi API:", error);
    return "No me pude conectar con Hormi. Revisa tu conexión a internet.";
  }
}

export default function HormiView() {
  const [showAdvice, setShowAdvice] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState("");
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const userPoints = 20;
  const userLevel = "Bronce";

  const handleHormiClick = async () => {
    if (isLoadingAdvice) return;

    setIsLoadingAdvice(true);
    setCurrentAdvice("");
    setShowAdvice(true);

    const newAdvice = await askHormi(
      "Dame un consejo corto de ahorro o finanzas sostenibles, diferente cada vez."
    );

    setCurrentAdvice(newAdvice);
    setIsLoadingAdvice(false);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 max-w self-center w-full">
        <CustomHeader title="Hormi" showBackButton={true} />
        <SubNavigation />

        {/* Contenido principal */}
        <View className="flex-1 items-center justify-between px-6 pt-8 pb-32">
          <PointsDisplay level={userLevel} points={userPoints} />
          <HormiMascot onClick={handleHormiClick} />
          <TouchableOpacity
            className="items-center gap-3"
            onPress={() => setShowBenefits(true)}
          >
            <ChevronDown size={48} color="#EB0029" />
            <Text className="text-BanorteGray text-base">Ver beneficios</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de consejos */}
        <Modal
          visible={showAdvice}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAdvice(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center px-5">
            <View className="bg-white p-6 rounded-2xl min-h-[200px] w-full max-w-sm">
              <View className="flex-row items-center mb-4">
                <Text className="text-2xl">🐜</Text>
                <Text className="text-lg font-bold text-BanorteRed ml-2">
                  Consejo de Hormi
                </Text>
              </View>

              <View className="min-h-[60px] justify-center items-center mb-4">
                {isLoadingAdvice ? (
                  <ActivityIndicator size="large" color="#EB0029" />
                ) : (
                  <Text className="text-BanorteGray leading-6 text-center">
                    {currentAdvice}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => setShowAdvice(false)}
                className={`bg-BanorteRed py-3 rounded-lg ${
                  isLoadingAdvice ? "opacity-70" : ""
                }`}
                disabled={isLoadingAdvice}
              >
                <Text className="text-white text-center font-medium">
                  {isLoadingAdvice ? "Pensando..." : "¡Gracias, Hormi!"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de beneficios */}
        <Modal
          visible={showBenefits}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowBenefits(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl max-h-[85%] pt-6">
              <View className="px-6 pb-4 border-b border-gray-200">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-2xl font-bold text-center flex-1">
                    Beneficios Empresas Verdes
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowBenefits(false)}
                    className="p-2"
                  >
                    <Text className="text-2xl text-BanorteGray">×</Text>
                  </TouchableOpacity>
                </View>
                <Text className="text-center text-BanorteGray">
                  Canjea tus puntos por increíbles beneficios
                </Text>
              </View>

              <FlatList
                data={benefits}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <BenefitCard benefit={item} userPoints={userPoints} />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                className="px-4 pt-4"
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

// --- SUB-COMPONENTES ---

function SubNavigation() {
  return (
    <View className="bg-gray-100 border-b border-gray-300 px-2 py-3"></View>
  );
}

function PointsDisplay({ level, points }: { level: string; points: number }) {
  return (
    <View className="w-full flex-row items-center justify-between px-2 mb-8">
      <View className="flex-row items-center gap-2">
        <Leaf size={32} color="#10b981" />
        <View>
          <Text className="text-sm text-gray-500">Nivel</Text>
          <Text className="text-lg font-semibold text-gray-900">{level}</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-5xl font-bold text-gray-900">{points}</Text>
        <Text className="text-lg font-semibold text-gray-700 ml-2">PUNTOS</Text>
      </View>
    </View>
  );
}

function HormiMascot({ onClick }: { onClick: () => void }) {
  return (
    <TouchableOpacity onPress={onClick} className="mb-8">
      <Image source={images.hormiMascot} className="w-72 h-72" />
    </TouchableOpacity>
  );
}

function BenefitCard({
  benefit,
  userPoints,
}: {
  benefit: (typeof benefits)[0];
  userPoints: number;
}) {
  const canRedeem = userPoints >= benefit.points;
  return (
    <View className="p-4 bg-white border border-gray-200 rounded-lg mb-3 mx-2">
      <View className="flex-row items-start gap-4">
        <Text className="text-4xl">{benefit.logo}</Text>
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-base">
                {benefit.company}
              </Text>
              <Text className="text-sm text-BanorteGray">
                {benefit.description}
              </Text>
            </View>
            <View className="bg-green-100 px-2 py-1 rounded-md">
              <Text className="text-green-700 text-xs font-medium">
                🌿 Verde
              </Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <View>
              <Text className="text-[#EC0000] font-semibold">
                {benefit.benefit}
              </Text>
              <Text className="text-sm text-gray-500">
                {benefit.points} puntos
              </Text>
            </View>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                canRedeem ? "bg-[#EC0000]" : "bg-gray-200"
              }`}
              disabled={!canRedeem}
            >
              <Text className={`${canRedeem ? "text-white" : "text-gray-500"}`}>
                Canjear
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
