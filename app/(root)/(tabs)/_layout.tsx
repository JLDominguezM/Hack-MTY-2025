import { Stack } from "expo-router";
import "react-native-reanimated";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="hormi" options={{ headerShown: false }} />
      <Stack.Screen name="payServices" options={{ headerShown: false }} />
      <Stack.Screen name="balance" options={{ headerShown: false }} />
      <Stack.Screen name="consumption" options={{ headerShown: false }} />
      <Stack.Screen name="send-tip" options={{ headerShown: false }} />
      <Stack.Screen name="recieve-tip" options={{ headerShown: false }} />
      <Stack.Screen name="citizen-services" options={{ headerShown: false }} />
      <Stack.Screen
        name="(citizen-services)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
