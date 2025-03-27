import { types, resolvers } from '@/graphql';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Enum_RoleName, PrismaClient } from '@prisma/client';
import { OurContext } from '@/graphql/context';
import { NextApiRequest, NextApiResponse } from 'next';
import { FailedAuthError } from '@/errors/FailedAuthError';

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
    introspection: true,
});

// Here we give the embed the context in the server
export default startServerAndCreateNextHandler(server, {
    context: async (req: NextApiRequest, res: NextApiResponse) => {
        const token = req.headers['session-token'];

        const authData: [{
                userId: string,
                role: Enum_RoleName,
                expires: Date,
            }] = await prisma.$queryRaw`
            SELECT
                u."id" as "userId",
                r."name" as "role",
                s."expires" as "expiration_date"
            FROM
                "Session" s
                INNER JOIN "User" u
                    on s."userId" = u."id"
                INNER JOIN "Role" r
                    on u."roleId" = r."id"
            WHERE
                s."sessionToken" = ${token}
        `;

        if (!authData[0])
            throw new FailedAuthError();

        return {
            db: prisma,
            authData: authData[0],
        };
    }
});
