import CustomHeader from "@/components/CustomHeader";
import { View, Text } from "react-native";

const Impuestos = () => {
  return (
    <View>
      <CustomHeader title="Impuestos" showBackButton={true} />
      <Text>Información sobre impuestos</Text>
    </View>
  );
};

export default Impuestos;
