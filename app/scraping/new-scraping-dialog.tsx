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
  EScrapType,
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

    setLoading(true);
    try {
      const result = await startScraping(
        selectedWebpages,
        scrapType,
        filteringType
      );

      toast({
        title:
          result.status === 200
            ? "Éxito"
            : result.status === 204
            ? "Atención"
            : "Error",
        description:
          result.status === 200
            ? "El scraping ha comenzado exitosamente"
            : result.status === 204
            ? "El scraping se encuentra actualmente en ejecución"
            : "Ha ocurrido un error al iniciar el scraping",
        variant:
          result.status === 200
            ? "default"
            : result.status === 204
            ? "default"
            : "destructive",
      });

      setOpen(false);
      onScrapingStarted?.();
    } catch (error) {
      console.error("Error starting scraping:", error);
      toast({
        title: "Error",
        description: "No se pudo iniciar el scraping",
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
                    <span className="text-xs">
                      (Recomendado) - solo se añaden nuevas relaciones
                    </span>
                  </SelectItem>
                  <SelectItem value={EScrapType.FULL}>
                    <span className="font-bold">Completo</span>{" "}
                    <span className="text-xs">
                      - se restablecen todas las relaciones
                    </span>
                  </SelectItem>
                  <SelectItem value={EScrapType.PRICE}>
                    <span className="font-bold">Precio</span>{" "}
                    <span className="text-xs">
                      - solo se actualizan los precios
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filtering-type" className="text-right">
              Tipo de Filtrado
            </Label>
            <div className="col-span-3">
              <Select
                value={filteringType}
                onValueChange={(value) =>
                  setFilteringType(value as EFilteringType)
                }
              >
                <SelectTrigger id="filtering-type">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EFilteringType.SIMILARITY}>
                    <span className="font-bold">Similitud</span>{" "}
                    <span className="text-xs">
                      {" "}
                      - se filtra usando similitud (nombre, sku, imagen)
                    </span>
                  </SelectItem>
                  <SelectItem value={EFilteringType.OPENAI}>
                    <span className="font-bold">OPENAI</span> (De Pago){" "}
                    <span className="text-xs"> - se filtra usando IA</span>
                  </SelectItem>
                  <SelectItem value={EFilteringType.NONE}>
                    <span className="font-bold">Sin Filtrado</span>{" "}
                    <span className="text-xs">
                      {" "}
                      - no se obtienen productos nuevos
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                      <div
                        key={webpage.id}
                        className="flex items-center space-x-2"
                      >
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
            disabled={loading || webpages.length === 0}
          >
            {loading ? "Iniciando..." : "Aceptar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
