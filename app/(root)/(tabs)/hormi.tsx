import React, { useState } from "react";
import {
  Wallet,
  TrendingUp,
  Receipt,
  ArrowLeftRight,
  ChevronDown,
  Leaf,
  ArrowLeft,
  MoreVertical,
} from "lucide-react-native";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ActivityIndicator, Image, Text, View, ViewBase } from "react-native";

import CustomHeader from "@/components/CustomHeader";

const navigationItems = [
  { icon: Wallet, label: "Mis cuentas", active: false },
  { icon: TrendingUp, label: "Mis inversiones", active: false },
  { icon: Receipt, label: "Pago de servicios", active: false },
  { icon: ArrowLeftRight, label: "Transferir", active: false },
];

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
    <View className="min-h-screen bg-white max-w-[430px] mx-auto flex flex-col">
      <CustomHeader title="Hormi" showBackButton={true} />
      {/* <HormiHeader /> */}
      <SubNavigation />

      {/* Contenido principal */}
      <ViewBase className="flex-1 flex flex-col items-center justify-between px-6 pt-8 pb-32">
        <PointsDisplay level={userLevel} points={userPoints} />
        <HormiMascot onClick={handleHormiClick} />
        <BenefitsSheet userPoints={userPoints} />
      </ViewBase>

      <AdviceDialog
        advice={currentAdvice}
        isLoading={isLoadingAdvice}
        isOpen={showAdvice}
        onClose={() => setShowAdvice(false)}
      />
    </View>
  );
}

// --- SUB-COMPONENTES ---

function HormiHeader() {
  return (
    <View className="bg-[#EC0000] text-white sticky top-0 z-10 shadow-md">
      <View className="px-4 py-4">
        <View className="flex items-center justify-between">
          <Button className="active:bg-white/10 p-2 rounded-lg transition-colors -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Text className="text-white text-xl font-semibold">Hormi</Text>
          <Button className="active:bg-white/10 p-2 rounded-lg transition-colors -mr-2">
            <MoreVertical className="w-6 h-6" />
          </Button>
        </View>
      </View>
    </View>
  );
}

function SubNavigation() {
  return (
    <View className="bg-gray-100 border-b border-gray-300 px-2 py-3">
      <View className="flex items-center justify-around">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              className="flex flex-col items-center gap-1 px-3 py-1 text-gray-700 w-1/4"
            >
              <Icon className="w-6 h-6" />
              <Text className="text-xs text-center">{item.label}</Text>
            </Button>
          );
        })}
      </View>
    </View>
  );
}

function PointsDisplay({ level, points }: { level: string; points: number }) {
  return (
    <View className="w-full flex items-center justify-between px-2 mb-8">
      <View className="flex items-center gap-2">
        <Leaf className="w-8 h-8 text-green-500" />
        <View>
          <Text className="text-sm text-gray-600">Nivel</Text>
          <Text className="text-lg font-semibold text-gray-900">{level}</Text>
        </View>
      </View>
      <View className="text-right">
        <Text className="text-5xl font-bold text-gray-900">{points}</Text>
        <Text className="text-lg font-semibold text-gray-700 ml-2">PUNTOS</Text>
      </View>
    </View>
  );
}

function HormiMascot({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="mb-8 active:scale-95 transition-transform"
    >
      {/* Usando la ruta absoluta desde la carpeta 'public' */}
      <Image
        src="/Hormi.png"
        alt="Mascota Hormi"
        width={280}
        height={280}
        className="object-contain"
      />
    </Button>
  );
}

function BenefitsSheet({ userPoints }: { userPoints: number }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex flex-col items-center gap-3 active:scale-95 transition-transform">
          <ChevronDown className="w-12 h-12 text-[#EC0000] animate-bounce" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-3xl max-w-[430px] mx-auto bg-white" // Fondo blanco añadido
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl text-center">
            Beneficios Empresas Verdes
          </SheetTitle>
          <p className="text-center text-gray-600">
            Canjea tus puntos por increíbles beneficios
          </p>
        </SheetHeader>
        <View className="space-y-3 overflow-y-auto h-[calc(85vh-120px)] pb-6">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              benefit={benefit}
              userPoints={userPoints}
            />
          ))}
        </View>
      </SheetContent>
    </Sheet>
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
    <Card className="p-4">
      <View className="flex items-start gap-4">
        <View className="text-4xl">{benefit.logo}</View>
        <View className="flex-1">
          <View className="flex items-start justify-between mb-2">
            <View>
              <Text className="text-gray-900 font-semibold">
                {benefit.company}
              </Text>
              <Text className="text-sm text-gray-600">
                {benefit.description}
              </Text>
            </View>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              🌿 Verde
            </Badge>
          </View>
          <View className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <View>
              <Text className="text-[#EC0000] font-semibold">
                {benefit.benefit}
              </Text>
              <Text className="text-sm text-gray-500">
                {benefit.points} puntos
              </Text>
            </View>
            <Button
              className={`px-4 py-2 rounded-lg transition-colors ${
                canRedeem
                  ? "bg-[#EC0000] text-white active:bg-[#CC0000]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!canRedeem}
            >
              Canjear
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
}

function AdviceDialog({
  advice,
  isLoading,
  isOpen,
  onClose,
}: {
  advice: string;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[350px] rounded-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#EC0000]">
            <span className="text-2xl">🐜</span>
            Consejo de Hormi
          </DialogTitle>
        </DialogHeader>
        <View className="py-4 min-h-[60px] flex items-center justify-center">
          {/* Muestra ActivityIndicator si está cargando, si no, el consejo */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#EC0000" />
          ) : (
            <p className="text-gray-700 leading-relaxed">{advice}</p>
          )}
        </View>
        <button
          onClick={onClose}
          className="w-full bg-[#EC0000] text-white py-3 rounded-lg active:bg-[#CC0000] transition-colors mt-2"
          disabled={isLoading} // Deshabilita el botón mientras carga
        >
          {isLoading ? "Pensando..." : "¡Gracias, Hormi!"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
