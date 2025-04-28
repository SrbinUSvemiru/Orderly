"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "../types/user";

interface UserStore {
  user: User;
  setUser: (user: User) => void;
  update: (updates: Partial<User>) => void;
}

const defaultInitState: User = {
  id: "",
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  name: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: undefined,
  active: false,
  organizationId: "",
  type: "",
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
