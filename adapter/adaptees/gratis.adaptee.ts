import { Product } from "../../product.interface";
import { IWebsite } from "../interfaces/website.interface";
import { Gratis } from "../vendor-classes/gratis";

export class GratisAdapter implements IWebsite {
  website: string;
  gratis: Gratis;

  constructor() {
    this.website = "Gratis";
    this.gratis = new Gratis();
  }

  async searchProduct(
    searchKey: string
  ): Promise<{
    success: boolean;
    categories: [];
    brands: [];
    data: Product[];
    error: string;
  }> {
    let products = this.gratis.searchGratis(searchKey);
    // Turn products to productsCompatible
    // Fill here
    let productsCompatible = [] as Product[];
    let result = {
      success: true,
      categories: [] as [],
      brands: [] as [],
      data: productsCompatible,
      error: "",
    };
    return result;
  }

  async searchProductFeatured(
    searchKey: string,
    category: string,
    brand: string
  ): Promise<Product[]> {
    let products = await this.gratis.searchGratisFeatured(
      searchKey,
      category,
      brand
    );
    let productsCompatible = [
      {
        website: this.website,
        name: "gratis",
        price: 123,
        currency: "string",
        brand: "string",
        freeShipping: true,
        imageLinks: ["img1", "img2"],
      },
    ] as Product[];
    return productsCompatible;
  }
}
