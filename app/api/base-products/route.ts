import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const baseProducts = await prisma.baseProduct.findMany({
    include: {
      brand: true,
      products: true,
    },
  });

  return NextResponse.json({ baseProducts });
}
