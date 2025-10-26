import CustomHeader from "@/components/CustomHeader";
import { Text, View } from "react-native";

const Multas = () => {
  return (
    <View>
      <CustomHeader title="Multas" showBackButton={true} />
      <Text>Información sobre multas y licencias</Text>
    </View>
  );
};

export default Multas;
