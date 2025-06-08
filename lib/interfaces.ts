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
