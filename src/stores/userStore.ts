"use client";
import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  name: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  active: boolean;
  organizationId: string;
  type: string;
  image: string;
}

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
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
  active: false,
  organizationId: "",
  type: "",
  image: "",
};

export const useUserStore = create<UserStore>((set) => ({
  user: defaultInitState,
  setUser: (user) => set({ user }),
  update: (updates: Partial<User>) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),
}));
