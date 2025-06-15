import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseProducts = await prisma.baseProduct.findMany({
      include: {
        brand: true,
        products: true,
      },
    });

    return NextResponse.json({ baseProducts });
  } catch (error) {
    console.error("Error fetching base products:", error);
    return NextResponse.json(
      { error: "Error al obtener los productos base" },
      { status: 500 }
    );
  }
}
