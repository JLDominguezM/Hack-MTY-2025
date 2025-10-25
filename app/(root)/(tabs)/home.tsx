import { SignOutButton } from "@/components/SignOutButton";
import { Text, View } from "react-native";

const Home = () => {
  return (
    <View className="flex-1">
      <View className="absolute right-0 py-20 p-7">
        <SignOutButton />
      </View>

      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-3xl">Home Screen</Text>
      </View>
    </View>
  );
};

export default Home;
