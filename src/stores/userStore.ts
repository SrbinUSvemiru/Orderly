"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "../types/user";

interface UserStore {
  user: User;
  setUser: (_user: User) => void;
  update: (_updates: Partial<User>) => void;
}

export const defaultInitState: User = {
  id: "",
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  name: "",
  createdAt: 0,
  updatedAt: 0,
  deletedAt: undefined,
  active: false,
  organizationId: "",
  role: "",
  image: "",
};

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      user: defaultInitState,
      setUser: (user) => set({ user }),
      update: (updates: Partial<User>) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),
    }),
    {
      name: "user-storage",
      storage: {
        getItem: (key) => {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      },
    }
  )
);
