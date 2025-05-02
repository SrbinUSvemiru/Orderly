"use client";

import { useEffect } from "react";

import fetchFromServer from "@/lib/fetchFromServer";
import { useUserStore } from "@/stores/userStore";

interface ProviderProps {
  initialUser: {
    id: string;
    role: string;
  } | null;
}

export function SessionSync({ initialUser }: ProviderProps) {
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

    if (initialUser) {
      getUser(initialUser.id);
    }
  }, [initialUser, setUser, user?.id]);

  return null;
}
