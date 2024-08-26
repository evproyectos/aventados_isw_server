// Import necessary GraphQL modules and the Ride model
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql');
const Ride = require('../models/rideModel');

/**
 * @description Defines the GraphQL type for Ride.
 * @constant RideType
 * @type {GraphQLObjectType}
 * @property {GraphQLString} id - The unique identifier of the ride.
 * @property {GraphQLString} origin - The starting location of the ride.
 * @property {GraphQLString} destination - The destination location of the ride.
 * @property {GraphQLString} departureTime - The departure time of the ride, formatted as ISO string.
 * @property {GraphQLString} availableSeats - The number of available seats on the ride.
 * @property {GraphQLString} fee - The fee for the ride.
 *
 * @example
 * const ride = {
 *   id: "1",
 *   origin: "New York",
 *   destination: "Boston",
 *   departureTime: new Date(),
 *   availableSeats: "4",
 *   fee: "50"
 * };
 */
const RideType = new GraphQLObjectType({
  name: 'Ride',
  fields: () => ({
    id: { type: GraphQLString },
    origin: { type: GraphQLString },
    destination: { type: GraphQLString },
    departureTime: {
      type: GraphQLString,
      resolve(parent) {
        return parent.departureTime.toISOString();  // Convert the Date object to ISO string
      }
    },
    availableSeats: { type: GraphQLString },
    fee: { type: GraphQLString },
  })
});

/**
 * @description Defines the root query for the GraphQL schema.
 * @constant RootQuery
 * @type {GraphQLObjectType}
 * @property {GraphQLList<RideType>} rides - Query to retrieve a list of rides filtered by destination.
 * @property {object} args - The arguments for the rides query.
 * @property {GraphQLString} args.destination - The destination to filter rides by.
 * @property {function} resolve - The function to resolve the rides query.
 *
 * @example
 * query {
 *   rides(destination: "Boston") {
 *     id
 *     origin
 *     destination
 *     departureTime
 *     availableSeats
 *     fee
 *   }
 * }
 */
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    rides: {
      type: new GraphQLList(RideType),
      args: { destination: { type: GraphQLString } },
      resolve(parent, args) {
        // Use a regular expression to find similar destinations
        return Ride.find({ destination: { $regex: args.destination, $options: 'i' } });
      }
    }
  }
});

/**
 * @description The GraphQL schema that defines the root query.
 * @constant Schema
 * @type {GraphQLSchema}
 * @property {RootQuery} query - The root query type for the schema.
 *
 * @example
 * const query = `
 *   {
 *     rides(destination: "New York") {
 *       id
 *       origin
 *       destination
 *       departureTime
 *       availableSeats
 *       fee
 *     }
 *   }
 * `;
 */
module.exports = new GraphQLSchema({
  query: RootQuery
});
