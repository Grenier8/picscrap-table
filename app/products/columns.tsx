import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BaseProduct, Webpage } from "@/lib/interfaces";
import Image from "next/image";

export const getColumns = (webpages: Webpage[]): ColumnDef<BaseProduct>[] => [
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
        <div className="flex items-center">
          <h1>Nombre</h1>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
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
        <div className="flex items-center">
          <h1>Marca</h1>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
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
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <h1>SKU</h1>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <h1>Precio</h1>
          <Button
            className="pr-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
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
  ...getPagesColumns(webpages),
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const product = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(product.link)}
  //           >
  //             Copy link
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

function getPagesColumns(webpages: Webpage[]): ColumnDef<BaseProduct>[] {
  return webpages
    .filter((page: Webpage) => !page.isBasePage)
    .map((page: Webpage) => {
      return {
        accessorKey: page.name,
        header: ({ column }) => {
          return (
            <div className="flex items-center">
              <h1>{page.name}</h1>
              <Button
                className="pr-0"
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
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
            rowA.original.products.find((p) => p.webpageId === page.id)
              ?.price ?? -1;
          const priceB =
            rowB.original.products.find((p) => p.webpageId === page.id)
              ?.price ?? -1;

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
