export interface IWebsiteGratis {
  searchGratis(searchKey: string): Promise<{}>;
  searchGratisFeatured(
    searchKey: string,
    category: string,
    brand: string
  ): Promise<{}>;
}
