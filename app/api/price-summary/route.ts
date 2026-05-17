import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const webpages = (await prisma.webpage.findMany()).filter(
      (page) => !page.isBasePage
    );
    const baseProducts = await prisma.baseProduct.findMany({
      include: {
        products: {
          include: {
            webpage: true,
          },
        },
      },
    });

    const pageStats: Record<
      string,
      {
        higher: number;
        lower: number;
        equal: number;
        pageName: string;
        higherStock: number;
        lowerStock: number;
        equalStock: number;
      }
    > = {};
    webpages.forEach((webpage) => {
      pageStats[webpage.id] = {
        higher: 0,
        lower: 0,
        equal: 0,
        pageName: webpage.name,
        higherStock: 0,
        lowerStock: 0,
        equalStock: 0,
      };
    });

    baseProducts.forEach((baseProduct) => {
      const basePrice = baseProduct.price;

      baseProduct.products.forEach((product) => {
        if (product.price > basePrice) {
          pageStats[product.webpageId].higher++;
        } else if (product.price < basePrice) {
          pageStats[product.webpageId].lower++;
        } else {
          pageStats[product.webpageId].equal++;
        }

        const baseStock = baseProduct.stockAmount;
        const productStock = product.stockAmount;

        if (baseStock !== null && productStock !== null) {
          if (productStock > baseStock) {
            pageStats[product.webpageId].higherStock++;
          } else if (productStock < baseStock) {
            pageStats[product.webpageId].lowerStock++;
          } else {
            pageStats[product.webpageId].equalStock++;
          }
        }
      });
    });

    const result = Object.entries(pageStats).map(([pageId, stats]) => ({
      pageId: parseInt(pageId),
      pageName: stats.pageName,
      higherPriceCount: stats.higher,
      lowerPriceCount: stats.lower,
      equalPriceCount: stats.equal,
      totalProducts: stats.higher + stats.lower + stats.equal,
      higherStockCount: stats.higherStock,
      lowerStockCount: stats.lowerStock,
      equalStockCount: stats.equalStock,
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
