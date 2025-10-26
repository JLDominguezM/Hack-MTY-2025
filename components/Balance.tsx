import { create } from "zustand";
import { fetchAPI } from "@/lib/fetch";

interface BalanceState {
  accountBalance: number;
  isLoading: boolean;
  userId: number | null;
  setBalance: (balance: number) => void;
  setUserId: (userId: number) => void;
  decreaseBalance: (amount: number) => Promise<void>;
  increaseBalance: (amount: number) => Promise<void>;
  fetchBalance: (userId: number) => Promise<void>;
}

export const useBalanceStore = create<BalanceState>((set, get) => ({
  // Initial state
  accountBalance: 0,
  isLoading: false,
  userId: null,

  // Set user ID
  setUserId: (userId: number) => set({ userId }),

  // Set balance directly
  setBalance: (balance: number) => set({ accountBalance: balance }),

  // Action to decrease the balance (updates DB)
  decreaseBalance: async (amount: number) => {
    const { userId, accountBalance } = get();

    if (!userId) {
      console.error("No user ID set");
      return;
    }

    // Optimistic update
    set({ accountBalance: accountBalance - amount });

    try {
      const data = await fetchAPI("/(api)/balance", {
        method: "PATCH",
        body: JSON.stringify({
          user_id: userId,
          amount: amount,
          operation: "subtract",
        }),
      });

      if (data.success && data.balance) {
        // Update with real balance from server
        set({ accountBalance: parseFloat(data.balance.balance) });
      }
    } catch (error) {
      console.error("Error updating balance:", error);
      // Revert on error
      set({ accountBalance: accountBalance });
    }
  },

  // Action to increase the balance (updates DB)
  increaseBalance: async (amount: number) => {
    const { userId, accountBalance } = get();

    if (!userId) {
      console.error("No user ID set");
      return;
    }

    // Optimistic update
    set({ accountBalance: accountBalance + amount });

    try {
      const data = await fetchAPI("/(api)/balance", {
        method: "PATCH",
        body: JSON.stringify({
          user_id: userId,
          amount: amount,
          operation: "add",
        }),
      });

      if (data.success && data.balance) {
        // Update with real balance from server
        set({ accountBalance: parseFloat(data.balance.balance) });
      }
    } catch (error) {
      console.error("Error updating balance:", error);
      // Revert on error
      set({ accountBalance: accountBalance });
    }
  },

  // Fetch balance from API
  fetchBalance: async (userId: number) => {
    set({ isLoading: true });
    try {
      const data = await fetchAPI(`/(api)/balance?user_id=${userId}`, {
        method: "GET",
      });

      if (data.success && data.user) {
        set({
          accountBalance: parseFloat(data.user.balance),
          userId,
          isLoading: false,
        });
      } else {
        console.error("Error: Invalid balance data", data);
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      set({ isLoading: false });
    }
  },
}));
