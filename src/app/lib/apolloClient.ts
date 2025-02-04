import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql', // Make sure the URI matches your GraphQL server
    cache: new InMemoryCache(),
});

export default client;
