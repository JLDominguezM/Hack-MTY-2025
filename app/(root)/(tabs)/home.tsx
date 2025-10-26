import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useCameraPermissions, CameraView } from "expo-camera";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import { router } from "expo-router";
import { SignOutButton } from "@/components/SignOutButton";
const { Platform } = require("react-native");
import { useUser } from "@clerk/clerk-expo";
import { useLocationStore } from "@/store";
import { useBalanceStore } from "@/components/Balance";
import { fetchAPI } from "@/lib/fetch";

const { height } = Dimensions.get("window");
// Función para obtener user_id de la BD usando clerk_id
async function getUserIdFromClerkId(clerkId: string) {
  const API_URL = `/(api)/user?clerkId=${clerkId}`;

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("User API Error:", response.status);
      return null;
    }

    const data = await response.json();

    if (data.success && data.user) {
      return data.user.id; // Retorna el user_id de la BD
    }

    return null;
  } catch (error) {
    console.error("Network Error calling User API:", error);
    return null;
  }
}

// Función para obtener balance del usuario desde la API
async function getBalanceFromAPI(user_id: string) {
  const API_URL = `/(api)/balance?user_id=${user_id}`;

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // GET no lleva body
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Balance API Error:", response.status, errorData);
      return null;
    }

    const data = await response.json();

    if (data.success && data.user) {
      return {
        balance: parseFloat(data.user.balance),
        updated_at: data.user.updated_at,
      };
    }

    return null;
  } catch (error) {
    console.error("Network Error calling Balance API:", error);
    return null;
  }
}

const Home = () => {
  // Permisos de cámara
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [showScanner, setShowScanner] = useState(false);
  // Mostrar escáner automáticamente si hay permiso
  useEffect(() => {
    if (permission && permission.granted) {
      setShowScanner(true);
    }
  }, [permission]);
  // Handler para escaneo QR (puedes personalizarlo)
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShowScanner(false);
    // Aquí puedes navegar o guardar el QR
    alert(`QR escaneado: ${data}`);
  };
  const [now, setNow] = React.useState<Date>(new Date());

  // Usuario de Clerk
  const { user } = useUser();

  // Hook para cargar balance desde la API
  useEffect(() => {
    const loadUserBalance = async () => {
      if (!user?.id) return;

      try {
        // Primero obtener el user_id de la BD usando clerk_id
        const userId = await getUserIdFromClerkId(user.id);

        if (!userId) {
          console.warn(
            "Could not find user in database with clerk_id:",
            user.id
          );
          return;
        }

        // Ahora obtener el balance usando el user_id correcto
        const balanceData = await getBalanceFromAPI(userId);

        if (balanceData) {
          //setBalance(balanceData.balance);
        }
      } catch (error) {
        console.error("Error cargando balance:", error);
      }
    };

    loadUserBalance();
  }, [user?.id]);

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000); // actualiza cada minuto
    return () => clearInterval(t);
  }, []);

  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  let hh = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hh >= 12 ? "p.m." : "a.m.";
  hh = hh % 12;
  if (hh === 0) hh = 12;
  const hourStr = String(hh).padStart(2, "0");

  const formatted = `${dd}-${mm}-${yyyy} ${hourStr}:${minutes} ${ampm}`;
  const platformLabel =
    Platform.OS === "web" ? "Web" : Platform.OS === "ios" ? "Móvil" : "";

  const { setUserLocation, userLatitude, userLongitude } = useLocationStore();
  const [hasPermissions, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setHasPermission(false);
          return;
        }

        setHasPermission(true);
        let location = await Location.getCurrentPositionAsync({});

        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords?.latitude!,
          longitude: location.coords?.longitude!,
        });

        setUserLocation({
          latitude: location.coords?.latitude,
          longitude: location.coords?.longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, []);

  //use balance from DB
  const accountBalance = useBalanceStore((state) => state.accountBalance);
  const fetchBalance = useBalanceStore((state) => state.fetchBalance);
  const isLoadingBalance = useBalanceStore((state) => state.isLoading);

  // Fetch user data and balance
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) return;

      try {
        // Get user from database using fetchAPI
        const userData = await fetchAPI(
          `/(api)/user?email=${user.emailAddresses[0].emailAddress}`,
          {
            method: "GET",
          }
        );

        if (userData.success && userData.user) {
          await fetchBalance(userData.user.id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.fullName) {
      return user.fullName;
    }
    // Fallback to first part of email
    if (user?.emailAddresses?.[0]?.emailAddress) {
      const email = user.emailAddresses[0].emailAddress;
      return email.split("@")[0];
    }
    return "Usuario";
  };

  // Si no hay permiso, pedirlo al inicio
  if (!isPermissionGranted) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
          Permiso de cámara requerido
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: "#EC0000", padding: 16, borderRadius: 10 }}
          onPress={requestPermission}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Permitir acceso a la cámara
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ...resto del home
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header rojo */}
      <View className="bg-BanorteRed px-6 pt-20 pb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="bg-white rounded-full p-2">
              <Text className="text-BanorteRed text-lg">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-bold mb-1">
                Hola {getDisplayName()}!
              </Text>
              <Text className="text-xs text-white/90 leading-tight">
                Último ingreso{"\n"}
                {formatted} {platformLabel}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity className="relative">
              <Text className="text-white text-xl">🔔</Text>
              <View className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
      </View>

      {/* Navegación */}
      <View className="bg-BanorteGray px-3 py-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity className="flex-col items-center gap-2 flex-1">
            <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
              <Text className="text-BanorteGray text-sm">💰</Text>
            </View>
            <Text className="text-sm text-white text-center leading-tight">
              Mis{"\n"}cuentas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-col items-center gap-2 flex-1"
            onPress={() => router.push("/(root)/(tabs)/consumption")}
          >
            <View className="w-8 h-8 items-center justify-center bg-white rounded-full">
              <Text className="text-BanorteGray text-sm">📊</Text>
            </View>
            <Text className="text-sm text-white text-center leading-tight">
              Mi{"\n"}Consumo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-col items-center gap-2 flex-1"
            onPress={() => router.push("/(root)/(tabs)/payServices")}
          >
            <View className="w-8 h-8 items-center justify-center bg-white rounded-full">
              <Text className="text-BanorteGray text-sm">🧾</Text>
            </View>
            <Text className="text-sm text-white text-center leading-tight">
              Pago de{"\n"}servicios
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-col items-center gap-2 flex-1">
            <View className="w-8 h-8 items-center justify-center bg-white rounded-full">
              <Text className="text-BanorteGray text-sm">↔️</Text>
            </View>
            <Text className="text-sm text-white text-center leading-tight">
              Transferir
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-col items-center gap-2 flex-1"
            onPress={() => router.push("/(root)/(tabs)/hormi")}
          >
            <View className="w-8 h-8 bg-BanorteRed rounded-full items-center justify-center">
              <View className="w-5 h-6">
                <View className="w-2 h-2.5 bg-white rounded-full mx-auto" />
                <View className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5" />
                <View className="w-3 h-3 bg-white rounded-full mx-auto mt-0.5" />
              </View>
            </View>
            <Text className="text-sm text-white text-center leading-tight">
              Hormi
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido principal con ScrollView */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Banner promocional */}
        <View className="bg-BanorteGray rounded-xl p-4 mt-4 mb-4 shadow-lg">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-white text-base font-bold mb-1">
                Hola {user?.firstName || user?.fullName || "Usuario"}!
              </Text>
              <Text className="text-white text-sm leading-relaxed">
                Conoce las promociones{"\n"}especiales que tenemos para ti
              </Text>
            </View>
            <TouchableOpacity className="bg-white px-4 py-2.5 rounded-lg shadow-sm">
              <Text className="text-BanorteRed text-sm font-semibold">
                Ver ofertas
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mis cuentas */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-900 text-lg font-bold">Mis cuentas</Text>
            <TouchableOpacity className="p-2">
              <Text className="text-gray-600 text-lg">⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Cuenta Nómina */}
          <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 bg-BanorteGray rounded-xl items-center justify-center">
                  <Text className="text-BanorteGray text-xl">💳</Text>
                </View>
                <View>
                  <Text className="text-gray-900 text-base font-semibold mb-1">
                    Nómina Banorte 2
                  </Text>
                  <Text className="text-sm text-gray-500">****8999</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-gray-900 font-bold text-base">
                  {isLoadingBalance ? "Cargando..." : `$ ${accountBalance.toFixed(2)} MN`}
                </Text>
                <Text className="text-BanorteGray text-xl">›</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Servicios rápidos */}
        <View className="mb-4">
          <Text className="text-BanorteGray text-lg font-bold mb-3">
            Servicios
          </Text>

          {/* Beneficios de mis tarjetas */}
          <View className="bg-white p-4 rounded-xl mb-3 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 bg-BanorteGray rounded-xl items-center justify-center">
                  <Text className="text-white text-xl">🎁</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-BanorteGray font-bold">
                    Beneficios de mis tarjetas
                  </Text>
                  <Text className="text-sm text-gray-700">
                    Promociones, puntos y más...
                  </Text>
                </View>
              </View>
              <Text className="text-gray-700 text-xl">›</Text>
            </View>
          </View>

          {/* Contrata aquí */}
          <View className="bg-white p-4 rounded-xl shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 bg-BanorteGray rounded-xl items-center justify-center">
                  <Text className="text-black text-xl">📃</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-black text-base font-semibold mb-1">
                    Contrata aquí
                  </Text>
                  <Text className="text-sm text-black">
                    Tarjeta de Crédito, Pagarés y más
                  </Text>
                </View>
              </View>
              <Text className="text-black text-xl">›</Text>
            </View>
          </View>
        </View>

        {/* Asistente Hormi */}
        <View className="bg-white p-4 rounded-xl shadow-sm border border-BanorteGray mb-4">
          <View className="items-center">
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/hormi")}
              className="items-center"
            >
              <View className="w-16 h-16 bg-BanorteRed rounded-full items-center justify-center shadow-lg mb-3">
                <View className="w-10 h-12">
                  <View className="w-7 h-8 bg-white rounded-full mx-auto" />
                  <View className="w-5 h-4 bg-white rounded-full mx-auto mt-1" />
                  <View className="w-8 h-9 bg-white rounded-full mx-auto mt-1" />
                </View>
              </View>
              <Text className="text-gray-900 text-base font-semibold mb-1">
                Hormi - Tu asistente financiero
              </Text>
              <Text className="text-gray-600 text-sm text-center">
                Obtén consejos personalizados y gestiona tus beneficios
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Botón Menú inferior fijo */}
      <View className="bg-[#4a5568] py-4 px-4">
        <TouchableOpacity>
          <Text className="text-white text-center font-semibold text-base">
            Menú
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
