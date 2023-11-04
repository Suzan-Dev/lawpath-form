'use client';

import { PropsWithChildren } from 'react';
import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';

const GRAPHQL_URI = `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}/api/graphql`;

const makeClient = () => {
  const httpLink = new HttpLink({
    uri: GRAPHQL_URI,
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
};

export const ApolloWrapper = ({ children }: PropsWithChildren) => {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
};
