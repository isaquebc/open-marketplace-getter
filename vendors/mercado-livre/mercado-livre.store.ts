import { ShopStoreBase, IProduct, FetchOptions } from '../interfaces/ShopStoreBase';
import axios from 'axios';

/**
 * Exemplo de payload para criar um novo item no Mercado Livre.
 * Ajuste conforme suas necessidades e as regras de cada categoria.
 */
interface CreateItemPayload {
  title: string;
  category_id: string;
  price: number;
  currency_id: string;
  available_quantity: number;
  buying_mode: 'buy_it_now' | 'auction' | 'classified'; // Modos possíveis no ML
  condition: 'new' | 'used' | 'not_specified';
  listing_type_id: string;
  description: {
    plain_text: string;
  };
  pictures: Array<{ source: string }>;
  // Inclua outros campos opcionais, como shipping, sale_terms etc., conforme necessário.
}

/**
 * Tipo de resposta esperado da API ao criar o item.
 * Aqui deixamos aberto para campos adicionais com [key: string]: any;
 * mas você pode detalhar mais se quiser.
 */
interface MeliItemCreateResponse {
  id: string;
  title: string;
  permalink?: string;
  [key: string]: any;
}

/**
 * Tipos de dados esperados na resposta do Mercado Livre ao obter o token.
 */
interface MeliLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_id: number;
  refresh_token?: string;
  [key: string]: any; // permite campos adicionais
}

export class MercadoLivreStore extends ShopStoreBase {

  constructor(
    clientId: string,
    clientSecret: string,
    code: string,
    redirectUri: string,
  ) {
    super();

    this.login(
      clientId,
      clientSecret,
      code,
      redirectUri
    )
  }

  /**
   * Faz a troca do "code" de autorização pelo Access Token do Mercado Livre.
   * @param clientId     - Seu App ID (Client ID) obtido no Dev Portal do Mercado Livre
   * @param clientSecret - Seu Secret Key (Client Secret)
   * @param code         - Código retornado pelo Mercado Livre após o usuário autorizar o acesso
   * @param redirectUri  - Mesma URL de redirecionamento configurada no Mercado Livre
   * @returns            - Retorna um objeto com o Access Token e outros dados
   */
  async login(
    clientId: string,
    clientSecret: string,
    code: string,
    redirectUri: string
  ): Promise<MeliLoginResponse> {
    const url = 'https://api.mercadolibre.com/oauth/token';

    // Montando o corpo da requisição no formato x-www-form-urlencoded
    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('client_id', clientId);
    body.append('client_secret', clientSecret);
    body.append('code', code);
    body.append('redirect_uri', redirectUri);

    // Realizando a requisição
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });

    if (!response.ok) {
      throw new Error(`Erro ao obter token: ${response.status} - ${response.statusText}`);
    }

    const data: MeliLoginResponse = await response.json();

    this.setToken(data.access_token);
    return data;
  }

  /**
   * Cria um novo anúncio no Mercado Livre usando um Access Token válido.
   * @param accessToken Token de acesso obtido via OAuth (Bearer token).
   * @param payload     Dados do produto que será criado.
   * @returns           Resposta da API do Mercado Livre com os dados do item criado.
   */
  async createProduct(
    payload: CreateItemPayload
  ): Promise<MeliItemCreateResponse> {
    const url = 'https://api.mercadolibre.com/items';
    
    // Cabeçalhos para autenticar e enviar JSON
    const headers = {
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    };

    try {
      // Realiza o POST para criar o item
      const response = await axios.post<MeliItemCreateResponse>(url, payload, { headers });
      return response.data; // JSON com informações do item criado
    } catch (error: any) {
      // Erro ao criar o item no Mercado Livre
      throw new Error(error?.response?.data?.message || error.message || 'Erro ao criar o item no Mercado Livre');
    }
  }

  /**
   * Gera a URL que você deve redirecionar o usuário para fazer login no Mercado Livre.
   * @param clientId    - Seu App ID (Client ID)
   * @param redirectUri - URL de callback configurada no Mercado Livre
   * @returns           - URL de autorização
   */
  getMeliAuthUrl(clientId: string, redirectUri: string): string {
    const baseAuthUrl = 'https://auth.mercadolivre.com.br/authorization';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri
    });
    // Exemplo final: https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=SEU_ID&redirect_uri=SUA_URL
    return `${baseAuthUrl}?${params.toString()}`;
  }

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
