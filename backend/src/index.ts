import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './schema/typeDefs';
import { leaderboardsResolver } from './resolvers/leaderboardsResolver';
import { questionResolver } from './resolvers/questionResolver';
import http from 'http';
const cors = require('cors');

// Initialize express app
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));

// Merge the resolvers
const resolvers = {
    Query: {
        ...leaderboardsResolver.Query,
        ...questionResolver.Query,
    },
};

// Create GraphQL schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers: resolvers as any,
});

// Set up GraphQL middleware
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true, // Enable GraphiQL for testing
    })
);

// Create HTTP server
const httpServer = http.createServer(app);

// Start the server
httpServer.listen(4000, () => {
    console.log('🚀 Server ready at http://localhost:4000/graphql');
});