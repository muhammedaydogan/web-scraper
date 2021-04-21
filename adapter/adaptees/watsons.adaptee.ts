import { Product } from "../../product.interface";
import { IWebsite } from "../interfaces/website.interface";
import { Watsons } from "../vendor-classes/watsons";

export class WatsonsAdapter implements IWebsite {
  website: string;
  watsons: Watsons;

  constructor() {
    this.website = "Watsons";
    this.watsons = new Watsons();
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
    let products = await this.watsons.searchWatsons(searchKey);
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
    let products = await this.watsons.searchWatsonsFeatured(
      searchKey,
      category,
      brand
    );
    // Turn products to productsCompatible
    // Fill here

    let productsDemo = [
      {
        website: this.website,
        name: "watsons",
        price: 123,
        currency: "string",
        brand: "string",
        freeShipping: true,
        imageLinks: ["img1", "img2"],
      },
    ] as Product[];
    return productsDemo;
  }
}
