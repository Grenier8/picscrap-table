import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { BaseProduct, Webpage } from "@/lib/interfaces";

export const columns: ColumnDef<BaseProduct>[] = [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      const link = row.getValue("link");
      return <a href={link as string}>Link</a>;
    },
  },
  {
    accessorKey: "outOfStock",
    header: "En Stock",
  },
  {
    accessorKey: "brand",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Marca
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const brand = row.original.brand;
      return <div>{brand.name}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const brand = row.original.brand;
      if (!brand || !brand.name) return false;
      if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
      return filterValue.includes(brand.name);
    },
  },
  {
    accessorKey: "sku",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Precio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CLP",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  ...(await getPagesColumns()),
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.link)}
            >
              Copy link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

async function getPagesColumns(): Promise<ColumnDef<BaseProduct>[]> {
  const obtainedWebpages: Webpage[] = await fetch("/api/webpages")
    .then((res) => res.json())
    .then((data) => data.webpages);

  const webpages = obtainedWebpages.filter((page: Webpage) => !page.isBasePage);

  return webpages.map((page: Webpage) => {
    return {
      accessorKey: page.name,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {page.name}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const products = row.original.products;
        const product = products.find((p) => p.webpageId === page.id);
        const amount = product ? product.price : -1;
        const formatted =
          amount === -1
            ? "-"
            : new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "CLP",
              }).format(amount);

        const basePrice = row.original.price;
        const colorClass =
          amount == -1 || amount === basePrice
            ? ""
            : amount < basePrice
            ? "text-red-500"
            : "text-green-500";

        const diffIndicator =
          amount === -1 || amount === basePrice
            ? ""
            : amount < basePrice
            ? " ↓"
            : " ↑";

        return (
          <div className={`text-right font-medium ${colorClass}`}>
            <a href={product?.link}>
              {formatted}
              {diffIndicator}
            </a>
          </div>
        );
      },
      // Sort by price category (red/white/green) and then by price value
      sortingFn: (rowA, rowB) => {
        const priceA =
          rowA.original.products.find((p) => p.webpageId === page.id)?.price ??
          -1;
        const priceB =
          rowB.original.products.find((p) => p.webpageId === page.id)?.price ??
          -1;

        const basePriceA = rowA.original.price;
        const basePriceB = rowB.original.price;

        // Categorizar cada precio: 0 = igual, 1 = mayor, -1 = menor, -0.5 = null
        const getPriceCategory = (price: number, basePrice: number) => {
          if (price === -1 || basePrice === -1) return -0.5;
          if (price === basePrice) return 0;
          return price > basePrice ? 1 : -1;
        };

        const categoryA = getPriceCategory(priceA, basePriceA);
        const categoryB = getPriceCategory(priceB, basePriceB);

        // Primero ordenar por categoría
        if (categoryA !== categoryB) {
          return categoryA - categoryB;
        }

        // Si están en la misma categoría, ordenar por precio
        return priceA - priceB;
      },
    };
  });
}
