import CustomHeader from "@/components/CustomHeader";
import ConsumptionCharts from "@/components/ConsumptionCharts";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/fetch";
import { useBalanceStore } from "@/components/Balance";
import { useConsumptionStore } from "@/store/consumptionStore";

const Consumption = () => {
  const userId = useBalanceStore((state) => state.userId);
  const lastUpdate = useConsumptionStore((state) => state.lastUpdate);
  const [consumptionData, setConsumptionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConsumptionData = async () => {
    if (!userId) return;

    try {
      const data = await fetchAPI(
        `/(api)/consumption?user_id=${userId}&months=6`,
        {
          method: "GET",
        }
      );

      if (data.success) {
        setConsumptionData(data);
      }
    } catch (error) {
      console.error("❌ Error fetching consumption data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchConsumptionData();
      setIsLoading(false);
    };

    loadData();
  }, [userId, lastUpdate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConsumptionData();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Consumo" showBackButton={true} />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#EC0000"]}
            tintColor="#EC0000"
          />
        }
      >
        {isLoading ? (
          <View style={{ paddingVertical: 60, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#EC0000" />
            <Text style={{ color: "#6B7280", marginTop: 16 }}>
              Cargando datos de consumo...
            </Text>
          </View>
        ) : (
          <>
            {/* Huella Verde Score */}
            {consumptionData?.green_score && (
              <View
                style={{
                  margin: 16,
                  backgroundColor: "#ECFDF5",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 2,
                  borderColor: "#10B981",
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#065F46",
                    marginBottom: 12,
                  }}
                >
                  🌱 Tu Huella Verde
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginBottom: 16,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 32,
                        fontWeight: "bold",
                        color: "#059669",
                      }}
                    >
                      {consumptionData.green_score.total_points}
                    </Text>
                    <Text style={{ color: "#047857", fontSize: 12 }}>
                      Puntos
                    </Text>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 32 }}>
                      {consumptionData.green_score.level === "Platino"
                        ? "💎"
                        : consumptionData.green_score.level === "Oro"
                        ? "🥇"
                        : consumptionData.green_score.level === "Plata"
                        ? "🥈"
                        : "🥉"}
                    </Text>
                    <Text
                      style={{
                        color: "#047857",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {consumptionData.green_score.level}
                    </Text>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 32,
                        fontWeight: "bold",
                        color: "#059669",
                      }}
                    >
                      {consumptionData.green_score.trees_planted}
                    </Text>
                    <Text style={{ color: "#047857", fontSize: 12 }}>
                      Árboles
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: "#D1FAE5",
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#065F46",
                      fontSize: 13,
                    }}
                  >
                    🌍 Has ahorrado{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {consumptionData.green_score.co2_saved} kg de CO₂
                    </Text>{" "}
                    y{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {consumptionData.green_score.water_saved} litros de agua
                    </Text>
                  </Text>
                </View>
              </View>
            )}

            {/* Logros Recientes */}
            {consumptionData?.achievements &&
              consumptionData.achievements.length > 0 && (
                <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#374151",
                      marginBottom: 12,
                    }}
                  >
                    🏆 Logros Recientes
                  </Text>
                  <View style={{ gap: 8 }}>
                    {consumptionData.achievements
                      .slice(0, 3)
                      .map((achievement: any) => (
                        <View
                          key={achievement.id}
                          style={{
                            backgroundColor: "#FEF3C7",
                            borderRadius: 12,
                            padding: 12,
                            flexDirection: "row",
                            alignItems: "center",
                            borderLeftWidth: 4,
                            borderLeftColor: "#F59E0B",
                          }}
                        >
                          <Text style={{ fontSize: 32, marginRight: 12 }}>
                            {achievement.icon}
                          </Text>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontWeight: "bold",
                                color: "#78350F",
                                marginBottom: 2,
                              }}
                            >
                              {achievement.name}
                            </Text>
                            <Text style={{ fontSize: 12, color: "#92400E" }}>
                              +{achievement.points_earned} puntos verdes
                            </Text>
                          </View>
                        </View>
                      ))}
                  </View>
                </View>
              )}

            {/* Título de las métricas */}
            <View style={{ paddingHorizontal: 16, marginVertical: 16 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#374151",
                }}
              >
                📊 Métricas de Consumo
              </Text>
            </View>

            {/* Gráficas de consumo */}
            <ConsumptionCharts consumptionData={consumptionData} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Consumption;
