import axios from "axios";
import domparser from "dom-parser";

const parser = new domparser();

import { Product } from "../../product.interface";
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
    searchKey: string
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
      let searchResult = await this.requestProduct(searchKey);
      if (searchResult.error) {
        res.error = searchResult.error;
        res.success = false;
        return res;
      }
      res.data = searchResult.data;

      // Get Categories
      let searchResult2 = await this.requestCategories(searchKey);
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
    let data = [] as Product[];

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
        let searchResult = dom.getElementsByClassName("prdct-cntnr-wrppr")[0]
          .childNodes;
        for (let i = 0; i < searchResult.length; i++) {
          const item = searchResult[i];
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
                    console.log(e);
                    console.log(e.products[0].price);
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
        }
      })
      .catch((err: any) => {
        console.log(err.message);
      });

    console.log(data);
    return data;

    let productsDemo = [
      {
        website: this.website,
        name: "string",
        price: 123,
        currency: "string",
        brand: "string",
        freeShipping: true,
        imageLinks: ["img1", "img2"],
      },
    ];
    return productsDemo;
  }

  private async requestProduct(searchKey: string) {
    let result = { data: [] as Product[], error: "" };

    await axios
      .get(
        `https://www.trendyol.com/sr?q=${searchKey}&qt=${searchKey}&st=${searchKey}&os=1`
      )
      .then((res: any) => {
        let dom = parser.parseFromString(res.data);
        // data = extractData(dom);
        let searchResult = dom.getElementsByClassName("prdct-cntnr-wrppr")[0]
          .childNodes;
        for (let i = 0; i < searchResult.length; i++) {
          const item = searchResult[i];
          let website: string = "trendyol";
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
                    //   console.log(e);
                    //   console.log(e.products[0].price);
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

          result.data.push({
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
        result.error = err.message;
      });
    return result;
  }

  private async requestCategories(searchKey: string) {
    let result = { categories: [] as [], brands: [] as [], error: "" };
    await axios
      .get(
        `https://public.trendyol.com/discovery-web-searchgw-service/v2/api/aggregations/sr?q=${searchKey}&qt=${searchKey}&st=${searchKey}&culture=tr-TR&storefrontId=1&categoryRelevancyEnabled=true&priceAggregationType=DYNAMIC_GAUSS&searchTestTypeAbValue=A`
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

const extractData = async (dom) => {
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
              console.log(e);
              console.log(e.products[0].price);
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
