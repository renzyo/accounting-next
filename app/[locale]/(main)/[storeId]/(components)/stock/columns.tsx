"use client";

import TableHeader from "@/components/table-header";
import { ColumnDef } from "@tanstack/react-table";

export type StockColumn = {
  id: string;
  name: string;
  stockThreshold: string;
  stock: string;
};

export const StockColumns: ColumnDef<StockColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="normal"
          name="productName"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
  },
  {
    accessorKey: "stockThreshold",
    header: () => {
      return <TableHeader variant="normal" name="productStockThreshold" />;
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.stockThreshold}
      </div>
    ),
  },
  {
    accessorKey: "stock",
    header: () => {
      return <TableHeader variant="normal" name="productStock" />;
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.stock}
      </div>
    ),
  },
];
