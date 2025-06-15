"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Log, ScrapingResults } from "@/lib/interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { NewScrapingDialog } from "./new-scraping-dialog";

export default function ProductList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [scrapingResults, setScrapingResults] = useState<ScrapingResults[]>([]);
  const [columns, setColumns] = useState<ColumnDef<ScrapingResults>[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES");
  };

  const fetchScrapingLogs = useCallback(async () => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/");
      return;
    }

    setIsRefreshing(true);
    try {
      setColumns(getColumns());
      const response = await fetch("/api/logs");
      const data = await response.json();

      const startLogs = data.logs.filter(
        (log: Log) => log.event === "scrap-start"
      );
      const endLogs = data.logs.filter((log: Log) => log.event === "scrap-end");

      const scrapingResults: ScrapingResults[] = startLogs.map(
        (startLog: Log) => {
          const endLog = endLogs.find(
            (endLog: Log) =>
              endLog.event === "scrap-end" &&
              endLog.executionId === startLog.executionId
          );
          const timePassed =
            new Date().getTime() - new Date(startLog.createdAt).getTime();
          const failed = timePassed > 60 * 60 * 1000 * 8;

          return {
            date: formatDate(startLog.createdAt),
            startTime: formatTime(startLog.createdAt),
            endTime: endLog ? formatTime(endLog.createdAt) : "-",
            status: endLog ? "FINALIZADO" : failed ? "FALLIDO" : "EN_PROGRESO",
            duration: endLog
              ? ((endLog.duration / 60).toFixed(2) as string) + " h"
              : "-",
            webpages: startLog.webpage ? [startLog.webpage] : [],
          };
        }
      );

      setScrapingResults(scrapingResults);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchScrapingLogs();
  }, [fetchScrapingLogs]);

  if (status === "loading" || !session || columns.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center py-6 px-8">
      <div className="flex justify-center items-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Historial de Scraping
        </h1>
      </div>

      <div className="flex flex-col justify-between items-center mb-6 w-full">
        <div className="flex gap-2 mb-4 justify-end w-4/5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={fetchScrapingLogs}
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span>Actualizar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Actualizar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NewScrapingDialog
                  onScrapingStarted={fetchScrapingLogs}
                  asChild
                >
                  <Button variant="outline">
                    <Plus className="h-4 w-4" />
                    <span>Nuevo Scraping</span>
                  </Button>
                </NewScrapingDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nuevo Scraping</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <DataTable columns={columns} data={scrapingResults} />
      </div>
    </div>
  );
}
