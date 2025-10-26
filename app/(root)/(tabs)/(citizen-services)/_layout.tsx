import { Stack } from "expo-router";
import "react-native-reanimated";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="predial" options={{ headerShown: false }} />
      <Stack.Screen name="multas" options={{ headerShown: false }} />
      <Stack.Screen name="impuestos" options={{ headerShown: false }} />
      <Stack.Screen name="verificacion" options={{ headerShown: false }} />
    </Stack>
  );
}
