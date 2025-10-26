import { Stack } from "expo-router";
import "react-native-reanimated";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="hormi" options={{ headerShown: false }} />
      <Stack.Screen name="payServices" options={{ headerShown: false }} />
      <Stack.Screen name="consumption" options={{ headerShown: false }} />
      <Stack.Screen name="tip" options={{ headerShown: false }} />
    </Stack>
  );
}
