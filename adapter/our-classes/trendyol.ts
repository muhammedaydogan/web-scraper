import axios from "axios";
import domparser from "dom-parser";

const parser = new domparser();

import { Product } from "../interfaces/product.interface";
import { IWebsite } from "../interfaces/website.interface";

const preventError = (x: Function) => {
  try {
    const y = x();
    return y == undefined || y === null ? y + "" : y;
  } catch (error) {
    console.log(error.message);
    return "";
  }
};

export class Trendyol implements IWebsite {
  website: string;

  constructor() {
    this.website = "Trendyol";
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
    let res = {
      success: true,
      categories: [] as [],
      brands: [] as [],
      data: [] as Product[],
      error: "",
    };

    try {
      searchKey.replace(" ", "%20");
      // console.log(searchKey);
      let searchResult = await this.requestProduct(searchKey, category, brand);
      if (searchResult.error) {
        res.error = searchResult.error;
        res.success = false;
        return res;
      }
      res.data = searchResult.data;

      // Get Categories
      let searchResult2 = await this.requestCategories(searchKey, "100");
      if (searchResult2.error) {
        res.error = searchResult2.error;
        res.success = false;
        return res;
      }
      res.categories = searchResult2.categories;
      res.brands = searchResult2.brands;
    } catch (err) {
      res.error = err.message;
      res.success = false;
    }
    res.success = true;
    return res;

    // let result = {
    //   success: true,
    //   categories: [],
    //   brands: [],
    //   data: [
    //     {
    //       website: this.website,
    //       name: "string",
    //       price: 123,
    //       currency: "string",
    //       brand: "string",
    //       freeShipping: true,
    //       imageLinks: ["img1", "img2"],
    //     },
    //   ],
    //   error: "",
    // };
    // return result;
  }

  async searchProductFeatured(
    searchKey: string,
    category: string,
    brand: string
  ): Promise<Product[]> {
    let searchResult = [] as Product[];

    if (searchKey.length == 1) {
      throw new Error("Searching just one letter is not possible in Trendyol.");
    }

    if (!category) {
      category = "100";
    }

    console.log(
      `https://www.trendyol.com/sr?${category ? "wc=" + category + "&" : ""}${
        brand ? "wb=" + brand + "&" : ""
      }q=${searchKey}&qt=${searchKey}&st=${searchKey}`
    );

    await axios
      .get(
        `https://www.trendyol.com/sr?${category ? "wc=" + category + "&" : ""}${
          brand ? "wb=" + brand + "&" : ""
        }q=${searchKey}&qt=${searchKey}&st=${searchKey}` //&culture=tr-TR&storefrontId=1&categoryRelevancyEnabled=true&priceAggregationType=DYNAMIC_GAUSS&searchTestTypeAbValue=A`
      )
      .then((res: any) => {
        // console.log(res);
        // console.log(res.data.url);
        // console.log(res.data.explanation);
        let dom = parser.parseFromString(res.data);
        let productContainer = dom.getElementsByClassName(
          "prdct-cntnr-wrppr"
        )[0].childNodes;
        for (let i = 0; i < productContainer.length; i++) {
          const item = productContainer[i];
          let website = "trendyol";
          let name = preventError(
            () =>
              item.getElementsByClassName("prdct-desc-cntnr-name")[0].innerHTML
          );
          let price = preventError(() =>
            parseInt(
              item
                .getElementsByClassName("prc-box-sllng")[0]
                .innerHTML.split("<!-- -->")[0]
            )
          );
          let currency = preventError(
            () =>
              item
                .getElementsByClassName("prc-box-sllng")[0]
                .innerHTML.split("<!-- -->")[2]
          );
          let brand = preventError(
            () =>
              item.getElementsByClassName("prdct-desc-cntnr-ttl")[0].innerHTML
          );
          let freeShipping = preventError(
            () => item.getElementsByClassName("stmp fc")[0] != undefined
          );
          // let imageLink = preventError(
          //   () => item.getElementsByClassName("p-card-img")[0].src + ""
          // );
          let imageLinks = preventError(() => {
            let scripts = dom.getElementsByTagName("script");
            let imageLinksTemp = [];
            for (let script of scripts) {
              if (
                script.innerHTML.indexOf(
                  "window.__SEARCH_APP_INITIAL_STATE__"
                ) != -1
              ) {
                script = script.innerHTML.split(";");
                for (let e of script) {
                  if (e.indexOf("window.__SEARCH_APP_INITIAL_STATE__") != -1) {
                    e = JSON.parse(e.substring(e.indexOf("{")));
                    // ! MAIN INFO SOURCE
                    // console.log(e);
                    // console.log(e.products[0].price);
                    // console.log(e.products[0].images);
                    for (const image of e.products[i].images) {
                      // console.log(image);
                      imageLinksTemp.push(
                        e.configuration.cdnUrl + image.replace("_zoom", "")
                      );
                    }
                    break;
                  }
                }
                break;
              }
            }
            return imageLinksTemp;
          });

          searchResult.push({
            website: website,
            name: name,
            price: price,
            currency: currency,
            brand: brand,
            freeShipping: freeShipping,
            imageLinks: imageLinks,
          });
        }
      })
      .catch((err: any) => {
        console.log(err.message);
      });

    // console.log(data);
    return searchResult;
  }

  private async requestProduct(
    searchKey: string,
    category: string,
    brand: string
  ) {
    let result = { data: [] as Product[], error: "" };

    if (searchKey.length == 1) {
      throw new Error("Searching just one letter is not possible in Trendyol.");
    }

    if (!category || category.length == 0) {
      category = baseCategory[0].id;
    }

    let url;

    // if (searchKey.length == 0 && category !== "100") {
    // url = `https://www.trendyol.com/sr?wc=${category}`;
    // } else if (searchKey.length == 0 && category === "100") {
    //   url = `https://www.trendyol.com${baseCategory.url}`;
    // } else
    if (searchKey.length == 0) {
      url = `https://www.trendyol.com/sr?wc=${category}${
        brand && brand?.length > 0 ? `&wb=${brand}` : ``
      }`;
    } else {
      url = `https://www.trendyol.com/sr?wc=${category}${
        brand && brand?.length > 0 ? `&wb=${brand}` : ``
      }${
        searchKey && searchKey.length > 0
          ? `&q=${searchKey}&qt=${searchKey}&st=${searchKey}`
          : ``
      }`;
    }

    console.log("request url:" + url);

    await axios
      .get(url)
      .then((res: any) => {
        let dom = parser.parseFromString(res.data);
        result.data.push(...extractProducts(dom));
      })
      .catch((err: any) => {
        result.error = err.message;
      });
    return result;
  }

  private async requestCategories(searchKey: string, category: string) {
    let result = { categories: [] as [], brands: [] as [], error: "" };
    if (!category) {
      category = "100";
    }
    await axios
      .get(
        `https://public.trendyol.com/discovery-web-searchgw-service/v2/api/aggregations/sr?${
          category ? "wc=" + category + "&" : ""
        }q=${searchKey}&qt=${searchKey}&st=${searchKey}&culture=tr-TR&storefrontId=1&categoryRelevancyEnabled=true&priceAggregationType=DYNAMIC_GAUSS&searchTestTypeAbValue=A`
      )
      .then((res: any) => {
        // console.log(res.data);
        res.data.result.aggregations.forEach((e: any, i: number) => {
          if (e.group === "CATEGORY") {
            // console.log("iii" + i);
            result.categories = res.data.result.aggregations[i].values;
          } else if (e.group === "BRAND") {
            // console.log("iii" + i);
            result.brands = res.data.result.aggregations[i].values;
          }
        });
      })
      .catch((err: any) => {
        result.error = err.message;
      });
    return result;
  }
}

const extractProducts = (dom: any): Product[] => {
  let data = [];
  let searchResult = dom.getElementsByClassName("prdct-cntnr-wrppr")[0]
    .childNodes;
  for (let i = 0; i < searchResult.length; i++) {
    const item = searchResult[i];
    let website = "trendyol";
    let name = preventError(
      () => item.getElementsByClassName("prdct-desc-cntnr-name")[0].innerHTML
    );
    let price = preventError(() =>
      parseInt(
        item
          .getElementsByClassName("prc-box-sllng")[0]
          .innerHTML.split("<!-- -->")[0]
      )
    );
    let currency = preventError(
      () =>
        item
          .getElementsByClassName("prc-box-sllng")[0]
          .innerHTML.split("<!-- -->")[2]
    );
    let brand = preventError(
      () => item.getElementsByClassName("prdct-desc-cntnr-ttl")[0].innerHTML
    );
    let freeShipping = preventError(
      () => item.getElementsByClassName("stmp fc")[0] != undefined
    );
    // let imageLink = preventError(
    //   () => item.getElementsByClassName("p-card-img")[0].src + ""
    // );
    let imageLinks = preventError(() => {
      let scripts = dom.getElementsByTagName("script");
      let imageLinksTemp = [];
      for (let script of scripts) {
        if (
          script.innerHTML.indexOf("window.__SEARCH_APP_INITIAL_STATE__") != -1
        ) {
          script = script.innerHTML.split(";");
          for (let e of script) {
            if (e.indexOf("window.__SEARCH_APP_INITIAL_STATE__") != -1) {
              e = JSON.parse(e.substring(e.indexOf("{")));
              // ! MAIN INFO SOURCE
              // console.log(e);
              // console.log(e.products[0].price);
              // console.log(e.products[0].images);
              for (const image of e.products[i].images) {
                // console.log(image);
                imageLinksTemp.push(
                  e.configuration.cdnUrl + image.replace("_zoom", "")
                );
              }
              break;
            }
          }
          break;
        }
      }
      return imageLinksTemp;
    });

    data.push({
      website: website,
      name: name,
      price: price,
      currency: currency,
      brand: brand,
      freeShipping: freeShipping,
      imageLinks: imageLinks,
    });
    // console.log(
    //     item.getElementsByClassName("stmp fc")[0]
    // );
  }
  return data;
};

function buildQuery(params: String) {}

// this should have only one element.
export const baseCategory = [
  {
    id: "100",
    count: "114757",
    text: "Makyaj",
    leaf: true,
    beautifiedName: "makyaj",
    filterField: "webCategoryIds",
    type: "WebCategory",
    url: "/makyaj-x-c100",
  },
];
