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
    const response = await fetch("/api/trigger-scraping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webpageIds, scrapType, filteringType }),
    });

    if (response.status === 204) {
      return {
        result: "success",
        status: 204,
        message: "El scraping se encuentra actualmente en ejecución",
      };
    }

    const data = await response.json();
    return {
      result: response.ok ? "success" : "error",
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
