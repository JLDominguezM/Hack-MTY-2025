import { useState } from "react";
import { ServiceCard } from "@/components/ServiceCart";
import { PaymentSummary } from "@/components/PaymentSummary";
import CustomHeader from "@/components/CustomHeader";
import { Service } from "@/types/type";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useBalanceStore } from "../../../components/Balance";
import { useRouter } from "expo-router";

const mockServices: Service[] = [
  {
    id: "1",
    name: "Luz",
    provider: "CFE",
    amount: 1250.5,
    dueDate: "2025-10-28",
    accountNumber: "1234567890",
    icon: "lightbulb",
    status: "pending",
  },
  {
    id: "2",
    name: "Gas",
    provider: "Gas Natural",
    amount: 850.0,
    dueDate: "2025-10-30",
    accountNumber: "0987654321",
    icon: "flame",
    status: "pending",
  },
  {
    id: "3",
    name: "Agua",
    provider: "SACMEX",
    amount: 320.75,
    dueDate: "2025-11-05",
    accountNumber: "5556667777",
    icon: "droplet",
    status: "pending",
  },
  {
    id: "4",
    name: "Internet",
    provider: "Telmex",
    amount: 599.0,
    dueDate: "2025-11-01",
    accountNumber: "4445556666",
    icon: "wifi",
    status: "pending",
  },
  {
    id: "5",
    name: "Teléfono",
    provider: "Telcel",
    amount: 399.0,
    dueDate: "2025-10-26",
    accountNumber: "5551234567",
    icon: "phone",
    status: "overdue",
  },
];

interface PaymentServicesViewProps {
  onNavigate?: (view: string) => void;
}

function PaymentServicesView({ onNavigate }: PaymentServicesViewProps = {}) {
  const router = useRouter();
  const accountBalance = useBalanceStore((state) => state.accountBalance);
  const decreaseBalance = useBalanceStore((state) => state.decreaseBalance);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleToggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedServices.length === mockServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(mockServices.map((s) => s.id));
    }
  };

  const handlePayment = () => {
    if (selectedTotal <= 0) {
      Alert.alert(
        "Error",
        "Debes seleccionar al menos un servicio para pagar."
      );
      return;
    }

    if (selectedTotal > accountBalance) {
      Alert.alert(
        "Saldo Insuficiente",
        `No tienes suficiente saldo ($${accountBalance.toFixed(
          2
        )} MN) para cubrir el total de $${selectedTotal.toFixed(2)} MN.`
      );
      return;
    }

    console.log(`Simulating payment of $${selectedTotal.toFixed(2)} MN...`);

    decreaseBalance(selectedTotal);

    Alert.alert(
      "Pago Exitoso",
      `Se han pagado $${selectedTotal.toFixed(2)} MN.`
    );

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/home");
    }
  };

  const selectedTotal = mockServices
    .filter((service) => selectedServices.includes(service.id))
    .reduce((sum, service) => sum + service.amount, 0);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <CustomHeader title="Pago de Servicios" showBackButton={true} />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          <View className="px-6 py-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900">Servicios</Text>
              <Pressable
                onPress={handleSelectAll}
                className="px-4 py-2 rounded-lg bg-red-50"
              >
                <Text className="text-[#EC0000] text-sm font-semibold">
                  {selectedServices.length === mockServices.length
                    ? "Deseleccionar"
                    : "Seleccionar todos"}
                </Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => router.push("/(root)/(tabs)/recieve-tip")}
              className="w-full py-4 rounded-xl shadow-md active:scale-[0.98] transition-transform mb-4 flex flex-row items-center justify-center gap-2 bg-BanorteGray"
            >
              <Text className="text-2xl">💰</Text>
              <Text className="text-lg text-white font-semibold">
                Recibir Propina
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(root)/(tabs)/send-tip")}
              className="w-full py-4 rounded-xl shadow-md active:scale-[0.98] transition-transform mb-4 flex flex-row items-center justify-center gap-2 bg-BanorteRed"
            >
              <Text className="text-2xl">💰</Text>
              <Text className="text-lg text-white font-semibold">
                Enviar Propina
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(root)/(tabs)/citizen-services")}
              className="w-full py-4 rounded-xl shadow-md active:scale-[0.98] transition-transform mb-4 flex flex-row items-center justify-center gap-2 bg-Alert"
            >
              <Text className="text-2xl">🏛️</Text>
              <Text className="text-lg text-white font-semibold">
                Servicios Ciudadanos
              </Text>
            </Pressable>

            <View className="gap-4">
              {mockServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedServices.includes(service.id)}
                  onToggle={() => handleToggleService(service.id)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <PaymentSummary
          selectedCount={selectedServices.length}
          totalAmount={selectedTotal}
          onPayPress={handlePayment}
        />
      </View>
    </View>
  );
}

export default PaymentServicesView;
