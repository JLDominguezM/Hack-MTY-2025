import { useLocationStore } from "@/store";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useFetch } from "@/lib/fetch";
import { icons } from "@/constants";
import MapViewDirections from "react-native-maps-directions";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

const isValidCoordinate = (lat: number, lng: number): boolean => {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    lat !== 0 &&
    lng !== 0
  );
};

const Map = () => {
  const {
    destinationLatitude,
    destinationLongitude,
    userLatitude,
    userLongitude,
  } = useLocationStore();
  const {
    selectedMariachi,
    setMariachis,
    setSelectedMariachi,
    clearSelectedMariachi,
    mariachis: storedMariachis,
  } = useMariachiStore();

  const {
    data: mariachis,
    loading,
    error,
  } = useFetch<Mariachi[]>("/(api)/mariachis");
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    if (Array.isArray(mariachis)) {
      const newMarkers = generateMarkersFromData({
        data: mariachis,
        destinationLatitude: destinationLatitude ?? 0,
        destinationLongitude: destinationLongitude ?? 0,
      });

      setMarkers(newMarkers);
      setMariachis(newMarkers);
    }
  }, [mariachis, destinationLatitude, destinationLongitude, setMariachis]);

  const selectedMariachiData = storedMariachis.find(
    (mariachi) => mariachi.id === selectedMariachi
  );

  const region = calculateRegion({
    destinationLatitude,
    destinationLongitude,
    selectedMariachiLatitude: selectedMariachiData?.Mariachilatitude,
    selectedMariachiLongitude: selectedMariachiData?.Mariachilongitude,
    userLatitude,
    userLongitude,
  });

  if (loading)
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  if (error)
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        tintColor="black"
        initialRegion={region}
        showsUserLocation={true}
        mapType="mutedStandard"
        showsPointsOfInterest={false}
        userInterfaceStyle="light"
      >
        {markers.map((marker, index) => (
          <Marker
            key={`mariachi-${marker.id || index}`}
            coordinate={{
              latitude: marker.Mariachilatitude,
              longitude: marker.Mariachilongitude,
            }}
            title={marker.name}
            image={
              selectedMariachi === marker.id
                ? icons.selectedMarker
                : icons.marker
            }
            onPress={() => {
              if (selectedMariachi === marker.id) {
                clearSelectedMariachi();
              } else {
                setSelectedMariachi(marker.id);
              }
            }}
          />
        ))}

        {destinationLatitude && destinationLongitude && (
          <Marker
            key="destination-marker"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destino"
            image={icons.pin}
          />
        )}

        {destinationLatitude &&
          destinationLongitude &&
          selectedMariachiData &&
          selectedMariachiData.Mariachilatitude &&
          selectedMariachiData.Mariachilongitude &&
          directionsAPI &&
          isValidCoordinate(
            selectedMariachiData.Mariachilatitude,
            selectedMariachiData.Mariachilongitude
          ) &&
          isValidCoordinate(destinationLatitude, destinationLongitude) && (
            <MapViewDirections
              key="directions"
              origin={{
                latitude: selectedMariachiData.Mariachilatitude,
                longitude: selectedMariachiData.Mariachilongitude,
              }}
              destination={{
                latitude: destinationLatitude,
                longitude: destinationLongitude,
              }}
              apikey={directionsAPI}
              strokeColor="#0286FF"
              strokeWidth={2}
            />
          )}
      </MapView>
    </View>
  );
};

export default Map;
