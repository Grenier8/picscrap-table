import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const webpages = await prisma.webpage.findMany({
  });

  return NextResponse.json({ webpages });
}
