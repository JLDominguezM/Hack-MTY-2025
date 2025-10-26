import CustomHeader from "@/components/CustomHeader";
import { Text, View } from "react-native";

const Predial = () => {
  return (
    <View>
      <CustomHeader title="Predial" showBackButton={true} />
      <Text>Información sobre el servicio predial</Text>
    </View>
  );
};

export default Predial;
