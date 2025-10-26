import { create } from "zustand";

interface ConsumptionState {
  consumptionData: any;
  isLoading: boolean;
  lastUpdate: number;
  setConsumptionData: (data: any) => void;
  setIsLoading: (loading: boolean) => void;
  refreshConsumption: () => void;
}

export const useConsumptionStore = create<ConsumptionState>((set) => ({
  consumptionData: null,
  isLoading: false,
  lastUpdate: Date.now(),
  setConsumptionData: (data) =>
    set({ consumptionData: data, lastUpdate: Date.now() }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  refreshConsumption: () => set({ lastUpdate: Date.now() }),
}));
