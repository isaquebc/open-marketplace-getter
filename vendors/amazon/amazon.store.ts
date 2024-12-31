import { ShopStoreBase, IProduct, FetchOptions } from '../interfaces/ShopStoreBase';

export class AmazonStore extends ShopStoreBase {

  login(clientId: string, clientSecret: string, code: string, redirectUri: string): Promise<unknown> {
    // Lógica de login na API da Amazon
    // ...
    return Promise.resolve({} as unknown);
  };

  createProduct(payload: unknown): Promise<unknown> {
    // Lógica de criação de produto na API da Amazon
    // ...
    return Promise.resolve({} as unknown);
  }

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

export default AmazonStore;
