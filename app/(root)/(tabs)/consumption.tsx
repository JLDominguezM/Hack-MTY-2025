import CustomHeader from "@/components/CustomHeader";
// import Map from "@/components/Map";
import ConsumptionCharts from "@/components/ConsumptionCharts";
import { Text, View, ScrollView } from "react-native";

const Consumption = () => {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Consumo" showBackButton={true} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Sección del Mapa */}
        <View style={{ alignItems: "center", paddingVertical: 16 }}>
          <Text
            style={{
              color: "#6B7280",
              fontSize: 18,
              textAlign: "center",
              marginVertical: 8,
              paddingHorizontal: 16,
            }}
          >
            Mapa de servicios públicos cercanos
          </Text>
          <View
            style={{
              height: 300,
              width: "90%",
              borderRadius: 12,
              overflow: "hidden",
              alignSelf: "center",
            }}
          >
            {/* <Map /> */}
          </View>
        </View>

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
        <ConsumptionCharts />
      </ScrollView>
    </View>
  );
};

export default Consumption;
