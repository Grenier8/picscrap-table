import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const webpages = await prisma.webpage.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({ webpages });
  } catch (error) {
    console.error("Error fetching webpages:", error);
    return NextResponse.json(
      { error: "Error al obtener las páginas web" },
      { status: 500 }
    );
  }
}
