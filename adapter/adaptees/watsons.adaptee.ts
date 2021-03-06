import { Product } from "../interfaces/product.interface";
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
    let products = await this.watsons.searchWatsons(
      searchKey,
      this.trendyol2WatsonsCategories.hasOwnProperty(category)
        ? this.trendyol2WatsonsCategories[category]
        : "",
      this.trendyol2WatsonsBrands.hasOwnProperty(brand)
        ? trendyol2WatsonsBrands[brand]
        : ""
    );
    let productsCompatible = [] as Product[];
    products.data.forEach((product) => {
      productsCompatible.push({
        website: this.website,
        name: product["title"],
        price: product["price"],
        currency: product["currency"],
        brand: product["brand"],
        freeShipping: false,
        imageLinks: [product["image_link"]],
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

  trendyol2WatsonsCategories = {
    "100": "4810",
    "1347": "6516",
    "1252": "4811",
    "1346": "6515",
    "109451": "3631,3647",
    "108961": "4929,3556,4928,4903,4929,4930",
    "1059": "3556",
    "1114": "3555",
    "1050": "3558",
    "1089": "3557",
    "1060": "3551",
    "104016": "3640",
    "1085": "4928",
    "1053": "3562",
    "104017": "4903",
    "999": "4929",
    "101415": "3638",
    "1153": "3560",
    "104018": "4930",
    "109100": "3638",
    "1253": "3579",
    "1110": "3571",
    "109114": "3591",
    "109115": "3555",
    "1156": "3552",
    "108729": "3554",
    "1042": "3553",
    "1124": "3631",
    "109357": "3647",
    "109101": "6518",
    "108970": "6516",
    "143962": "6516",
  };
  trendyol2WatsonsBrands = {
    "476": "1108",
    "568": "1098",
    "988": "1041",
    "624": "1158",
    "101666": "1050",
    "102168": "1119",
    "104624": "5092",
    "102040": "5128",
    "104618": "966",
    "475": "1104",
    "104729": "1093",
    "132515": "4798",
    "104727": "1362",
    "108750": "5764",
    "104617": "859",
    "102471": "1078",
    "888": "1351",
    "111520": "5166",
    "109061": "4165",
    "102420": "1082",
    "105288": "881",
    "862": "1507",
    "472": "1043",
    "102421": "1434",
    "101567": "1478",
    "102504": "902",
    "102011": "947",
    "102503": "5258",
    "102661": "1502",
    "108813": "4974",
    "101658": "1070",
    "886": "934",
    "102461": "1151",
    "132517": "5195",
  };

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
    // TODO Fill Here

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
