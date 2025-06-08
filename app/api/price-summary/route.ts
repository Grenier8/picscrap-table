import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Obtener todas las páginas web
    const webpages = (await prisma.webpage.findMany()).filter(
      (page) => !page.isBasePage
    );

    // Obtener todos los productos base con sus productos asociados
    const baseProducts = await prisma.baseProduct.findMany({
      include: {
        products: {
          include: {
            webpage: true,
          },
        },
      },
    });

    // Crear un mapa para almacenar las estadísticas por página
    const pageStats: Record<
      string,
      { higher: number; lower: number; equal: number; pageName: string }
    > = {};

    // Inicializar las estadísticas para cada página
    webpages.forEach((webpage) => {
      pageStats[webpage.id] = {
        higher: 0,
        lower: 0,
        equal: 0,
        pageName: webpage.name,
      };
    });

    // Procesar cada producto base
    baseProducts.forEach((baseProduct) => {
      const basePrice = baseProduct.price;

      // Para cada producto asociado, comparar con el precio base
      baseProduct.products.forEach((product) => {
        if (product.price > basePrice) {
          pageStats[product.webpageId].higher++;
        } else if (product.price < basePrice) {
          pageStats[product.webpageId].lower++;
        } else {
          pageStats[product.webpageId].equal++;
        }
      });
    });

    // Convertir el mapa a un array para la respuesta
    const result = Object.entries(pageStats).map(([pageId, stats]) => ({
      pageId: parseInt(pageId),
      pageName: stats.pageName,
      higherPriceCount: stats.higher,
      lowerPriceCount: stats.lower,
      equalPriceCount: stats.equal,
      totalProducts: stats.higher + stats.lower + stats.equal,
    }));

    return NextResponse.json({ summary: result });
  } catch (error) {
    console.error("Error fetching price summary:", error);
    return NextResponse.json(
      { error: "Error al obtener el resumen de precios" },
      { status: 500 }
    );
  }
}
