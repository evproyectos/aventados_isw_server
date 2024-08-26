// Import necessary modules
const { graphqlHTTP } = require('express-graphql');
const schema = require('../controllers/schemaGraphql');

/**
 * @description Middleware to handle GraphQL requests.
 * @function graphqlRoutes
 *
 * This middleware sets up the GraphQL server with the provided schema and enables the GraphiQL interface for testing queries.
 * - `schema`: The GraphQL schema to be used for processing queries and mutations.
 * - `graphiql`: Boolean flag to enable the GraphiQL interface, which is a graphical user interface for exploring GraphQL APIs.
 */
const graphqlRoutes = graphqlHTTP({
    schema,
    graphiql: true,  // Enable GraphiQL interface for interactive querying
});

// Export the GraphQL middleware
module.exports = graphqlRoutes;
