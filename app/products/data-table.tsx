"use client";

import {
  ColumnDef,
  ColumnFiltersState,
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Helper to get array from query param
  const getArrayParam = (param: string | null) => {
    if (!param) return [];
    try {
      return JSON.parse(param);
    } catch {
      return param.split(",").filter(Boolean);
    }
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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () => {
      const name = searchParams.get("name") || "";
      const brand = getArrayParam(searchParams.get("brand"));
      const sku = searchParams.get("sku") || "";
      const filters = [];
      if (name) filters.push({ id: "name", value: name });
      if (brand.length) filters.push({ id: "brand", value: brand });
      if (sku) filters.push({ id: "sku", value: sku });
      return filters;
    }
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      outOfStock: false,
      link: false,
    });

  // Sync filter, sorting, and pagination state to URL
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    // Filters
    const nameFilter = columnFilters.find((f) => f.id === "name")
      ?.value as string;
    if (nameFilter) {
      params.set("name", nameFilter);
    } else {
      params.delete("name");
    }
    const brandFilter = columnFilters.find((f) => f.id === "brand")
      ?.value as string[];
    if (brandFilter && brandFilter.length) {
      params.set("brand", JSON.stringify(brandFilter));
    } else {
      params.delete("brand");
    }
    const skuFilter = columnFilters.find((f) => f.id === "sku")
      ?.value as string;
    if (skuFilter) {
      params.set("sku", skuFilter);
    } else {
      params.delete("sku");
    }
    // Sorting
    if (sorting.length) {
      params.set("sort", JSON.stringify(sorting));
    } else {
      params.delete("sort");
    }

    router.replace(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters, sorting]);

  // Sync state if URL changes (e.g. browser navigation)
  React.useEffect(() => {
    const name = searchParams.get("name") || "";
    const brand = getArrayParam(searchParams.get("brand"));
    const sku = searchParams.get("sku") || "";
    setColumnFilters(() => {
      const filters = [];
      if (name) filters.push({ id: "name", value: name });
      if (brand.length) filters.push({ id: "brand", value: brand });
      if (sku) filters.push({ id: "sku", value: sku });
      return filters;
    });
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    // pagination is managed internally by react-table now
  });

  return (
    <div className="mr-4 ml-4 bg-white dark:bg-gray-900 w-full">
      <div className="flex items-center py-4 gap-5">
        <Input
          placeholder="Filtrar nombre..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Filtro de marcas con DropdownMenu y checkboxes */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="max-w-sm w-full flex items-center justify-between bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
              type="button"
            >
              <span className="truncate">
                {(() => {
                  const selected =
                    (table.getColumn("brand")?.getFilterValue() as string[]) ??
                    [];
                  if (!selected.length) return "Todas las marcas";
                  if (selected.length === 1) return selected[0];
                  return `${selected.length} marcas seleccionadas`;
                })()}
              </span>
              <svg
                className="ml-2 w-4 h-4 text-gray-400 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-64 overflow-y-auto bg-gray-900 dark:bg-gray-900 border border-gray-700 rounded shadow-lg mt-2 w-56 p-1">
            {Array.from(
              new Set(
                data
                  .map((row) =>
                    typeof row === "object" &&
                    row !== null &&
                    "brand" in row &&
                    typeof (row as any).brand?.name === "string"
                      ? (row as any).brand.name
                      : undefined
                  )
                  .filter((name): name is string => Boolean(name))
                  .sort((a, b) => a.localeCompare(b))
              )
            ).map((brand) => {
              const selected =
                (table.getColumn("brand")?.getFilterValue() as string[]) ?? [];
              const checked = selected.includes(brand);
              return (
                <DropdownMenuCheckboxItem
                  key={brand}
                  checked={checked}
                  className={
                    `flex items-center px-3 py-2 rounded text-gray-100 text-sm cursor-pointer transition-colors relative before:hidden ` +
                    (checked
                      ? "bg-blue-700/60 font-semibold"
                      : "hover:bg-gray-700/80")
                  }
                  style={{
                    paddingLeft: "2rem",
                  }}
                  onCheckedChange={(checked) => {
                    const prev =
                      (table
                        .getColumn("brand")
                        ?.getFilterValue() as string[]) ?? [];
                    let next: string[];
                    if (checked) {
                      next = [...prev, brand];
                    } else {
                      next = prev.filter((b) => b !== brand);
                    }
                    table.getColumn("brand")?.setFilterValue(next);
                  }}
                >
                  {checked && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-400"></span>
                  )}
                  {brand}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder="Filtrar sku..."
          value={(table.getColumn("sku")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("sku")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            >
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
