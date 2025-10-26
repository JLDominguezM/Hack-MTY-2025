import CustomHeader from "@/components/CustomHeader";
import { useRouter } from "expo-router";
import { View, Text, SafeAreaView, Pressable } from "react-native";

interface ServiceButton {
  id: string;
  name: string;
  icon: string;
  description: string;
  route: string;
  badge?: {
    text: string;
    type: "pending" | "urgent";
  };
}

const services: ServiceButton[] = [
  {
    id: "1",
    name: "Predial",
    icon: "🏠",
    description: "Pago de impuesto predial",
    route: "/(tabs)/(citizen-services)/predial",
  },
  {
    id: "2",
    name: "Multas y Licencias",
    icon: "🚔",
    description: "Consulta y paga tus multas",
    route: "/(tabs)/(citizen-services)/multas",
    badge: {
      text: "2 pendientes",
      type: "pending",
    },
  },
  {
    id: "3",
    name: "Impuestos Locales",
    icon: "📄",
    description: "ISR, IVA y más",
    route: "/(tabs)/(citizen-services)/impuestos",
    badge: {
      text: "1 urgente",
      type: "urgent",
    },
  },
  {
    id: "4",
    name: "Verificación Vehicular",
    icon: "🚗",
    description: "Programa tu cita",
    route: "/(tabs)/(citizen-services)/verificacion",
  },
];

const CitizenServices = () => {
  const router = useRouter();

  const handleServicePress = (route: string) => {
    router.push(route as any); // Configura las rutas según tu estructura
  };

  return (
    <View className="flex-1 bg-gray-50">
      <CustomHeader title="Servicios Ciudadanos" showBackButton={true} />

      <View className="flex-1 px-6 py-8">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          ¿Qué servicio necesitas?
        </Text>
        <Text className="text-gray-600 mb-8">
          Selecciona el servicio que deseas consultar
        </Text>

        <View className="gap-4">
          {services.map((service) => (
            <Pressable
              key={service.id}
              onPress={() => handleServicePress(service.route)}
              className={`bg-white rounded-2xl p-6 border-2 border-gray-200 active:border-red-500 ${
                service.badge?.type === "pending"
                  ? "bg-red-50 border-red-200"
                  : ""
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`rounded-xl p-4 mr-4 ${
                    service.badge?.type === "pending"
                      ? "bg-red-100"
                      : "bg-gray-100"
                  }`}
                >
                  <Text className="text-4xl">{service.icon}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text
                      className={`text-lg font-semibold ${
                        service.badge?.type === "pending"
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {service.name}
                    </Text>
                    {service.badge && (
                      <Text
                        className={`text-xs font-semibold ${
                          service.badge.type === "pending"
                            ? "text-red-500"
                            : "text-orange-500"
                        }`}
                      >
                        {service.badge.text}
                      </Text>
                    )}
                  </View>
                  <Text className="text-gray-600">{service.description}</Text>
                </View>
                <Text className="text-gray-400 text-2xl ml-2">›</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

export default CitizenServices;
