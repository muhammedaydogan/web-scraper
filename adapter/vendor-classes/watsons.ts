import puppeteer from "puppeteer";
import domparser from "dom-parser";

const parser = new domparser();
import { IWebsiteWatsons } from "../interfaces/website-watsons.interface";

export class Watsons implements IWebsiteWatsons {
  async searchWatsons(searchKey: string): Promise<{}> {
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
      await page.goto(`https://www.watsons.com.tr/search?q=${searchKey}&personaclick_search_query=${searchKey}&personaclick_input_query=${searchKey}`, {
        waitUntil: "networkidle2"
      });
      // let category_list = await page.$$('.headed-link-card > div > ul > li');
      let product_cards = await page.$$('.product-list-container > div > div');
      // let brand_list = await page.$$('.occ-facet-display-filter > div > .content > div');

      // await getCategories(category_list, res);
      // for (let i = 0; i < res.categories.length; i++) {
      //   if (category == res.categories[i].name) {
      //     console.log('match');
      //     let category_data = await category_list[i].$('a');
      //     let p = await category_data.click();
      //     console.log(p);
      //     // category_list = await page.$$('.headed-link-card > div > ul > li');
      //     // await getCategories(category_list, res);
      //     // await page.goForward({waitUntil: "networkidle2"});
      //     // product_cards = await page.$$('.row.product-list-wrapper.col3 > div');
      //     // await getProducts(product_cards, res);
      //     break;
      //   }
      // }
      
      // await getBrands(brand_list, res);
      // for (let i = 0; i < res.brands.length; i++) {
      //   if (brand == res.brands[i].name) {
      //     console.log('match');
      //     let b = await brand_list[i].$('input');
      //     await b.click();
      //     // product_cards = await page.$$('.row.product-list-wrapper.col3 > div');
      //     // await getProducts(product_cards, res);
      //   }
      // }
      await getProducts(product_cards, res);
      await page.screenshot({ path: 'screenshot.png' });

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
      data['title'] = await product_card.$eval('.productbox-desc.text-left.mb-1', text => text.innerHTML);
      let dom = parser.parseFromString(data['title']);
      let spans = dom.getElementsByTagName('span');
      console.log(dom.rawHTML);
      // console.log(dom.rawHTML[4]);
      // let price_info = await product_card.$('.occ-product-gratis-card-new-wrapper');
      // let price_amount = await price_info.$eval('.gr-price__amount', text => text.textContent);
      // let price_fractional = await price_info.$eval('.gr-price__fractional', text => text.textContent);
      // data['price'] = parseFloat(price_amount) + parseFloat(price_fractional.replace(",", "0."));
      data['currency'] = await product_card.$eval('.list-inline-item.product-box-price.text-site-pink.roboto-medium', text => text.textContent);
      data['link'] = await product_card.$eval('a', text => text.href);
      data['image_link'] = await product_card.$eval('a > img', text => text.src);
      resolve(data);
    });
  
    for (let i = 1; i < product_cards.length; i++) {
      let product = await productPromise(product_cards[i]);
      console.log(product);
      res.data.push(product);
    }
  }
  
  async function getBrands(brand_list: any, res) {
    res.brands = [] as any;
    let brandPromise = (brand) => new Promise(async (resolve, reject) => {
      let data = {};
      let brand_data = await brand.$eval('label', text => text.innerHTML);
      let dom = parser.parseFromString(brand_data);
      let spans = dom.getElementsByTagName('span');
      if (spans.length >= 2) {
        data['name'] = spans[0].innerHTML;
        data['count'] = spans[1].innerHTML.replace(/(\(|\))/gm, "");
      }
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
      let category_data = await category.$eval('a', text => text.innerHTML);
      let dom = parser.parseFromString(category_data);
      let spans = dom.getElementsByTagName('span');
      if (spans.length >= 2) {
        data['name'] = spans[0].innerHTML.replace(/&amp;/gm, "&");
        data['count'] = spans[1].innerHTML.replace(/(\(|\))/gm, "");
      }
      resolve(data);
    });
  
    for (var category of category_list) {
      let c = await categoryPromise(category);
      // console.log(c);
      res.categories.push(c);
    }
  }

