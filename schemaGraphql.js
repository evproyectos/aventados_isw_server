const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql');
const Ride = require('./models/rideModel');

// Define the Ride type
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

// Define the query to find rides by destination
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
  

module.exports = new GraphQLSchema({
  query: RootQuery
});
