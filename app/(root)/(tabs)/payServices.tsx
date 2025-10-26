import { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { useBalanceStore } from "../../../components/Balance";
import { useRouter } from "expo-router";
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";

interface PaymentServicesViewProps {
  onNavigate?: (view: string) => void;
}

function PaymentServicesView({ onNavigate }: PaymentServicesViewProps = {}) {
  const router = useRouter();
  const { user } = useUser();
  const accountBalance = useBalanceStore((state) => state.accountBalance);
  const fetchBalance = useBalanceStore((state) => state.fetchBalance);
  const userId = useBalanceStore((state) => state.userId);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const data = await fetchAPI(
          `/(api)/payment-services?user_id=${userId}`,
          {
            method: "GET",
          }
        );

        if (data.success && data.services) {
          // Transform database format to Service type
          const transformedServices: Service[] = data.services
            .filter(
              (s: any) => s.status === "pending" || s.status === "overdue"
            )
            .map((s: any) => ({
              id: s.id.toString(),
              name: s.name,
              provider: s.provider,
              amount: parseFloat(s.amount),
              dueDate: s.due_date,
              accountNumber: s.account_number,
              icon: s.icon,
              status: s.status,
            }));

          setServices(transformedServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        Alert.alert("Error", "No se pudieron cargar los servicios");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [userId]);

  const handleToggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedServices.length === services.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(services.map((s: Service) => s.id));
    }
  };

  const handlePayment = async () => {
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

    if (!userId) {
      Alert.alert("Error", "No se pudo identificar el usuario");
      return;
    }

    setIsPaying(true);

    try {
      // Llamar al API para procesar el pago
      const serviceIds = selectedServices.map((id) => parseInt(id));

      const data = await fetchAPI("/(api)/payment-services", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          service_ids: serviceIds,
          total_amount: selectedTotal,
        }),
      });

      if (data.success) {
        // Actualizar balance desde el servidor
        await fetchBalance(userId);

        // Eliminar servicios pagados de la lista
        setServices((prev) =>
          prev.filter((service) => !selectedServices.includes(service.id))
        );

        setSelectedServices([]);

        Alert.alert(
          "Pago Exitoso",
          `Se han pagado $${selectedTotal.toFixed(
            2
          )} MN.\nNuevo saldo: $${data.new_balance.toFixed(2)} MN`,
          [
            {
              text: "OK",
              onPress: () => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/home");
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      Alert.alert(
        "Error",
        "No se pudo procesar el pago. Por favor intenta de nuevo."
      );
    } finally {
      setIsPaying(false);
    }
  };

  const selectedTotal = services
    .filter((service: Service) => selectedServices.includes(service.id))
    .reduce((sum: number, service: Service) => sum + service.amount, 0);

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
                disabled={isLoading}
              >
                <Text className="text-[#EC0000] text-sm font-semibold">
                  {selectedServices.length === services.length
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

            {isLoading ? (
              <View className="py-20 items-center">
                <ActivityIndicator size="large" color="#EC0000" />
                <Text className="text-gray-500 mt-4">
                  Cargando servicios...
                </Text>
              </View>
            ) : services.length === 0 ? (
              <View className="py-20 items-center">
                <Text className="text-6xl mb-4">✅</Text>
                <Text className="text-xl font-bold text-gray-900 mb-2">
                  ¡Todo al día!
                </Text>
                <Text className="text-gray-500 text-center px-8">
                  No tienes servicios pendientes de pago
                </Text>
              </View>
            ) : (
              <View className="gap-4">
                {services.map((service: Service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isSelected={selectedServices.includes(service.id)}
                    onToggle={() => handleToggleService(service.id)}
                  />
                ))}
              </View>
            )}
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
