import { ShopStoreBase, IProduct, FetchOptions } from '../interfaces/ShopStoreBase';
import axios from 'axios';

export class MercadoLivreStore extends ShopStoreBase {
  async getSellerProducts(sellerId: string, options?: FetchOptions): Promise<IProduct[]> {
    const productsReq = await axios.get(`https://api.mercadolibre.com/sites/MLB/search?seller_id=${sellerId}`);
    return productsReq.data;
  }

  async searchInSeller(sellerId: string, text: string, options?: FetchOptions): Promise<IProduct[]> {
    
    const productsReq = await axios.get(`https://api.mercadolibre.com/sites/MLB/search?seller_id=${sellerId}&q=${text}`);
    return productsReq.data;
  }

  getProductLink(productId: string): string {
    return `https://produto.mercadolivre.com.br/${productId.slice(0,3)}-${productId.slice(3)}`;
  }
}

export default MercadoLivreStore;