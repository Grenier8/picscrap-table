import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const webpageIdRaw = searchParams.get("webpageId");
  const q = searchParams.get("q")?.trim();
  const limitRaw = searchParams.get("limit");

  if (!webpageIdRaw || !q) {
    return NextResponse.json(
      { error: "webpageId and q are required" },
      { status: 400 }
    );
  }

  const webpageId = Number(webpageIdRaw);
  if (Number.isNaN(webpageId)) {
    return NextResponse.json({ error: "webpageId must be a number" }, { status: 400 });
  }

  const limit = Math.min(Math.max(Number(limitRaw ?? 20) || 20, 1), 50);

  try {
    const results = await prisma.product.findMany({
      where: {
        webpageId,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { sku: { contains: q, mode: "insensitive" } },
        ],
      },
      include: {
        brand: { select: { name: true } },
        baseProduct: { select: { id: true, name: true, sku: true } },
      },
      take: limit,
      orderBy: { name: "asc" },
    });

    const shaped = results.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      price: p.price,
      image: p.image,
      brand: p.brand,
      correlationVerified: p.correlationVerified,
      currentBaseProduct: p.baseProduct ?? null,
    }));

    return NextResponse.json({ results: shaped });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
