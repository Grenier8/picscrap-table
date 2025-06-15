"use client";
export const dynamic = "force-dynamic"; // This disables SSG and ISR

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PriceSummary {
  pageId: number;
  pageName: string;
  higherPriceCount: number;
  lowerPriceCount: number;
  equalPriceCount: number;
  totalProducts: number;
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [priceSummary, setPriceSummary] = useState<PriceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/price-summary");
        if (!response.ok) {
          throw new Error("Error al cargar el resumen de precios");
        }
        const data = await response.json();
        setPriceSummary(data.summary);
      } catch (err) {
        console.error("Error:", err);
        setError("Error al cargar el resumen de precios");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchPriceSummary();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Resumen de Precios
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Comparación de precios por página
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => router.refresh()}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {priceSummary.map((page) => (
              <div
                key={page.pageId}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {page.pageName}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        Total de productos:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {page.totalProducts}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                      <span>Precio más bajo:</span>
                      <span className="font-medium">
                        {page.lowerPriceCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-yellow-600 dark:text-yellow-400">
                      <span>Precio igual:</span>
                      <span className="font-medium">
                        {page.equalPriceCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-red-600 dark:text-red-400">
                      <span>Precio más alto:</span>
                      <span className="font-medium">
                        {page.higherPriceCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
