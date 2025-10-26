import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(236, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#EC0000",
  },
};

interface ConsumptionChartsProps {
  consumptionData: any;
}

const ConsumptionCharts: React.FC<ConsumptionChartsProps> = ({
  consumptionData,
}) => {
  if (!consumptionData || !consumptionData.consumption) {
    return (
      <View style={{ padding: 16, alignItems: "center" }}>
        <Text style={{ color: "#6B7280" }}>
          No hay datos de consumo disponibles
        </Text>
      </View>
    );
  }

  const { by_service } = consumptionData.consumption;

  // Preparar datos para gráficas de tendencia
  const prepareLineChartData = (serviceData: any[], serviceName: string) => {
    if (!serviceData || serviceData.length === 0) return null;

    const sorted = [...serviceData].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    return {
      labels: sorted.map((d) => `${d.month}/${d.year.toString().slice(2)}`),
      datasets: [
        {
          data: sorted.map((d) => d.amount),
          color: (opacity = 1) => {
            const colors: any = {
              luz: `rgba(251, 191, 36, ${opacity})`,
              agua: `rgba(59, 130, 246, ${opacity})`,
              gas: `rgba(239, 68, 68, ${opacity})`,
            };
            return colors[serviceName] || `rgba(16, 185, 129, ${opacity})`;
          },
          strokeWidth: 3,
        },
      ],
    };
  };

  // Preparar datos para gráfica de pastel (distribución actual, solo pagos reales del mes actual)
  const preparePieChartData = () => {
    const colors: any = {
      luz: "#FCD34D",
      agua: "#3B82F6",
      gas: "#EF4444",
      telefono: "#8B5CF6",
    };

    const icons: any = {
      luz: "💡",
      agua: "💧",
      gas: "🔥",
      telefono: "📱",
    };

    // Usar solo los pagos reales del mes actual
    const currentMonthPayments =
      consumptionData.consumption.current_month_payments || [];

    // currentMonthPayments es un array de objetos: { service_type, total_paid }
    const pieData = currentMonthPayments
      .map((item: any) => {
        const serviceName = item.service_type;
        const totalPaid = parseFloat(item.total_paid);
        return {
          name: `${icons[serviceName] || "📊"} ${
            serviceName.charAt(0).toUpperCase() + serviceName.slice(1)
          }`,
          population: totalPaid,
          color: colors[serviceName] || "#6B7280",
          legendFontColor: "#374151",
          legendFontSize: 12,
        };
      })
      .filter((item: any) => item.population > 0); // Filtrar servicios sin pagos

    return pieData;
  };

  // Calcular tendencias
  const calculateTrends = () => {
    const trends: any = {};
    Object.keys(by_service).forEach((serviceName) => {
      const data = by_service[serviceName];
      if (data.length >= 2) {
        const latest = data[0];
        const previous = data[1];
        const change =
          ((latest.amount - previous.amount) / previous.amount) * 100;
        trends[serviceName] = {
          change: change.toFixed(2),
          isImproving: change < 0,
        };
      }
    });
    return trends;
  };

  const pieChartData = preparePieChartData();
  const trends = calculateTrends();

  // Generar una key única basada en los datos para forzar re-render
  const chartKey = pieChartData
    .map((d: any) => `${d.name}-${d.population}`)
    .join("-");

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16 }}>
        {/* Gráfica de Distribución de Gastos */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
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
              color: "#374151",
            }}
          >
            💰 Distribución de Gastos Actual
          </Text>
          <PieChart
            key={chartKey}
            data={pieChartData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
            hasLegend={true}
          />
          <View
            style={{
              backgroundColor: "#F3F4F6",
              padding: 12,
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#374151",
                fontWeight: "600",
              }}
            >
              Total mensual: $
              {pieChartData
                .reduce((sum: number, item: any) => sum + item.population, 0)
                .toFixed(2)}{" "}
              MXN
            </Text>
          </View>
        </View>

        {/* Tendencias por Servicio */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
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
              color: "#374151",
            }}
          >
            📈 Tendencias de Consumo
          </Text>
          {Object.keys(trends).map((serviceName) => {
            const trend = trends[serviceName];
            return (
              <View
                key={serviceName}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: trend.isImproving ? "#ECFDF5" : "#FEF2F2",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    color: "#374151",
                    textTransform: "capitalize",
                  }}
                >
                  {serviceName}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 18,
                      marginRight: 4,
                    }}
                  >
                    {trend.isImproving ? "📉" : "📈"}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: trend.isImproving ? "#059669" : "#DC2626",
                    }}
                  >
                    {trend.change > 0 ? "+" : ""}
                    {trend.change}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {["luz", "agua", "gas"].map((serviceName) => {
          if (!by_service[serviceName]) return null;
          const lineData = prepareLineChartData(
            by_service[serviceName],
            serviceName
          );
          if (!lineData) return null;

          const icons: any = {
            luz: "💡",
            agua: "💧",
            gas: "🔥",
          };

          return (
            <View
              key={serviceName}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 16,
                marginBottom: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
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
                  textTransform: "capitalize",
                }}
              >
                {icons[serviceName] || "📊"} Historial de {serviceName}
              </Text>
              <LineChart
                data={lineData}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={{
                  borderRadius: 16,
                }}
                withDots={true}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={false}
                withHorizontalLines={true}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default ConsumptionCharts;
