"use client";

import useGetUserInfoQuery from "@/lib/queries/useGetUserInfoQuery";
import { useHeaderStore } from "@/stores/headerStore";
import { useModalStore } from "@/stores/modalStore";
import { useUserStore } from "@/stores/userStore";
import { useSession } from "next-auth/react";

import { createContext, useContext, useEffect } from "react";

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
  const { data: session } = useSession();
  const setUser = useUserStore((state) => state.setUser);

  const { data, isLoading } = useGetUserInfoQuery(
    session?.user?.id ? session?.user?.id : "",
    { enabled: !!session?.user?.id }
  );

  useEffect(() => {
    if (isLoading || !data) return;
    setUser(data);
  }, [isLoading, data]);

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
