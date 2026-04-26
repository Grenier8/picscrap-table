import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const scraperUrl = process.env.SCRAPER_URL;
  const scraperApiKey = process.env.SCRAPER_API_KEY;

  if (!scraperUrl || !scraperApiKey) {
    return NextResponse.json(
      { result: "error", status: 500, message: "Scraper not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const response = await fetch(`${scraperUrl}/api/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": scraperApiKey,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 204) {
      return NextResponse.json(
        {
          result: "busy",
          status: 204,
          message: "El scraping se encuentra actualmente en ejecución",
        },
        { status: 204 }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      { result: "success", status: response.status, message: data.message || "" },
      { status: response.status }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { result: "error", status: 500, message },
      { status: 500 }
    );
  }
}
