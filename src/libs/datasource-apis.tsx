import { RESTDataSource } from '@apollo/datasource-rest';
import { SearchResponse } from '../types';

export class AusPostAPI extends RESTDataSource {
  override baseURL = 'https://digitalapi.auspost.com.au/';

  async search(state: string, suburb: string): Promise<SearchResponse> {
    const data = await this.get(`/postcode/search.json`, {
      params: {
        state: state,
        q: suburb,
      },
      headers: {
        'auth-key': process.env.AUSPOST_AUTH_KEY!,
      },
    });
    return data;
  }
}
