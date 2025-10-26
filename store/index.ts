import { LocationStore } from "@/types/type";
import { create } from "zustand";

export const useLocationStore = create<LocationStore>((set) => ({
  userLongitude: null,
  userLatitude: null,
  setUserLocation: ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
    }));
  },
}));

// Re-export user store
export { useUserStore } from "./userStore";
