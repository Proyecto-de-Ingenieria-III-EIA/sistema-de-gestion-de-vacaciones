import { types, resolvers } from '@/graphql';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import { OurContext } from '@/graphql/context';

const prisma = new PrismaClient();

export const schema = makeExecutableSchema({
    typeDefs: types,
    resolvers,
});



// we can define contexts in our servers, that are going to allow us to pass data to the resolvers.
// All resolvers are going to be able to access this data (objects). In this case, we are passing our prisma client
// so all resolvers can make queries to the database.

// In the apollo server we tell it what context it will have (the interface we made for the prisma client)
const server = new ApolloServer<OurContext>({
    schema,
});

// Here we give the embed the context in the server
export default startServerAndCreateNextHandler(server, {
    context: async () => {
        
        return {
            db: prisma,
        };
    }
});
