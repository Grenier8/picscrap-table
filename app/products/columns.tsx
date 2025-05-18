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
      return <Image src={image as string} alt="" width={50} height={50} />;
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
  },
  {
    accessorKey: "sku",
    header: "SKU",
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
  const webpages: Webpage[] = await fetch("/api/webpages")
    .then((res) => res.json())
    .then((data) => data.webpages);

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
            {formatted}
            {diffIndicator}
          </div>
        );
      },
    };
  });
}
