import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrapingResults } from "@/lib/interfaces";

export const getColumns = (): ColumnDef<ScrapingResults>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date");
      return <div className="text-center">{date as string}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return <div>Estado</div>;
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const color =
        status === "FINALIZADO"
          ? "text-green-500"
          : status === "EN_PROCESO"
          ? "text-cyan-500"
          : "text-red-500";
      return <div className={color}>{status}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const status = row.original.status;
      if (!status) return false;
      if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
      return filterValue.includes(status);
    },
  },
  {
    accessorKey: "duration",
    header: "Duración",
    cell: ({ row }) => {
      const duration = row.getValue("duration");
      return duration;
    },
  },
  {
    accessorKey: "startTime",
    header: "Inicio",
    cell: ({ row }) => {
      const createdAt = row.original.startTime;
      return <div>{createdAt}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const createdAt = row.original.startTime;
      if (!createdAt) return false;
      if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
      return filterValue.includes(createdAt);
    },
  },
  {
    accessorKey: "endTime",
    header: "Fin",
    cell: ({ row }) => {
      const createdAt = row.original.endTime;
      return <div>{createdAt}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const createdAt = row.original.endTime;
      if (!createdAt) return false;
      if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
      return filterValue.includes(createdAt);
    },
  },
  {
    accessorKey: "webpages",
    header: "Páginas",
    cell: ({ row }) => {
      const createdAt = row.original.webpages;
      return <div>{createdAt}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const createdAt = row.original.webpages;
      if (!createdAt) return false;
      if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
      return filterValue.includes(createdAt);
    },
  },
];
