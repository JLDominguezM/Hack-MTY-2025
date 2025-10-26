import { create } from "zustand";

interface QRData {
  id: string;
  name: string;
  email: string;
  qrId: string;
}

interface QRStore {
  qrData: QRData | null;
  setQRData: (data: QRData) => void;
  clearQRData: () => void;
}

export const useQRStore = create<QRStore>((set) => ({
  qrData: null,
  setQRData: (data) => set({ qrData: data }),
  clearQRData: () => set({ qrData: null }),
}));
