"use client";

import { BaseProduct } from "@/lib/interfaces";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

export default function ProductList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [baseProducts, setBaseProducts] = useState<BaseProduct[]>([]);
  const [columns, setColumns] = useState<ColumnDef<BaseProduct>[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/");
      return;
    }
    const fetchBaseProducts = () => {
      fetch("/api/base-products")
        .then((res) => res.json())
        .then((data) => setBaseProducts(data.baseProducts));
    };
    fetchBaseProducts();
    
    // Fetch webpages
    fetch("/api/webpages")
      .then((res) => res.json())
      .then((data) => {
        setColumns(getColumns(data.webpages));
      })
      .catch((error) => {
        console.error("Error fetching webpages:", error);
      });
  }, [session, status, router]);

  if (status === "loading" || !session || columns.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center py-5 px-8">
      <DataTable columns={columns} data={baseProducts} />
    </div>
  );
}
