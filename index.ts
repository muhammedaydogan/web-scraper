import { Trendyol } from "./adapter/our-classes/trendyol";
import { GratisAdapter } from "./adapter/adaptees/gratis.adaptee";
import { WatsonsAdapter } from "./adapter/adaptees/watsons.adaptee";

export async function search(searchKey: string) {
  let result = { trendyol: {}, gratis: {}, watsons: {} };

  let trendyol = new Trendyol();
  let gratis = new GratisAdapter();
  let watsons = new WatsonsAdapter();

  [result.trendyol, result.gratis, result.watsons] = await Promise.all([
    trendyol.searchProduct(searchKey),
    gratis.searchProduct(searchKey),
    watsons.searchProduct(searchKey),
  ]);

  return result;
}

export async function searchFeatured(
  searchKey: string,
  category: string,
  brand: string
) {
  let result = { trendyol: {}, gratis: {}, watsons: {} };

  let trendyol = new Trendyol();
  let gratis = new GratisAdapter();
  let watsons = new WatsonsAdapter();

  [result.trendyol, result.gratis, result.watsons] = await Promise.all([
    trendyol.searchProductFeatured(searchKey, category, brand),
    gratis.searchProductFeatured(searchKey, category, brand),
    watsons.searchProductFeatured(searchKey, category, brand),
  ]);

  return result;
}
