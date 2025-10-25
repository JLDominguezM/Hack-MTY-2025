import {
  Lightbulb,
  Flame,
  Droplet,
  Wifi,
  Phone,
  AlertCircle,
} from "lucide-react-native";
import { View, Text, Pressable } from "react-native";
import type { Service } from "@/types/type";

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: () => void;
}

const iconMap = {
  lightbulb: Lightbulb,
  flame: Flame,
  droplet: Droplet,
  wifi: Wifi,
  phone: Phone,
};

const iconColors = {
  lightbulb: "bg-yellow-50",
  flame: "bg-orange-50",
  droplet: "bg-blue-50",
  wifi: "bg-purple-50",
  phone: "bg-green-50",
};

const iconColorValues = {
  lightbulb: "#D97706",
  flame: "#EA580C",
  droplet: "#2563EB",
  wifi: "#7C3AED",
  phone: "#059669",
};

export function ServiceCard({
  service,
  isSelected,
  onToggle,
}: ServiceCardProps) {
  const Icon = iconMap[service.icon];
  const isOverdue = service.status === "overdue";
  const dueDate = new Date(service.dueDate);
  const today = new Date();
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Pressable
      onPress={onToggle}
      className={`p-5 bg-white rounded-2xl border-2 shadow-sm ${
        isSelected ? "border-[#EC0000] bg-red-50" : "border-gray-100"
      } ${isOverdue ? "border-red-300" : ""}`}
    >
      <View className="flex-row items-start gap-4">
        {/* Custom Checkbox */}
        <Pressable
          onPress={onToggle}
          className={`w-6 h-6 mt-1 rounded-lg border-2 items-center justify-center ${
            isSelected
              ? "bg-[#EC0000] border-[#EC0000]"
              : "border-gray-300 bg-white"
          }`}
        >
          {isSelected && (
            <Text className="text-white text-sm font-bold">✓</Text>
          )}
        </Pressable>

        <View className={`p-3 rounded-2xl ${iconColors[service.icon]}`}>
          <Icon size={24} color={iconColorValues[service.icon]} />
        </View>

        <View className="flex-1 min-w-0">
          <View className="flex-row items-start justify-between gap-2 mb-3">
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-lg">
                {service.name} - {service.provider}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                No. {service.accountNumber}
              </Text>
            </View>
            {isOverdue && (
              <View className="bg-red-100 px-3 py-1 rounded-full flex-row items-center gap-1">
                <AlertCircle size={14} color="#DC2626" />
                <Text className="text-red-600 text-xs font-semibold">
                  Vencido
                </Text>
              </View>
            )}
          </View>

          <View className="mt-3 gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-600 font-medium">
                Vencimiento:
              </Text>
              <Text
                className={`text-sm font-semibold ${
                  isOverdue
                    ? "text-red-600"
                    : daysUntilDue <= 3
                    ? "text-orange-600"
                    : "text-gray-900"
                }`}
              >
                {dueDate.toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
                {!isOverdue && daysUntilDue <= 5 && (
                  <Text className="ml-1 text-xs">({daysUntilDue}d)</Text>
                )}
              </Text>
            </View>
            <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
              <Text className="text-gray-900 font-semibold text-base">
                Monto:
              </Text>
              <Text className="text-[#EC0000] font-bold text-lg">
                $
                {service.amount.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
