import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BaseProduct, Webpage } from "@/lib/interfaces";
import Image from "next/image";
import { CorrelationCell } from "./CorrelationCell";

export const getColumns = (
  webpages: Webpage[],
  onChanged: () => void
): ColumnDef<BaseProduct>[] => [
  {
    accessorKey: "image",
    header: "Imagen",
    cell: ({ row }) => {
      const image = row.getValue("image");
      return (
        <Image
          src={image ? (image as string) : "/logo-square.png"}
          alt=""
          width={50}
          height={50}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="flex items-center">
        <h1>Nombre</h1>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      const link = row.getValue("link");
      return <a href={link as string} target="_blank" rel="noreferrer">Link</a>;
    },
  },
  {
    accessorKey: "outOfStock",
    header: "En Stock",
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <div className="flex items-center">
        <h1>Marca</h1>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const brand = row.original.brand;
      return <div>{brand?.name || "-"}</div>;
    },
    accessorFn: (row) => row.brand?.name || "",
    filterFn: (row, columnId, filterValue) => {
      const brand = row.original.brand;
      if (!brand || !brand.name) return false;
      if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
      return filterValue.includes(brand.name);
    },
  },
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <div className="flex items-center">
        <h1>SKU</h1>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <div className="flex items-center justify-end">
        <h1>Precio</h1>
        <Button
          className="pr-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CLP",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  ...getPagesColumns(webpages, onChanged),
];

function getPagesColumns(
  webpages: Webpage[],
  onChanged: () => void
): ColumnDef<BaseProduct>[] {
  return webpages
    .filter((page: Webpage) => !page.isBasePage)
    .map((page: Webpage) => ({
      accessorKey: page.name,
      header: ({ column }) => (
        <div className="flex items-center justify-end">
          <h1>{page.name}</h1>
          <Button
            className="pr-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const product = row.original.products.find((p) => p.webpageId === page.id) ?? null;
        return (
          <div className="text-right">
            <CorrelationCell
              product={product}
              basePrice={row.original.price}
              baseProductId={row.original.id}
              webpageId={page.id}
              webpageName={page.name}
              onChanged={onChanged}
            />
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const priceA = rowA.original.products.find((p) => p.webpageId === page.id)?.price ?? -1;
        const priceB = rowB.original.products.find((p) => p.webpageId === page.id)?.price ?? -1;
        const basePriceA = rowA.original.price;
        const basePriceB = rowB.original.price;
        const getCat = (price: number, base: number) => {
          if (price === -1 || base === -1) return -0.5;
          if (price === base) return 0;
          return price > base ? 1 : -1;
        };
        const cA = getCat(priceA, basePriceA);
        const cB = getCat(priceB, basePriceB);
        if (cA !== cB) return cA - cB;
        return priceA - priceB;
      },
    }));
}
