import { create } from "zustand";

interface BalanceState {
  accountBalance: number;
  decreaseBalance: (amount: number) => void;

  // You could add increaseBalance, setBalance, etc. later if needed
}

export const useBalanceStore = create<BalanceState>((set) => ({
  // Initial state
  accountBalance: 1702.02,

  // Action to decrease the balance
  decreaseBalance: (amount) =>
    set((state) => ({
      accountBalance: state.accountBalance - amount,
    })),
}));
