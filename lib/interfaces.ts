export interface Product {
    name: string;
    link: string;
    price: string;
    outOfStock: boolean | null;
    image: string;
    brand: string;
    sku: string;
  };
  
  export interface Page {
    name: string;
    id: string;
    url: string;
    dbPort?: number;
  }

  export interface ListProduct {
    name: string;
    link: string;
    price: string;
    outOfStock: boolean | null;
    image: string;
    brand: string;
    sku: string;
  };