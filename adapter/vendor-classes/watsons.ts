import puppeteer from "puppeteer";
import domparser from "dom-parser";

const parser = new domparser();
import { IWebsiteWatsons } from "../interfaces/website-watsons.interface";

export class Watsons implements IWebsiteWatsons {
  async searchWatsons(searchKey: string, categoryId: string, brandId: string): Promise<{}> {
    let res = {
      success: true,
      categories: [] as any,
      brands: [] as [],
      data: [] as any,
      error: "",
    };

    try {
      searchKey.replace(" ", "%20");
      console.log(searchKey);
      let browser = await puppeteer.launch({
        // headless: false,
        args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true
    });
      let page = await browser.newPage();
      await page.goto(`https://www.watsons.com.tr/search?q=${searchKey}&personaclick_search_query=${searchKey}&personaclick_input_query=${searchKey}&specs=${categoryId},${brandId}`, {
        waitUntil: "networkidle2"
      });
      let category_list = await page.$$('.filter-item.kategori > div > ul > li');
      let product_cards = await page.$$('.product-list-container > div > div');
      let brand_list = await page.$$('.filter-item.marka > div > ul > li');

      await getCategories(category_list, res);
      await getBrands(brand_list, res);
      await getProducts(product_cards, res);
      await page.waitForTimeout(5000);

      await browser.close();
    
    } catch (err) {
      res.error = err.message;
      res.success = false;
    }
    res.success = true;
    return res;
  }
}
async function getProducts(product_cards: any, res) {
  res.data = [] as any;
  let productPromise = (product_card) => new Promise(async (resolve, reject) => {
    let data = {};
    data['brand'] = await product_card.$eval('.productbox-desc.text-left.mb-1 > span', text => text.innerHTML.replace(/(\r\n\t|\n|\r|\t)/gm, "").trim());
    data['title'] = await product_card.$eval('.productbox-desc.text-left.mb-1', text => text.innerHTML);
    data['title'] = data['title'].substr(data['title'].lastIndexOf("</span>\n") + 8).trim();
    let dom = parser.parseFromString(data['title']);
    console.log(dom.children);
   
    
    let price = await product_card.$eval('.list-inline-item.product-box-price.text-site-pink.roboto-medium', text => text.textContent);
    data['price'] = parseFloat(price.replace(/(\r\n\t|\n|\r|\t|\s)/gm, "").replace(",", "."));
    data['currency'] = price.replace(/(\r\n\t|\n|\r|\t|\s|,)/gm, "").replace(/[0-9]/gm, "");
    data['link'] = await product_card.$eval('a', text => text.href);
    data['image_link'] = await product_card.$eval('a > img', text => text.src);
    resolve(data);
  });

  for (let i = 21; i < product_cards.length; i++) {
    let product = await productPromise(product_cards[i]);
    console.log(product);
    res.data.push(product);
  }
}
  
async function getBrands(brand_list: any, res) {
  res.brands = [] as any;
  let brandPromise = (brand) => new Promise(async (resolve, reject) => {
    let data = {};
    data['link'] = await brand.$eval('a', text => text.href);
    let outer_html = await brand.$eval('a', text => text.outerHTML);
    let a = outer_html.indexOf('data-spec-id="');
    let b = outer_html.indexOf('">\n');
    data['id'] = outer_html.substr(a + 14, b - a -14);
    data['name'] = await brand.evaluate(text => text.title);
    resolve(data);
  });

  for (var brand of brand_list) {
    let b = await brandPromise(brand);
    // console.log(b);
    res.brands.push(b);
  }
}
  
async function getCategories(category_list: any, res) {
  res.categories = [] as any;
  let categoryPromise = (category) => new Promise(async (resolve, reject) => {
    let data = {};
    data['link'] = await category.$eval('a', text => text.href);
    let outer_html = await category.$eval('a', text => text.outerHTML);
    let a = outer_html.indexOf('data-spec-id="');
    let b = outer_html.indexOf('">\n');
    data['id'] = outer_html.substr(a + 14, b - a -14);
    data['name'] = await category.evaluate(text => text.title);
    resolve(data);
  });

  for (var category of category_list) {
    let c = await categoryPromise(category);
    // console.log(c);
    res.categories.push(c);
  }
}

