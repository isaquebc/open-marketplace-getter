import { ShopStoreBase, IProduct, FetchOptions } from '../interfaces/ShopStoreBase';

export class AmazonStore extends ShopStoreBase {
  async getSellerProducts(sellerId: string, options?: FetchOptions): Promise<IProduct[]> {
    // Lógica de chamada à API da Amazon
    // ...
    return [];
  }

  async searchInSeller(sellerId: string, query: string, options?: FetchOptions): Promise<IProduct[]> {
    // Lógica de busca interna no catálogo do vendedor
    // ...
    return [];
  }
}