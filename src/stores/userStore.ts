"use client";
import { create } from "zustand";
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

export const useUserStore = create<UserStore>((set) => ({
  user: defaultInitState,
  setUser: (user) => set({ user }),
  update: (updates: Partial<User>) =>
    set((state) => ({
      user: { ...state.user, ...updates },
    })),
}));
