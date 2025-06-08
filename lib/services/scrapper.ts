interface ScrapeTriggerResponse {
  result: string;
  status: number;
  message: string;
}

export async function startScraping(): Promise<ScrapeTriggerResponse> {
  try {
    const response = await fetch(
      process.env.SCRAPER_URL + "/api/functions/scrape",
      {
        method: "POST",
      }
    );

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
