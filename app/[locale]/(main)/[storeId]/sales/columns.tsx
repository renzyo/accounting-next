"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-action";
import { format, parseISO } from "date-fns";
import id from "date-fns/locale/id";
import TableHeader from "@/components/table-header";

export type SalesColumn = {
  id: string;
  merchant: {
    id: string;
    name: string;
  };
  product: {
    id: string;
    name: string;
  };
  addedBy: string;
  saleDate: Date;
  quantity: string;
};

export const SalesColumns: ColumnDef<SalesColumn>[] = [
  {
    accessorKey: "saleDate",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable"
          name="saleDate"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <span>
        {format(row.original.saleDate, "PPP", {
          locale: id,
        })}
      </span>
    ),
  },
  {
    accessorKey: "addedBy",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable"
          name="addedBy"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <span>
        {row.original.addedBy === "Deleted User"
          ? "Deleted User"
          : row.original.addedBy}
      </span>
    ),
  },
  {
    accessorKey: "product",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable"
          name="productName"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <span>{row.original.product?.name ?? ""}</span>,
  },
  {
    accessorKey: "merchant",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable"
          name="merchant"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <span>{row.original.merchant?.name ?? ""}</span>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable-center"
          name="quantity"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const SalesColumnsWithoutAction: ColumnDef<SalesColumn>[] = [
  {
    accessorKey: "saleDate",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable"
          name="saleDate"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <span>
        {format(row.original.saleDate, "PPP", {
          locale: id,
        })}
      </span>
    ),
  },
  {
    accessorKey: "addedBy",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable"
          name="addedBy"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <span>
        {row.original.addedBy === "Deleted User"
          ? "Deleted User"
          : row.original.addedBy}
      </span>
    ),
  },
  {
    accessorKey: "product",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable"
          name="productName"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <span>{row.original.product?.name ?? ""}</span>,
  },
  {
    accessorKey: "merchant",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable"
          name="merchant"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <span>{row.original.merchant?.name ?? ""}</span>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <TableHeader
          variant="sortable-center"
          name="quantity"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
  },
];
