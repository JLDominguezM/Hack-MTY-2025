import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";
import { Text, View, Image } from "react-native";

const CitizenServices = () => {
  return (
    <View>
      <CustomHeader title="Servicios Ciudadanos" showBackButton={true} />
      <View>
        <Text>Servicios Ciudadanos</Text>
      </View>
      <View className="flex-1 items-center justify-between bottom-0 pt-72">
        <Image source={images.hormiMascot} className="w-72 h-72" />
      </View>
    </View>
  );
};

export default CitizenServices;
