"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";
import TableHeader from "@/components/table-header";
import ProductImage from "./product-image";

export type ProductColumn = {
  id: string;
  imageId: string;
  image: string;
  name: string;
  description: string;
  stockThreshold: string;
  stock: string;
};

export const ProductColumns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "image",
    header: () => {
      return <TableHeader variant="normal" name="productImage" />;
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
        <ProductImage
          imageUrl={row.original.image}
          productName={row.original.name}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable"
          name="productName"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable"
          name="productDescription"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
  },
  {
    accessorKey: "stockThreshold",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable-center"
          name="productStockThreshold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
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
        <TableHeader
          variant="sortable-center"
          name="productStock"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
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

export const ProductColumnsWithoutAction: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "image",
    header: () => {
      return <TableHeader variant="normal" name="productImage" />;
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
            src={row.original.image ?? ""}
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
        <TableHeader
          variant="sortable"
          name="productName"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable"
          name="productDescription"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
  },
  {
    accessorKey: "stockThreshold",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable-center"
          name="productStockThreshold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
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
        <TableHeader
          variant="sortable-center"
          name="productStock"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.stock}
      </div>
    ),
  },
];
