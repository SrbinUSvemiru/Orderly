"use client";

import fetchFromServer from "@/lib/fetchFromServer";
import { useUserStore } from "@/stores/userStore";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

interface ProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: ProviderProps) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
}

function SessionSync() {
  const { data: session, status } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const getUser = async (id: string) => {
      const response = await fetchFromServer(`/api/users?id=${id}`, {
        method: "GET",
      });

      if (response?.success) {
        setUser(response.user);
      }
    };

    if (status === "authenticated" && session?.user && !user?.id) {
      getUser(session.user.id);
    }
  }, [session, status, setUser, user?.id]);

  return null;
}
