export interface IWebsiteWatsons {
  searchWatsons(searchKey: string): Promise<{}>;
  searchWatsonsFeatured(
    searchKey: string,
    category: string,
    brand: string
  ): Promise<{}>;
}
