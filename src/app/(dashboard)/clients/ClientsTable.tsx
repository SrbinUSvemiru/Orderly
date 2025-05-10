"use client";

import React, { useLayoutEffect } from "react";

import { DataTable } from "@/components/Table/data-table";
import { DataTableAdvancedToolbar } from "@/components/Table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/Table/data-table-filter-list";
import { DataTableFilterMenu } from "@/components/Table/data-table-filter-menu";
import { DataTableSortList } from "@/components/Table/data-table-sort-list";
import { DataTableToolbar } from "@/components/Table/data-table-toolbar";
import { useFeatureFlags } from "@/components/Table/feature-flags-provider";
import { getClients } from "@/db/queries/getClients";
import { useDataTable } from "@/hooks/use-data-table";
import { triggerHeader } from "@/lib/triggerHeader";

import { getColumns } from "./columns";

interface ClientTableProps {
  promises: Promise<[Awaited<ReturnType<typeof getClients>>]>;
}

function ClientsTable({ promises }: ClientTableProps) {
  const [{ data, pageCount }] = React.use(promises);

  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();

  const columns = React.useMemo(() => getColumns(), []);

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data,
    columns,
    pageCount,
    enableAdvancedFilter,
    initialState: {
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  useLayoutEffect(() => {
    triggerHeader({
      title: "Clients",
      type: "client",
      breadcrumb: [
        {
          id: "clients",
          label: "Clients",
          url: "",
        },
      ],
      action: async () => {},
    });
  }, []);

  return (
    <DataTable table={table}>
      {enableAdvancedFilter ? (
        <DataTableAdvancedToolbar table={table}>
          <DataTableSortList table={table} align="start" />
          {filterFlag === "advancedFilters" ? (
            <DataTableFilterList
              table={table}
              shallow={shallow}
              debounceMs={debounceMs}
              throttleMs={throttleMs}
              align="start"
            />
          ) : (
            <DataTableFilterMenu
              table={table}
              shallow={shallow}
              debounceMs={debounceMs}
              throttleMs={throttleMs}
            />
          )}
        </DataTableAdvancedToolbar>
      ) : (
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} align="end" />
        </DataTableToolbar>
      )}
    </DataTable>
  );
}

export default ClientsTable;
