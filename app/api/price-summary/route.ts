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
      { higher: number; lower: number; equal: number; pageName: string }
    > = {};
    webpages.forEach((webpage) => {
      pageStats[webpage.id] = {
        higher: 0,
        lower: 0,
        equal: 0,
        pageName: webpage.name,
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
      });
    });

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
