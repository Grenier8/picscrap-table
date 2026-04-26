"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  EFilteringType,
  EMatchMode,
  EScrapType,
  startMatching,
  startScraping,
} from "@/lib/services/scrapper";
import { useEffect, useState } from "react";

interface Webpage {
  id: number;
  name: string;
  url: string;
}

interface NewScrapingDialogProps {
  onScrapingStarted?: () => void;
  asChild?: boolean;
  children?: React.ReactNode;
}

export function NewScrapingDialog({
  onScrapingStarted,
  asChild = false,
  children,
}: NewScrapingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [webpages, setWebpages] = useState<Webpage[]>([]);
  const [selectedWebpages, setSelectedWebpages] = useState<number[]>([]);
  const [scrapType, setScrapType] = useState<EScrapType>(EScrapType.FULL);
  const [filteringType, setFilteringType] = useState<EFilteringType>(
    EFilteringType.SIMILARITY
  );
  const [runScraping, setRunScraping] = useState(true);
  const [runMatching, setRunMatching] = useState(true);
  const [matchMode, setMatchMode] = useState<EMatchMode>(EMatchMode.NEW);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetch("/api/webpages")
        .then((res) => res.json())
        .then((data) => {
          setWebpages(data.webpages || []);
        })
        .catch((error) => {
          console.error("Error fetching webpages:", error);
          toast({
            title: "Error",
            description: "No se pudieron cargar las páginas web",
            variant: "destructive",
          });
        });
    }
  }, [open, toast]);

  const handleSubmit = async () => {
    if (selectedWebpages.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos una página web",
        variant: "destructive",
      });
      return;
    }
    if (!runScraping && !runMatching) {
      toast({
        title: "Error",
        description: "Selecciona al menos una operación",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let result;

      if (runScraping && runMatching) {
        result = await startScraping(
          selectedWebpages,
          scrapType,
          true,
          filteringType,
          matchMode
        );
      } else if (runScraping) {
        // Explicitly pass false so backend knows this is scrape-only (not legacy)
        result = await startScraping(selectedWebpages, scrapType, false);
      } else {
        result = await startMatching(selectedWebpages, filteringType, matchMode);
      }

      toast({
        title:
          result.status === 200
            ? "Éxito"
            : result.status === 204
            ? "Atención"
            : "Error",
        description:
          result.status === 200
            ? "La operación ha comenzado exitosamente"
            : result.status === 204
            ? "Una operación se encuentra actualmente en ejecución"
            : "Ha ocurrido un error al iniciar la operación",
        variant: result.status === 500 ? "destructive" : "default",
      });

      setOpen(false);
      onScrapingStarted?.();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo iniciar la operación",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWebpage = (webpageId: number) => {
    setSelectedWebpages((prev) =>
      prev.includes(webpageId)
        ? prev.filter((id) => id !== webpageId)
        : [...prev, webpageId]
    );
  };

  const selectAllWebpages = () => {
    if (selectedWebpages.length === webpages.length) {
      setSelectedWebpages([]);
    } else {
      setSelectedWebpages(webpages.map((w) => w.id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>
        {asChild ? children : <Button>Nuevo Scraping</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]  text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Nuevo Scraping</DialogTitle>
          <DialogDescription>
            Configura los parámetros para el nuevo proceso de scraping
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Operation checkboxes */}
          <div className="space-y-2">
            <Label>Operaciones</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="run-scraping"
                checked={runScraping}
                onCheckedChange={(checked) => setRunScraping(checked === true)}
              />
              <label htmlFor="run-scraping" className="text-sm font-medium leading-none">
                Scraping{" "}
                <span className="text-xs text-muted-foreground">
                  — raspar y guardar todos los productos en la base de datos
                </span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="run-matching"
                checked={runMatching}
                onCheckedChange={(checked) => setRunMatching(checked === true)}
              />
              <label htmlFor="run-matching" className="text-sm font-medium leading-none">
                Matching{" "}
                <span className="text-xs text-muted-foreground">
                  — correlacionar productos con la base de referencia
                </span>
              </label>
            </div>
          </div>

          {/* Scrap type — only when scraping */}
          {runScraping && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scrap-type" className="text-right">
                Tipo de Scraping
              </Label>
              <div className="col-span-3">
                <Select
                  value={scrapType}
                  onValueChange={(value) => setScrapType(value as EScrapType)}
                >
                  <SelectTrigger id="scrap-type">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EScrapType.LITE}>
                      <span className="font-bold">Sencillo</span>{" "}
                      <span className="text-xs">(Recomendado) - solo se añaden nuevas relaciones</span>
                    </SelectItem>
                    <SelectItem value={EScrapType.FULL}>
                      <span className="font-bold">Completo</span>{" "}
                      <span className="text-xs">- se restablecen todas las relaciones</span>
                    </SelectItem>
                    <SelectItem value={EScrapType.PRICE}>
                      <span className="font-bold">Precio</span>{" "}
                      <span className="text-xs">- solo se actualizan los precios</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Filtering + match mode — only when matching */}
          {runMatching && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="filtering-type" className="text-right">
                  Tipo de Filtrado
                </Label>
                <div className="col-span-3">
                  <Select
                    value={filteringType}
                    onValueChange={(value) => setFilteringType(value as EFilteringType)}
                  >
                    <SelectTrigger id="filtering-type">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EFilteringType.SIMILARITY}>
                        <span className="font-bold">Similitud</span>{" "}
                        <span className="text-xs">- se filtra usando similitud (nombre, sku, imagen)</span>
                      </SelectItem>
                      <SelectItem value={EFilteringType.SKU}>
                        <span className="font-bold">SKU</span>{" "}
                        <span className="text-xs">- se filtra por coincidencia exacta de código SKU</span>
                      </SelectItem>
                      <SelectItem value={EFilteringType.PIPELINE}>
                        <span className="font-bold">Pipeline</span>{" "}
                        <span className="text-xs">- pipeline multi-etapa: SKU + embeddings + LLM local</span>
                      </SelectItem>
                      <SelectItem value={EFilteringType.PIPELINE_LITE}>
                        <span className="font-bold">Pipeline Lite</span>{" "}
                        <span className="text-xs">- pipeline sin LLM: solo SKU + embeddings</span>
                      </SelectItem>
                      <SelectItem value={EFilteringType.OPENAI}>
                        <span className="font-bold">OPENAI</span> (De Pago){" "}
                        <span className="text-xs">- se filtra usando IA</span>
                      </SelectItem>
                      <SelectItem value={EFilteringType.NONE}>
                        <span className="font-bold">Sin Filtrado</span>{" "}
                        <span className="text-xs">- no se obtienen productos nuevos</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="match-mode" className="text-right">
                  Modo de Matching
                </Label>
                <div className="col-span-3">
                  <Select
                    value={matchMode}
                    onValueChange={(value) => setMatchMode(value as EMatchMode)}
                  >
                    <SelectTrigger id="match-mode">
                      <SelectValue placeholder="Selecciona un modo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EMatchMode.NEW}>
                        <span className="font-bold">Solo nuevos</span>{" "}
                        <span className="text-xs">- correlacionar solo productos sin asignación</span>
                      </SelectItem>
                      <SelectItem value={EMatchMode.FULL}>
                        <span className="font-bold">Desde cero</span>{" "}
                        <span className="text-xs">- borrar correlaciones existentes y recalcular</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Webpages selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Páginas Web</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAllWebpages}
                className="h-8 px-2 text-xs"
              >
                {selectedWebpages.length === webpages.length
                  ? "Desmarcar todas"
                  : "Seleccionar todas"}
              </Button>
            </div>
            <Card>
              <CardContent className="p-4 max-h-60 overflow-y-auto">
                {webpages.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No hay páginas web disponibles
                  </div>
                ) : (
                  <div className="space-y-2">
                    {webpages.map((webpage) => (
                      <div key={webpage.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`webpage-${webpage.id}`}
                          checked={selectedWebpages.includes(webpage.id)}
                          onCheckedChange={() => toggleWebpage(webpage.id)}
                        />
                        <label
                          htmlFor={`webpage-${webpage.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {webpage.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || webpages.length === 0 || (!runScraping && !runMatching)}
          >
            {loading ? "Iniciando..." : "Aceptar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
