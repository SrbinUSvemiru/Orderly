"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryConnector from "@/lib/queryConnector";

export function QueryProvider({ children }: { children: ReactNode }) {
  queryConnector.setQueryClient();

  return (
    <QueryClientProvider client={queryConnector.queryClient}>
      {children} <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
