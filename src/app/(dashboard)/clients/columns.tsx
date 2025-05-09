"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/Table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";

export type ClientColumnDef = {
  id: string;
  name: string;
  address: unknown;
  owner: unknown;
  type: "enterprise" | "client";
  createdAt: number;
  updatedAt: number;
};

// interface GetTasksTableColumnsProps {
//   setRowAction?: React.Dispatch<
//     React.SetStateAction<DataTableRowAction<ClientColumnDef> | null>
//   >;
// }

export function getColumns(): ColumnDef<ClientColumnDef>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row?.getValue("name")}
            </span>
          </div>
        );
      },
      meta: {
        label: "Name",
        placeholder: "Search names...",
        variant: "text",
      },
      enableColumnFilter: true,
      enableSorting: true,
    },
    {
      id: "owner",
      accessorKey: "owner",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Owner" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {row?.getValue("owner") || ""}
            </span>
          </div>
        );
      },
      meta: {
        label: "Owner",
        placeholder: "Search owners...",
        variant: "text",
      },
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      id: "address",
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="max-w-[31.25rem] truncate font-medium">
              {String(row?.original?.address || "-")}
            </span>
          </div>
        );
      },
      meta: {
        label: "Address",
        placeholder: "Search address...",
        variant: "text",
      },
      enableColumnFilter: true,
      enableSorting: false,
      enableGlobalFilter: false,
    },
  ];
}
