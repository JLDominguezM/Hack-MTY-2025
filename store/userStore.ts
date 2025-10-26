import { create } from "zustand";

interface UserState {
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  setUser: (user: { id: string; name: string; email: string }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  userName: null,
  userEmail: null,
  setUser: (user) =>
    set({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    }),
  clearUser: () =>
    set({
      userId: null,
      userName: null,
      userEmail: null,
    }),
}));
