import { NextRequest } from 'next/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { AusPostAPI } from '@/src/libs/datasource-apis';
import { ApolloServerCtx } from '@/src/types';

// Move to new file if there are more resolvers
const resolvers = {
  Query: {
    search: async (
      _: any,
      { state, suburb }: { state: string; suburb: string },
      { dataSources }: ApolloServerCtx
    ) => {
      const response = await dataSources.ausPostAPI.search(state, suburb);

      if (response.error) {
        // Handle the error case
        throw new Error(response.error.errorMessage);
      } else if (response.localities) {
        // Convert to array when only one locality is fetched
        if (Array.isArray(response.localities.locality)) {
          return response.localities.locality;
        }
        return [response.localities.locality];
      } else if (response.localities === '') {
        // Handle the case where localities is an empty string
        return [];
      } else {
        throw new Error('Something went wrong');
      }
    },
  },
};

// Move to new file if there are more schemas
const typeDefs = gql`
  type Query {
    search(state: String, suburb: String): [Locality]
  }

  type Locality {
    id: Int
    category: String
    latitude: Float
    longitude: Float
    location: String
    postcode: Int
    state: String
  }
`;

const server = new ApolloServer<ApolloServerCtx>({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest, ApolloServerCtx>(server, {
  context: async () => {
    const { cache } = server;
    return {
      dataSources: {
        ausPostAPI: new AusPostAPI({ cache }),
      },
    };
  },
});

export { handler as GET, handler as POST };
