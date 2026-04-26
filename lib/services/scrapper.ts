interface ScrapeTriggerResponse {
  result: string;
  status: number;
  message: string;
}

export enum EFilteringType {
  SKU = "SKU",
  SIMILARITY = "SIMILARITY",
  OPENAI = "OPENAI",
  PIPELINE = "PIPELINE",
  PIPELINE_LITE = "PIPELINE-LITE",
  NONE = "NONE",
}

export enum EScrapType {
  FULL = "FULL",
  LITE = "LITE",
  PRICE = "PRICE",
}

export enum EMatchMode {
  NEW = "NEW",
  FULL = "FULL",
}

export async function startScraping(
  webpageIds: number[],
  scrapType: EScrapType,
  matchAfterScrape?: boolean,
  filteringType?: EFilteringType,
  matchMode?: EMatchMode
): Promise<ScrapeTriggerResponse> {
  try {
    const response = await fetch("/api/trigger-scraping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        webpageIds,
        scrapType,
        ...(matchAfterScrape !== undefined ? { matchAfterScrape } : {}),
        ...(filteringType !== undefined ? { filteringType } : {}),
        ...(matchMode !== undefined ? { matchMode } : {}),
      }),
    });

    if (response.status === 204) {
      return {
        result: "busy",
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
    return { result: "error", status: 500, message: errorMessage };
  }
}

export async function startMatching(
  webpageIds: number[],
  filteringType: EFilteringType,
  matchMode: EMatchMode
): Promise<ScrapeTriggerResponse> {
  try {
    const response = await fetch("/api/trigger-matching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webpageIds, filteringType, matchMode }),
    });

    if (response.status === 204) {
      return {
        result: "busy",
        status: 204,
        message: "El matching se encuentra actualmente en ejecución",
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
    return { result: "error", status: 500, message: errorMessage };
  }
}
