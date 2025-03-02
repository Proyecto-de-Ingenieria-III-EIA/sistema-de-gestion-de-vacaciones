import { OurContext } from "@/graphql/context";
import { User } from "@prisma/client";

interface UserByEmailArgs {
    email: string;
}

// This is the function that returns the data
const userResolvers = {

    // You can resolve the queries for the user perse
    Query: {
        getUsers: async (parent: User, args: null, context: OurContext) => {
            return await context.db.user.findMany();
        },

        // Every resolver function has 4 parameters
        // parent: This is the result of the previous resolver (in case you are resolving
        // a nested object), that means, is the object that this is nested in (see below)
        // args: This is the arguments that are passed to the query
        // context: This is the context that is passed to the query
        // info: This is the information about the query that is being executed
        getUserByEmail: async (parent: User, args: UserByEmailArgs, context: OurContext) => {
            return await context.db.user.findUnique({
                where : {
                    email: args.email
                }
            });
        }
    },

    // And you can also resolve the queries for the other objects inside that user
    User: {
        sessions: async (parent: User, args: null, context: OurContext) => {
            console.log(parent);
            return context.db.session.findMany({
                where: {
                    userId: parent.id,
                }
            });
        }
    }
};

export { userResolvers };
