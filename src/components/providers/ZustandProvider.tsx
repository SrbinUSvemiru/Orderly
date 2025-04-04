"use client";

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

  useEffect(() => {
    if (!session?.user?.id) return;
    async function fetchUser() {
      const user = await fetch(
        `http://localhost:3000/api/users/${session?.user?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = await user.json();
      setUser(response);
    }

    fetchUser();
  }, [session?.user?.id, setUser]);

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
