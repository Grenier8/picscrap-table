export interface Product {
  name: string;
  sku: string;
  link: string;
  price: number;
  webpageId: number;
  outOfStock: boolean | null;
  image: string;
  brand: Brand;
}

export interface Brand {
  name: string;
}

export interface Webpage {
  id: number;
  name: string;
  url: string;
  isBasePage: boolean;
}

export interface BaseProduct {
  name: string;
  link: string;
  price: number;
  outOfStock: boolean | null;
  image: string;
  brand: Brand;
  sku: string;
  products: Product[];
}

export interface Log {
  id?: number;
  executionId: string;
  type: string;
  webpage: string;
  event: string;
  message: string;
  duration?: number;
  url?: string;
  data: string;
  createdAt: string;
}

export interface ScrapingResults {
  date: string;
  status: string;
  startTime: string;
  endTime: string;
  duration: number;
  webpages: string[];
}
