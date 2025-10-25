import { Tabs } from "expo-router";
import { View, Image, ImageSourcePropType } from "react-native";
import { icons } from "@/constants";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View
    className={`flex flex-row justify-center items-center rounded-full ${focused ? "bg-general-300" : ""}`}
  >
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${focused ? "bg-general-400" : ""}`}
    >
      <Image
        source={source}
        tintColor="white"
        resizeMode="contain"
        className="w-7 h-7"
      />
    </View>
  </View>
);

export default function AppLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#EC0000" }, 
        headerTintColor: "#fff", 
        headerTitleStyle: { fontWeight: "bold" },
        headerBackTitleVisible: false, 
        headerLeft: (props) =>
          
          props.canGoBack ? ( 
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
          ) : null,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Si tienes otras pantallas fuera de las tabs */}
      <Stack.Screen name="otraPantalla" options={{ title: "Otra Pantalla" }} />
    </Stack>
  );
}
