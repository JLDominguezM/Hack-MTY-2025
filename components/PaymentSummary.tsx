import { ArrowRight } from "lucide-react-native";
import { View, Text, Pressable, Platform } from "react-native";

interface PaymentSummaryProps {
  selectedCount: number;
  totalAmount: number;
}

export function PaymentSummary({
  selectedCount,
  totalAmount,
}: PaymentSummaryProps) {
  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white shadow-2xl"
      style={{ paddingBottom: Platform.OS === "ios" ? 34 : 20 }}
    >
      <View className="border-t border-gray-200 px-6 py-6">
        {selectedCount > 0 && (
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm text-gray-600 font-medium">
              {selectedCount} {selectedCount === 1 ? "servicio" : "servicios"}{" "}
              seleccionado{selectedCount > 1 ? "s" : ""}
            </Text>
            <View className="flex-row items-baseline gap-2">
              <Text className="text-sm text-gray-600">Total:</Text>
              <Text className="text-xl font-bold text-gray-900">
                $
                {totalAmount.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        )}

        <Pressable
          disabled={selectedCount === 0}
          className={`w-full py-5 rounded-2xl items-center justify-center flex-row shadow-lg ${
            selectedCount === 0
              ? "bg-gray-300"
              : "bg-[#EC0000] active:bg-[#CC0000]"
          }`}
        >
          <Text
            className={`font-bold text-lg ${
              selectedCount === 0 ? "text-gray-500" : "text-white"
            }`}
          >
            {selectedCount === 0 ? "Selecciona un servicio" : "Pagar servicios"}
          </Text>
          {selectedCount > 0 && (
            <ArrowRight size={24} color="white" style={{ marginLeft: 8 }} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
