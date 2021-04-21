import { Product } from "../../product.interface";

export interface IWebsite {
  website: string;
  searchProduct(
    searchKey: string
  ): Promise<{
    success: boolean;
    categories: [];
    brands: [];
    data: Product[];
    error: string;
  }>;
  searchProductFeatured(
    searchKey: string,
    category: string,
    brand: string
  ): Promise<Product[]>;
}
