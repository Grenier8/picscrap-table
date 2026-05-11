"use client";

import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CorrelationHoverCard } from "./CorrelationHoverCard";
import { EditCorrelationPopover } from "./EditCorrelationPopover";
import { Product } from "@/lib/interfaces";

type Props = {
  product: Product | null;
  basePrice: number;
  baseProductId: number;
  webpageId: number;
  webpageName: string;
  onChanged: () => void;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "CLP" }).format(amount);
}

export function CorrelationCell({
  product, basePrice, baseProductId, webpageId, webpageName, onChanged,
}: Props) {
  const [editing, setEditing] = useState(false);

  const amount = product ? product.price : -1;
  const formatted = amount === -1 ? "-" : formatPrice(amount);
  const colorClass =
    amount === -1 || amount === basePrice
      ? ""
      : amount < basePrice
      ? "text-red-500"
      : "text-green-500";
  const diffIndicator =
    amount === -1 || amount === basePrice ? "" : amount < basePrice ? " ↓" : " ↑";

  const priceContent = (
    <span className={`inline-flex items-center gap-2 font-medium ${colorClass}`}>
      {product?.link ? (
        <a href={product.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
          {formatted}{diffIndicator}
        </a>
      ) : (
        <span>{formatted}{diffIndicator}</span>
      )}
      {product && (
        <span
          aria-label={product.correlationVerified ? "Verified" : "Not verified"}
          title={product.correlationVerified ? "Verified by user" : "Not verified"}
          className={[
            "inline-block h-2 w-2 rounded-full",
            product.correlationVerified ? "bg-green-500" : "bg-gray-400",
          ].join(" ")}
        />
      )}
    </span>
  );

  if (editing) {
    return (
      <Popover open onOpenChange={(o) => !o && setEditing(false)}>
        <PopoverTrigger asChild>
          <span className="cursor-pointer text-right block">{priceContent}</span>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto">
          <EditCorrelationPopover
            currentProduct={product}
            baseProductId={baseProductId}
            webpageId={webpageId}
            webpageName={webpageName}
            onClose={() => setEditing(false)}
            onSaved={onChanged}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer text-right block">{priceContent}</span>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-auto">
        <CorrelationHoverCard
          product={product}
          webpageName={webpageName}
          onEdit={() => setEditing(true)}
        />
      </HoverCardContent>
    </HoverCard>
  );
}
