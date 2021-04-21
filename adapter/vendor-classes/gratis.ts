import { IWebsiteGratis } from "../interfaces/website-gratis.interface";

export class Gratis implements IWebsiteGratis {
  async searchGratis(searchKey: string): Promise<{}> {
    return [
      {
        name: "gratis",
        price: 123,
        currency: "string",
        brand: "string",
        freeShipping: true,
        imageLinks: ["img1", "img2"],
      },
    ];
  }

  async searchGratisFeatured(
    searchKey: string,
    category: string,
    brand: string
  ): Promise<{}> {
    return { data: "gratis featured search" };
  }
}
