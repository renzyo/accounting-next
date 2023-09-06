"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-action";
import Image from "next/image";

export type ProductColumn = {
  id: string;
  image: string;
  name: string;
  description: string;
  stockThreshold: string;
  stock: string;
};

export const ProductColumns: ColumnDef<ProductColumn>[] = [
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
    accessorKey: "image",
    header: () => {
      return (
        <div className="flex items-center justify-center text-center">
          Foto Produk
        </div>
      );
    },
    cell: ({ row }) => {
      if (row.original.image === "") {
        return (
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 rounded-lg bg-gray-300 flex items-center justify-center text-center">
              No Image
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center">
          <Image
            src={"http://localhost:3000" + row.original.image ?? ""}
            width={200}
            height={200}
            alt="Product Image"
            className="w-20 h-20 rounded-lg"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama Produk
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <div className="flex ">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Deskripsi Produk
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "stockThreshold",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Batas Stok
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
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
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stok
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.stock}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
