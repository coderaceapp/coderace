import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql', // Replace with actual backend endpoint
    cache: new InMemoryCache(),
});

export default client;
