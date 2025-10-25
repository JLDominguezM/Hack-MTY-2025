import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import "react-native-reanimated";
import "../global.css";
import { useEffect } from "react";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // Roboto Regular
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Italic": require("../assets/fonts/Roboto-Italic.ttf"),

    // Roboto Thin
    "Roboto-Thin": require("../assets/fonts/Roboto-Thin.ttf"),
    "Roboto-ThinItalic": require("../assets/fonts/Roboto-ThinItalic.ttf"),

    // Roboto ExtraLight
    "Roboto-ExtraLight": require("../assets/fonts/Roboto-ExtraLight.ttf"),
    "Roboto-ExtraLightItalic": require("../assets/fonts/Roboto-ExtraLightItalic.ttf"),

    // Roboto Light
    "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
    "Roboto-LightItalic": require("../assets/fonts/Roboto-LightItalic.ttf"),

    // Roboto Medium
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-MediumItalic": require("../assets/fonts/Roboto-MediumItalic.ttf"),

    // Roboto SemiBold
    "Roboto-SemiBold": require("../assets/fonts/Roboto-SemiBold.ttf"),
    "Roboto-SemiBoldItalic": require("../assets/fonts/Roboto-SemiBoldItalic.ttf"),

    // Roboto Bold
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-BoldItalic": require("../assets/fonts/Roboto-BoldItalic.ttf"),

    // Roboto ExtraBold
    "Roboto-ExtraBold": require("../assets/fonts/Roboto-ExtraBold.ttf"),
    "Roboto-ExtraBoldItalic": require("../assets/fonts/Roboto-ExtraBoldItalic.ttf"),

    // Roboto Black
    "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
    "Roboto-BlackItalic": require("../assets/fonts/Roboto-BlackItalic.ttf"),

    // Roboto Condensed Regular
    "Roboto-Condensed-Regular": require("../assets/fonts/Roboto_Condensed-Regular.ttf"),
    "Roboto-Condensed-Italic": require("../assets/fonts/Roboto_Condensed-Italic.ttf"),

    // Roboto Condensed Thin
    "Roboto-Condensed-Thin": require("../assets/fonts/Roboto_Condensed-Thin.ttf"),
    "Roboto-Condensed-ThinItalic": require("../assets/fonts/Roboto_Condensed-ThinItalic.ttf"),

    // Roboto Condensed ExtraLight
    "Roboto-Condensed-ExtraLight": require("../assets/fonts/Roboto_Condensed-ExtraLight.ttf"),
    "Roboto-Condensed-ExtraLightItalic": require("../assets/fonts/Roboto_Condensed-ExtraLightItalic.ttf"),

    // Roboto Condensed Light
    "Roboto-Condensed-Light": require("../assets/fonts/Roboto_Condensed-Light.ttf"),
    "Roboto-Condensed-LightItalic": require("../assets/fonts/Roboto_Condensed-LightItalic.ttf"),

    // Roboto Condensed Medium
    "Roboto-Condensed-Medium": require("../assets/fonts/Roboto_Condensed-Medium.ttf"),
    "Roboto-Condensed-MediumItalic": require("../assets/fonts/Roboto_Condensed-MediumItalic.ttf"),

    // Roboto Condensed SemiBold
    "Roboto-Condensed-SemiBold": require("../assets/fonts/Roboto_Condensed-SemiBold.ttf"),
    "Roboto-Condensed-SemiBoldItalic": require("../assets/fonts/Roboto_Condensed-SemiBoldItalic.ttf"),

    // Roboto Condensed Bold
    "Roboto-Condensed-Bold": require("../assets/fonts/Roboto_Condensed-Bold.ttf"),
    "Roboto-Condensed-BoldItalic": require("../assets/fonts/Roboto_Condensed-BoldItalic.ttf"),

    // Roboto Condensed ExtraBold
    "Roboto-Condensed-ExtraBold": require("../assets/fonts/Roboto_Condensed-ExtraBold.ttf"),
    "Roboto-Condensed-ExtraBoldItalic": require("../assets/fonts/Roboto_Condensed-ExtraBoldItalic.ttf"),

    // Roboto Condensed Black
    "Roboto-Condensed-Black": require("../assets/fonts/Roboto_Condensed-Black.ttf"),
    "Roboto-Condensed-BlackItalic": require("../assets/fonts/Roboto_Condensed-BlackItalic.ttf"),

    // Roboto SemiCondensed Regular
    "Roboto-SemiCondensed-Regular": require("../assets/fonts/Roboto_SemiCondensed-Regular.ttf"),
    "Roboto-SemiCondensed-Italic": require("../assets/fonts/Roboto_SemiCondensed-Italic.ttf"),

    // Roboto SemiCondensed Thin
    "Roboto-SemiCondensed-Thin": require("../assets/fonts/Roboto_SemiCondensed-Thin.ttf"),
    "Roboto-SemiCondensed-ThinItalic": require("../assets/fonts/Roboto_SemiCondensed-ThinItalic.ttf"),

    // Roboto SemiCondensed ExtraLight
    "Roboto-SemiCondensed-ExtraLight": require("../assets/fonts/Roboto_SemiCondensed-ExtraLight.ttf"),
    "Roboto-SemiCondensed-ExtraLightItalic": require("../assets/fonts/Roboto_SemiCondensed-ExtraLightItalic.ttf"),

    // Roboto SemiCondensed Light
    "Roboto-SemiCondensed-Light": require("../assets/fonts/Roboto_SemiCondensed-Light.ttf"),
    "Roboto-SemiCondensed-LightItalic": require("../assets/fonts/Roboto_SemiCondensed-LightItalic.ttf"),

    // Roboto SemiCondensed Medium
    "Roboto-SemiCondensed-Medium": require("../assets/fonts/Roboto_SemiCondensed-Medium.ttf"),
    "Roboto-SemiCondensed-MediumItalic": require("../assets/fonts/Roboto_SemiCondensed-MediumItalic.ttf"),

    // Roboto SemiCondensed SemiBold
    "Roboto-SemiCondensed-SemiBold": require("../assets/fonts/Roboto_SemiCondensed-SemiBold.ttf"),
    "Roboto-SemiCondensed-SemiBoldItalic": require("../assets/fonts/Roboto_SemiCondensed-SemiBoldItalic.ttf"),

    // Roboto SemiCondensed Bold
    "Roboto-SemiCondensed-Bold": require("../assets/fonts/Roboto_SemiCondensed-Bold.ttf"),
    "Roboto-SemiCondensed-BoldItalic": require("../assets/fonts/Roboto_SemiCondensed-BoldItalic.ttf"),

    // Roboto SemiCondensed ExtraBold
    "Roboto-SemiCondensed-ExtraBold": require("../assets/fonts/Roboto_SemiCondensed-ExtraBold.ttf"),
    "Roboto-SemiCondensed-ExtraBoldItalic": require("../assets/fonts/Roboto_SemiCondensed-ExtraBoldItalic.ttf"),

    // Roboto SemiCondensed Black
    "Roboto-SemiCondensed-Black": require("../assets/fonts/Roboto_SemiCondensed-Black.ttf"),
    "Roboto-SemiCondensed-BlackItalic": require("../assets/fonts/Roboto_SemiCondensed-BlackItalic.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file"
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
