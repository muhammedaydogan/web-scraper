import { IWebsiteWatsons } from "../interfaces/website-watsons.interface";

export class Watsons implements IWebsiteWatsons {
  async searchWatsons(searchKey: string): Promise<{}> {
    // TODO Fill Here

    return [
      {
        name: "watsons",
        price: 123,
        currency: "string",
        brand: "string",
        freeShipping: true,
        imageLinks: ["img1", "img2"],
      },
    ];
  }

  async searchWatsonsFeatured(
    searchKey: string,
    category: string,
    brand: string
  ): Promise<{}> {
    // TODO Fill Here

    return { data: "watsons featured search" };
  }
}
