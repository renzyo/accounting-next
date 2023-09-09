"use client";

import { ColumnDef } from "@tanstack/react-table";

export type StockColumn = {
  id: string;
  name: string;
  stockThreshold: string;
  stock: string;
};

export const StockColumns: ColumnDef<StockColumn>[] = [
  {
    accessorKey: "number",
    header: () => {
      return <div className="flex items-center justify-center">No</div>;
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-center">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <div className="flex">Nama Produk</div>;
    },
  },
  {
    accessorKey: "stockThreshold",
    header: ({ column }) => {
      return <div className="flex items-center justify-center">Batas Stok</div>;
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.stockThreshold}
      </div>
    ),
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return <div className="flex items-center justify-center">Stok</div>;
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.stock}
      </div>
    ),
  },
];
