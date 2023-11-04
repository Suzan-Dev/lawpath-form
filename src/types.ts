import { AusPostAPI } from './libs/api';

export type FormStateType = {
  value?: string;
  error?: boolean;
  errorMsg?: string;
};

export type Locality = {
  category: string;
  id: number;
  latitude: number;
  location: string;
  longitude: number;
  postcode: number;
  state: string;
};

export type SearchLocalitiesData = {
  location: string;
  postcode: number;
  state: string;
};

export type ApolloServerCtx = {
  dataSources: {
    ausPostAPI: AusPostAPI;
  };
};

type Localities = { localities: { locality: Locality[] } | ''; error: { errorMessage: string } };
export type SearchResponse = Localities;
