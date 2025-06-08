"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { startScraping } from "@/lib/services/scrapper";

export default function Header() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const [responseResult, setResponseResult] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApiCall = async () => {
    try {
      setIsLoading(true);
      const response = await startScraping();

      if (response.status === 200) {
        setResponseResult("El scraping ha sido iniciado correctamente");
      } else if (response.status === 204) {
        setResponseResult("El scraping se encuentra actualmente en ejecución");
      } else {
        setResponseResult("Ha ocurrido un error al iniciar el scraping");
      }
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setResponseResult("Ha ocurrido un error al iniciar el scraping");
      setIsDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md py-4 px-8">
      <nav className="flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Picscrap
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {session && (
            <>
              <Button
                variant="outline"
                onClick={handleApiCall}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Iniciar Scraping"
                )}
              </Button>
              <Link
                href="/products"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Products
              </Link>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">{session.user.name}</div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>API Response</DialogTitle>
            <DialogDescription>{responseResult}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <pre className="text-sm overflow-auto">{responseResult}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
