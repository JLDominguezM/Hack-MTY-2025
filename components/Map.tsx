import { useLocationStore } from "@/store";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, Alert } from "react-native";
import * as Location from "expo-location";

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
  const [region, setRegion] = useState<Region>({
    latitude: 25.6866, // Monterrey, México
    longitude: -100.3161,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

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
