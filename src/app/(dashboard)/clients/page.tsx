import * as React from "react";

import { FeatureFlagsProvider } from "@/components/Table/feature-flags-provider";
import { getClients } from "@/db/queries/getClients";
import { searchParamsCache } from "@/lib/clients_search_params";
import { getValidFilters } from "@/lib/data-table";
import type { SearchParams } from "@/types";

import ClientsTable from "./ClientsTable";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function Clients(props: PageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getClients({
      ...search,
      filters: validFilters,
    }),
  ]);

  return (
    <React.Suspense>
      <FeatureFlagsProvider>
        <ClientsTable promises={promises} />
      </FeatureFlagsProvider>
    </React.Suspense>
  );
}

export default Clients;
