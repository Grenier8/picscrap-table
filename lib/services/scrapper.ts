interface ScrapeTriggerResponse {
  result: string;
  status: number;
  message: string;
}

export enum EFilteringType {
  SKU = "SKU",
  SIMILARITY = "SIMILARITY",
  OPENAI = "OPENAI",
  NONE = "NONE",
}

export enum EScrapType {
  FULL = "FULL",
  LITE = "LITE",
  PRICE = "PRICE",
}

export async function startScraping(
  webpageIds: number[],
  scrapType: EScrapType,
  filteringType: EFilteringType
): Promise<ScrapeTriggerResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_SCRAPER_URL || "";
    const apiKey = process.env.NEXT_PUBLIC_SCRAPER_API_KEY || "";
    if (!apiUrl || !apiKey) {
      throw new Error("Scraper URL or API key is not configured");
    }

    const response = await fetch(`${apiUrl}/api/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        webpageIds,
        scrapType,
        filteringType,
      }),
    });

    if (response.status === 204) {
      return {
        result: "success",
        status: response.status,
        message: "El scraping se encuentra actualmente en ejecución",
      };
    }
    if (!response.ok) {
      console.error("API call failed:", response.status);
    }

    const data = await response.json();
    return {
      result: "success",
      status: response.status,
      message: data.message || "",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("API call failed:", errorMessage);
    return {
      result: "error",
      status: 500,
      message: errorMessage,
    };
  }
}
