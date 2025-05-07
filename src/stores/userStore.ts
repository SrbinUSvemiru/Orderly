"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "../types/user";

interface UserWithOrg extends User {
  organisation: {
    id: string;
    ownerId: string;
    name: string;
    language: string;
    type: string;
  };
}

interface UserStore {
  user: UserWithOrg;
  setUser: (_user: UserWithOrg) => void;
  update: (_updates: Partial<UserWithOrg>) => void;
}

export const defaultInitState: UserWithOrg = {
  id: "",
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  name: "",
  organisation: {
    id: "",
    ownerId: "",
    name: "",
    language: "",
    type: "",
  },
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
      update: (updates: Partial<UserWithOrg>) =>
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
