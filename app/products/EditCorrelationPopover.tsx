"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Product } from "@/lib/interfaces";

type SearchResult = {
  id: number;
  name: string;
  sku: string;
  price: number;
  image: string | null;
  brand: { name: string };
  correlationVerified: boolean;
  currentBaseProduct: { id: number; name: string; sku: string } | null;
};

type Props = {
  currentProduct: Product | null;
  baseProductId: number;
  webpageId: number;
  webpageName: string;
  onClose: () => void;
  onSaved: () => void;
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "CLP" }).format(amount);
}

export function EditCorrelationPopover({
  currentProduct,
  baseProductId,
  webpageId,
  webpageName,
  onClose,
  onSaved,
}: Props) {
  const [verified, setVerified] = useState<boolean>(currentProduct?.correlationVerified ?? true);
  const [userTouchedVerified, setUserTouchedVerified] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [pending, setPending] = useState<SearchResult | null>(null);
  const [unlinkConfirm, setUnlinkConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length === 0) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products/search?webpageId=${webpageId}&q=${encodeURIComponent(query)}&limit=20`
        );
        const json = await res.json();
        setResults(json.results ?? []);
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, webpageId]);

  useEffect(() => {
    if (pending && !userTouchedVerified) setVerified(true);
  }, [pending, userTouchedVerified]);

  const warning = useMemo(() => {
    if (!pending?.currentBaseProduct) return null;
    if (pending.currentBaseProduct.id === baseProductId) return null;
    return `This product is currently linked to "${pending.currentBaseProduct.name}". Saving will move it here.`;
  }, [pending, baseProductId]);

  async function save() {
    setBusy(true);
    try {
      const targetId = pending?.id ?? currentProduct?.id;
      if (!targetId) {
        onClose();
        return;
      }
      await fetch(`/api/products/${targetId}/correlation`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseProductId, correlationVerified: verified }),
      });
      onSaved();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  async function unlink() {
    if (!currentProduct) return;
    setBusy(true);
    try {
      await fetch(`/api/products/${currentProduct.id}/correlation`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseProductId: null, correlationVerified: false }),
      });
      onSaved();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-96 space-y-3 p-1">
      <div className="font-medium">Edit correlation · {webpageName}</div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={verified}
          onCheckedChange={(v) => {
            setUserTouchedVerified(true);
            setVerified(Boolean(v));
          }}
        />
        Mark correlation as verified
      </label>

      {currentProduct && (
        <div className="rounded border p-2">
          <div className="text-xs text-muted-foreground mb-1">Currently correlated:</div>
          <div className="flex items-center gap-2">
            <Image
              src={currentProduct.image || "/logo-square.png"}
              alt=""
              width={32}
              height={32}
              className="rounded"
            />
            <div className="text-sm min-w-0 flex-1 truncate">
              {currentProduct.name} · {currentProduct.sku}
            </div>
            {!unlinkConfirm ? (
              <Button size="sm" variant="outline" onClick={() => setUnlinkConfirm(true)}>
                Unlink
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button size="sm" variant="destructive" disabled={busy} onClick={unlink}>
                  Yes
                </Button>
                <Button size="sm" variant="outline" onClick={() => setUnlinkConfirm(false)}>
                  No
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Input
          placeholder={`Search products in ${webpageName}…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="max-h-64 overflow-y-auto rounded border">
          {isSearching && (
            <div className="p-2 text-xs text-muted-foreground">Searching…</div>
          )}
          {!isSearching && results.length === 0 && query.length > 0 && (
            <div className="p-2 text-xs text-muted-foreground">No results.</div>
          )}
          {results.map((r) => {
            const isCurrent = currentProduct?.id === r.id;
            const linkedElsewhere =
              r.currentBaseProduct && r.currentBaseProduct.id !== baseProductId;
            const isPending = pending?.id === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setPending(r)}
                className={[
                  "flex w-full items-center gap-2 p-2 text-left text-sm hover:bg-accent",
                  isCurrent ? "border-l-2 border-blue-500" : "",
                  linkedElsewhere ? "bg-muted/50" : "",
                  isPending ? "ring-1 ring-primary" : "",
                ].join(" ")}
              >
                <Image
                  src={r.image || "/logo-square.png"}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate">{r.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.sku} · {formatPrice(r.price)}
                  </div>
                  {isCurrent && (
                    <div className="text-xs text-blue-600">← currently linked</div>
                  )}
                  {linkedElsewhere && r.currentBaseProduct && (
                    <div className="text-xs text-amber-600">
                      ⚠ Linked to "{r.currentBaseProduct.name}"
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {warning && (
        <div className="rounded border border-amber-400 bg-amber-50 p-2 text-xs text-amber-900">
          {warning}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button size="sm" disabled={busy} onClick={save}>Save</Button>
      </div>
    </div>
  );
}
