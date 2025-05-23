"use client";

import { BaseProduct } from "@/lib/interfaces";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";

// function getData(): BaseProduct[] {
// // Fetch data from your API here.
// return [
//   {
//     name: "Estabilizador DJI RS4 Mini - Combo",
//     link: "https://picslabstore.cl/estabilizador-dji-rs-4-mini-combo",
//     price: "564990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/60359305/resize/306/306?1740061211",
//     brand: "DJI",
//     sku: "1000009063",
//   },
//   {
//     name: "Estabilizador DJI RS4 Mini",
//     link: "https://picslabstore.cl/estabilizador-dji-rs-4-mini",
//     price: "459990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/60359266/resize/306/306?1740059520",
//     brand: "DJI",
//     sku: "1000009062",
//   },
//   {
//     name: "Estabilizador DJI Osmo Mobile 7P",
//     link: "https://picslabstore.cl/estabilizador-dji-osmo-mobile-7p",
//     price: "199990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/60281130/resize/306/306?1739884710",
//     brand: "DJI",
//     sku: "1000009061",
//   },
//   {
//     name: "Estabilizador DJI Osmo Mobile 7",
//     link: "https://picslabstore.cl/estabilizador-dji-osmo-mobile-7",
//     price: "125990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/60281484/resize/306/306?1739885469",
//     brand: "DJI",
//     sku: "1000009060",
//   },
//   {
//     name: "Cámara Mirrorless Canon EOS R5 Mark II - Body",
//     link: "https://picslabstore.cl/camara-mirrorless-canon-eos-r5-mark-ii-body",
//     price: "519990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/51477920/resize/306/306?1723045107",
//     brand: "CANON",
//     sku: "6536C003",
//   },
//   {
//     name: "Cámara Mirrorless Canon EOS R6 Mark II - Body",
//     link: "https://picslabstore.cl/camara-mirrorless-canon-eos-r6-mark-ii-body",
//     price: "239990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/39747823/resize/306/306?1694726845",
//     brand: "CANON",
//     sku: "5666C003",
//   },
//   {
//     name: "Cámara Mirrorless Canon EOS R7 + Lente 18-150mm",
//     link: "https://picslabstore.cl/camara-mirrorless-canon-eos-r7-lente-18-150mm",
//     price: "224990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/45500674/resize/306/306?1707846460",
//     brand: "CANON",
//     sku: "5137C009",
//   },
//   {
//     name: "Cámara Mirrorless Canon EOS R10 + Lente 18-150mm",
//     link: "https://picslabstore.cl/camara-mirrorless-canon-eos-r10-lente-18-150mm",
//     price: "169990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/42601148/resize/306/306?1700840819",
//     brand: "CANON",
//     sku: "5331C016",
//   },
//   {
//     name: "Cámara Mirrorless Canon EOS R7 - Body",
//     link: "https://picslabstore.cl/camara-mirrorless-canon-eos-r7-body",
//     price: "179990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/30772523/resize/306/306?1673354649",
//     brand: "CANON",
//     sku: "5137C002",
//   },
//   {
//     name: "Cámara Mirrorless Canon EOS R50 - Premium Kit",
//     link: "https://picslabstore.cl/camara-mirrorless-canon-eos-r50-premium-kit",
//     price: "124990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/46789140/resize/306/306?1711119441",
//     brand: "CANON",
//     sku: "5811C022",
//   },
//   {
//     name: "Cámara Mirrorless Canon EOS R50 + Lente 18-45mm",
//     link: "https://picslabstore.cl/canon-eos-r50-aps-c-con-lente-rf-18-45mm",
//     price: "89990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/35131482/resize/306/306?1683912151",
//     brand: "CANON",
//     sku: "5811C012",
//   },
//   {
//     name: "Cámara Mirrorless Canon EOS R100 + Lente 18-45mm",
//     link: "https://picslabstore.cl/eos-r100-rf-s-18-45mm-f45-63-is-stm",
//     price: "74990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/40227338/resize/306/306?1695751841",
//     brand: "CANON",
//     sku: "6052C012",
//   },
//   {
//     name: "Lente Sigma 56mm f/1.4 DC DN Contemporary - Sony E",
//     link: "https://picslabstore.cl/lente-sigma-56mm-sony-e-f14-dc-dn-cont",
//     price: "519990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/30123844/resize/306/306?1670603199",
//     brand: "SIGMA",
//     sku: "SG20236",
//   },
//   {
//     name: "Micrófono Dinámico RODE PodMic",
//     link: "https://picslabstore.cl/microfono-dinamico-rode-podmic",
//     price: "158990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/35514453/resize/306/306?1684768209",
//     brand: "RODE",
//     sku: "PODMIC",
//   },
//   {
//     name: "Cámara Mirrorless Sony A7iii - Body",
//     link: "https://picslabstore.cl/camara-sony-a7iii-body",
//     price: "158990",
//     outOfStock: null,
//     image:
//       "https://cdnx.jumpseller.com/picslab-store/image/37503810/resize/306/306?1689090963",
//     brand: "SONY",
//     sku: "ILCE-7M3/B",
//   },
// ];

// const products = awa;

// return [];
// }

export default function ProductList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [baseProducts, setBaseProducts] = useState<BaseProduct[]>([]);

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
  }, [session, status, router]);

  if (status === "loading" || !session) return null;

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center py-5 px-8">
      <DataTable columns={columns} data={baseProducts} />
    </div>
  );
}
