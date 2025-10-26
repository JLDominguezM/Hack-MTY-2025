import { useState } from "react";
import { ServiceCard } from "@/components/ServiceCart";
import { PaymentSummary } from "@/components/PaymentSummary";
import CustomHeader from "@/components/CustomHeader";
import { Service } from "@/types/type";
import { View, Text, Pressable, ScrollView, SafeAreaView } from "react-native";
import { useBalanceStore } from "./balance";
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
    if (selectedTotal <= 0) return;

    console.log(`Simulating payment of $${selectedTotal.toFixed(2)} MN...`);
    // --- (Aquí iría la lógica real de pago) ---

    // Actualiza el estado global usando la función del store
    decreaseBalance(selectedTotal); 

    // Opcional: Muestra mensaje de éxito
    alert('¡Pago realizado con éxito!'); 

    // Navega hacia atrás
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home'); // O '/' si tu home es index.tsx
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
