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
    searchKey: string,
    category: string,
    brand: string
  ): Promise<{
    success: boolean;
    categories: [];
    brands: [];
    data: Product[];
    error: string;
  }> {
    let products = await this.gratis.searchGratis(searchKey,category, brand);
    // Turn products to productsCompatible
    let productsCompatible = [] as Product[];
    products.data.forEach(product => {
      productsCompatible.push({
        website: this.website,
        name: product['title'],
        price: product['price'],
        currency: product['currency'],
        brand: '',
        freeShipping: false,
        imageLinks: [product['image_link']],
      });
    });
    let result = {
      success: true,
      categories: products.categories,
      brands: products.brands,
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
    // Turn products to productsCompatible
    // TODO Fill Here

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
