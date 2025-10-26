import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// Mock data para consumo positivo (ahorros/eficiencia)
const positiveConsumptionData = [
  {
    name: "Ahorro Energético",
    population: 35,
    color: "#22C55E",
    legendFontColor: "#374151",
    legendFontSize: 12,
  },
  {
    name: "Uso Eficiente Agua",
    population: 28,
    color: "#3B82F6",
    legendFontColor: "#374151",
    legendFontSize: 12,
  },
  {
    name: "Gas Optimizado",
    population: 22,
    color: "#10B981",
    legendFontColor: "#374151",
    legendFontSize: 12,
  },
  {
    name: "Energías Renovables",
    population: 15,
    color: "#06B6D4",
    legendFontColor: "#374151",
    legendFontSize: 12,
  },
];

// Mock data para consumo negativo (excesos/desperdicios)
const negativeConsumptionData = [
  {
    name: "Consumo Excesivo Luz",
    population: 40,
    color: "#EF4444",
    legendFontColor: "#374151",
    legendFontSize: 12,
  },
  {
    name: "Desperdicio Agua",
    population: 25,
    color: "#F59E0B",
    legendFontColor: "#374151",
    legendFontSize: 12,
  },
  {
    name: "Ineficiencia Gas",
    population: 20,
    color: "#DC2626",
    legendFontColor: "#374151",
    legendFontSize: 12,
  },
  {
    name: "Equipos Obsoletos",
    population: 15,
    color: "#B91C1C",
    legendFontColor: "#374151",
    legendFontSize: 12,
  },
];

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const ConsumptionCharts = () => {
  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16 }}>
        {/* Gráfica de Consumo Positivo */}
        <View
          style={{
            backgroundColor: "#F8F9FA",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 16,
              color: "#22C55E",
            }}
          >
            📈 Hábitos Positivos de Consumo
          </Text>
          <PieChart
            data={positiveConsumptionData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
          />
          <View
            style={{
              backgroundColor: "#DCFCE7",
              padding: 12,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#166534",
                fontWeight: "600",
              }}
            >
              Total de eficiencia: 85% del consumo ideal
            </Text>
          </View>
        </View>

        {/* Gráfica de Consumo Negativo */}
        <View
          style={{
            backgroundColor: "#FEF2F2",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 16,
              color: "#EF4444",
            }}
          >
            📉 Áreas de Mejora en Consumo
          </Text>
          <PieChart
            data={negativeConsumptionData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
          />
          <View
            style={{
              backgroundColor: "#FEE2E2",
              padding: 12,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#991B1B",
                fontWeight: "600",
              }}
            >
              Potencial de ahorro: $2,450 MXN/mes
            </Text>
          </View>
        </View>

        {/* Resumen de métricas */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 16,
              color: "#374151",
            }}
          >
            📊 Resumen de Consumo
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#6B7280" }}>Eficiencia Total:</Text>
            <Text style={{ fontWeight: "bold", color: "#22C55E" }}>85%</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#6B7280" }}>Gasto Mensual:</Text>
            <Text style={{ fontWeight: "bold", color: "#374151" }}>
              $4,200 MXN
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#6B7280" }}>Ahorro Potencial:</Text>
            <Text style={{ fontWeight: "bold", color: "#EF4444" }}>
              $2,450 MXN
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "#6B7280" }}>Meta de Ahorro:</Text>
            <Text style={{ fontWeight: "bold", color: "#3B82F6" }}>
              30% menos
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ConsumptionCharts;
