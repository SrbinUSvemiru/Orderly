"use client";

import { createContext, useContext, useEffect } from "react";

import { useHeaderStore } from "@/stores/headerStore";
import { useModalStore } from "@/stores/modalStore";
import { useUserStore } from "@/stores/userStore";
import { Organisation } from "@/types/organisation";
import { User } from "@/types/user";

interface ZustandContextType {
  useUserStore: typeof useUserStore;
  useHeaderStore: typeof useHeaderStore;
  useModalStore: typeof useModalStore;
}

interface ZustandProviderProps {
  children: React.ReactNode;
  organisation: Organisation | null;
  initialUser: User | null;
}

const ZustandContext = createContext<ZustandContextType | null>(null);

export const ZustandProvider: React.FC<ZustandProviderProps> = ({
  children,
  initialUser,
  organisation,
}) => {
  useEffect(() => {
    if (!initialUser || !organisation) return;
    const user = {
      ...initialUser,
      firstName: initialUser.firstName || "",
      lastName: initialUser.lastName || "",
      phone: initialUser.phone || "",
      createdAt: initialUser.createdAt || Date.now(),
      image: initialUser.image || "",
      organisation: organisation,
    };
    useUserStore.setState({
      user: user,
    });
  }, [initialUser, organisation]);

  return (
    <ZustandContext.Provider
      value={{ useUserStore, useHeaderStore, useModalStore }}
    >
      {children}
    </ZustandContext.Provider>
  );
};

export function useZustandContext() {
  const context = useContext(ZustandContext);
  if (!context) {
    throw new Error("useZustandContext must be used within a ZustandProvider");
  }
  return context;
}
