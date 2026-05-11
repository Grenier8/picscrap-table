import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Body = {
  baseProductId: number | null;
  correlationVerified: boolean;
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "id must be a number" }, { status: 400 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { baseProductId, correlationVerified } = body;
  if (
    typeof correlationVerified !== "boolean" ||
    (baseProductId !== null && typeof baseProductId !== "number")
  ) {
    return NextResponse.json(
      { error: "baseProductId must be number|null, correlationVerified must be boolean" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: { baseProductId, correlationVerified },
      include: {
        brand: { select: { name: true } },
        baseProduct: { select: { id: true, name: true, sku: true } },
      },
    });

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("Error updating correlation:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
