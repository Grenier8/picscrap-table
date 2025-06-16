"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getPaginationParams = () => {
    const pageIndex = parseInt(searchParams.get("pageIndex") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "9");
    return { pageIndex, pageSize };
  };

  // Initialize filters, sorting, and pagination from URL
  const parseSorting = () => {
    const sortParam = searchParams.get("sort");
    if (!sortParam) return [];
    try {
      return JSON.parse(sortParam);
    } catch {
      // fallback: sort=name:asc or sort=name:desc
      const [id, desc] = sortParam.split(":");
      if (!id) return [];
      return [{ id, desc: desc === "desc" }];
    }
  };
  const [sorting, setSorting] = React.useState<SortingState>(parseSorting());
  const [pagination, setPagination] = React.useState<PaginationState>(
    getPaginationParams()
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Sync filter, sorting, and pagination state to URL
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    // Filters

    // Sorting
    if (sorting.length) {
      params.set("sort", JSON.stringify(sorting));
    } else {
      params.delete("sort");
    }

    // Pagination
    if (pagination.pageIndex > 0) {
      params.set("pageIndex", pagination.pageIndex.toString());
    } else {
      params.delete("pageIndex");
    }
    if (pagination.pageSize !== 8) {
      params.set("pageSize", pagination.pageSize.toString());
    }

    // Sorting
    if (sorting.length) {
      params.set("sort", JSON.stringify(sorting));
    } else {
      params.delete("sort");
    }

    // Pagination
    if (pagination.pageIndex > 0) {
      params.set("pageIndex", pagination.pageIndex.toString());
    } else {
      params.delete("pageIndex");
    }
    if (pagination.pageSize !== 8) {
      params.set("pageSize", pagination.pageSize.toString());
    } else {
      params.delete("pageSize");
    }

    router.replace(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, pagination]);

  // Sync state if URL changes (e.g. browser navigation)
  React.useEffect(() => {
    // Sorting
    setSorting(() => {
      const sortParam = searchParams.get("sort");
      if (!sortParam) return [];
      try {
        return JSON.parse(sortParam);
      } catch {
        const [id, desc] = sortParam.split(":");
        if (!id) return [];
        return [{ id, desc: desc === "desc" }];
      }
    });
    // Pagination state is now derived from URL only, so no need to update local state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const table = useReactTable({
    data,
    columns,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,

    state: {
      sorting,
      columnVisibility,
      pagination,
    },
  });

  return (
    <div className="mr-4 ml-4 bg-white dark:bg-gray-900 w-4/5">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
