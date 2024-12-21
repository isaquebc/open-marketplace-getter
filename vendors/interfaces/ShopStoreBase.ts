export interface IProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  [key: string]: unknown;
}

export interface FetchOptions {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export abstract class ShopStoreBase {
  /**
   * Método abstrato: obriga classes filhas a fornecer implementação.
   */
  abstract getSellerProducts(sellerId: string, options?: FetchOptions): Promise<IProduct[]>;

  /**
   * Método abstrato: obriga classes filhas a fornecer implementação.
   */
  abstract searchInSeller(sellerId: string, query: string, options?: FetchOptions): Promise<IProduct[]>;

  /**
   * Método concreto (opcional): você pode colocar lógica padrão ou funções utilitárias
   * que ajudam na manipulação dos dados para todos os marketplaces.
   */
  formatPrice(value: number, currency: string): string {
    return `${currency} ${value.toFixed(2)}`;
  }
}
