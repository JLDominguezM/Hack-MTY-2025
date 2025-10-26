import { useLocationStore } from "@/store";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, Alert, Platform } from "react-native";
import * as Location from "expo-location";

// Importación condicional para evitar errores en web
let MapView: any, Marker: any, PROVIDER_DEFAULT: any;
let Region: any;

if (Platform.OS !== "web") {
  try {
    const Maps = require("react-native-maps");
    MapView = Maps.default;
    Marker = Maps.Marker;
    PROVIDER_DEFAULT = Maps.PROVIDER_DEFAULT;
    Region = Maps.Region;
  } catch (error) {
    console.warn("react-native-maps no disponible:", error);
  }
}

// Mock markers data
const mockMarkers = [
  {
    id: "1",
    title: "Servicios CFE",
    description: "Oficina principal",
    latitude: 25.6866,
    longitude: -100.3161,
  },
  {
    id: "2",
    title: "Agua y Drenaje",
    description: "Centro de atención",
    latitude: 25.69,
    longitude: -100.32,
  },
  {
    id: "3",
    title: "Gas Natural",
    description: "Oficina de servicios",
    latitude: 25.68,
    longitude: -100.31,
  },
];

const Map = () => {
  const { userLatitude, userLongitude, setUserLocation } = useLocationStore();
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<any>({
    latitude: 25.6866, // Monterrey, México
    longitude: -100.3161,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Si estamos en web, mostrar un mock
  if (Platform.OS === "web") {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#e8f4f8",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#ccc",
        }}
      >
        <Text style={{ color: "#666", fontSize: 18, marginBottom: 10 }}>
          🗺️ Mapa
        </Text>
        <Text style={{ color: "#999", fontSize: 14 }}>
          Solo disponible en móvil
        </Text>
      </View>
    );
  }

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      // Pedir permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permisos requeridos",
          "Se necesitan permisos de ubicación para mostrar tu posición en el mapa.",
          [{ text: "OK" }]
        );
        setLoading(false);
        return;
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // Actualizar store con la ubicación
      setUserLocation({ latitude, longitude });

      // Actualizar región del mapa
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Error",
        "No se pudo obtener la ubicación. Se mostrará ubicación por defecto.",
        [{ text: "OK" }]
      );
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0286FF" />
        <Text className="mt-2 text-gray-600">Obteniendo ubicación...</Text>
      </View>
    );
  }

  // Si no hay MapView disponible, mostrar fallback
  if (!MapView) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#e8f4f8",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#ccc",
        }}
      >
        <Text style={{ color: "#666", fontSize: 18, marginBottom: 10 }}>
          🗺️ Mapa
        </Text>
        <Text style={{ color: "#999", fontSize: 14 }}>No disponible</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="standard"
        showsPointsOfInterest={true}
        userInterfaceStyle="light"
      >
        {/* Markers mock */}
        {mockMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
            pinColor="red"
          />
        ))}
      </MapView>
    </View>
  );
};

export default Map;
