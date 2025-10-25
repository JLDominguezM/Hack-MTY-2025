import CustomHeader from "@/components/CustomHeader";
import Map from "@/components/Map";
import { Text, View } from "react-native";

const Consumption = () => {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Consumo" showBackButton={true} />
      <View style={{ flex: 1 }}>
        <Text className="text-BanorteGray text-lg text-center mt-4 mb-4 px-4">
          Mapa de servicios públicos cercanos
        </Text>
        <Map />
      </View>
    </View>
  );
};

export default Consumption;
