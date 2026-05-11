"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/interfaces";

type Props = {
  product: Product | null;
  webpageName: string;
  onEdit: () => void;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "CLP" }).format(amount);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

export function CorrelationHoverCard({ product, webpageName, onEdit }: Props) {
  if (!product) {
    return (
      <div className="w-72 space-y-3">
        <div className="font-medium">Sin correlación aún</div>
        <p className="text-sm text-muted-foreground">
          Este producto base no tiene coincidencia en <span className="font-medium">{webpageName}</span>.
        </p>
        <Button size="sm" onClick={onEdit}>Editar</Button>
      </div>
    );
  }

  return (
    <div className="w-80 space-y-3">
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image || "/logo-square.png"}
          alt=""
          width={64}
          height={64}
          referrerPolicy="no-referrer"
          className="rounded object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="font-medium truncate">{product.name}</div>
          <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
          <div className="text-xs text-muted-foreground">
            {product.brand?.name ?? "-"} · {formatPrice(product.price)}
          </div>
          <div className="text-xs text-muted-foreground">
            Actualizado {formatDate(product.updatedAt)}
          </div>
        </div>
      </div>

      <div>
        {product.correlationVerified ? (
          <Badge className="bg-green-600 hover:bg-green-600">Verificado por usuario</Badge>
        ) : (
          <Badge variant="secondary">No verificado</Badge>
        )}
      </div>

      <div className="flex gap-2">
        {product.link && (
          <a href={product.link} target="_blank" rel="noreferrer">
            <Button size="sm" variant="outline">Abrir página del producto ↗</Button>
          </a>
        )}
        <Button size="sm" onClick={onEdit}>Editar</Button>
      </div>
    </div>
  );
}
