import CustomHeader from "@/components/CustomHeader";
import { Text, View } from "react-native";

const Consumption = () => {
  return (
    <View>
      <CustomHeader title="Consumo" showBackButton={true} />
      <View>
        <Text className="text-BanorteGray text-3xl text-center mt-10">
          Aquí podrás ver y gestionar tu consumo.
        </Text>
      </View>
    </View>
  );
};

export default Consumption;
