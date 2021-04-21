import { Product } from "./product.interface";
import { IWebsite } from "./adapter/interfaces/website.interface";
import { Trendyol } from "./adapter/our-classes/trendyol";

export async function search(searchKey: string) {
  let res = { categories: [], brands: [], data: [] as Product[], error: "" };

  let trendyol = new Trendyol();
  let result = await trendyol.searchProduct("ruj");
  console.log(result);
}
