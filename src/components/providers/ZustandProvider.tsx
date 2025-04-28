"use client";

import { createContext, useContext } from "react";

import { useHeaderStore } from "@/stores/headerStore";
import { useModalStore } from "@/stores/modalStore";
import { useUserStore } from "@/stores/userStore";

interface ZustandContextType {
  useUserStore: typeof useUserStore;
  useHeaderStore: typeof useHeaderStore;
  useModalStore: typeof useModalStore;
}

interface ZustandProviderProps {
  children: React.ReactNode;
}

const ZustandContext = createContext<ZustandContextType | null>(null);

export const ZustandProvider: React.FC<ZustandProviderProps> = ({
  children,
}) => {
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
