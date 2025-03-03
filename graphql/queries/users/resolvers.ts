import { OurContext } from "@/graphql/context";
import { User, Role } from "@prisma/client";
import { ListEndIcon } from "lucide-react";

interface UserByEmailArgs {
    email: string;
}

interface UpdateUserRole {
    userId: string;
    newRoleName: string;
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

    Mutation: {
        updateUserRole: async (parent: any, args: UpdateUserRole, { db }: OurContext) => {
            console.log(args);

            const role = await db.role.findFirst({
                where: {
                    name: args.newRoleName,
                },
            });

            console.log(role ?? "The role couldn't be found");

            if (!role)
                throw new Error(`Role with name '${args.newRoleName}' does not exist`);

            return db.user.update({
                where: {
                    id: args.userId,
                },
                data: {
                    roleId: role.id
                }
            })
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
        },

        role: async (parent: User, args: null, { db }: OurContext) => {
            const role: [Role] = await db.$queryRaw`
                SELECT 
                    r.* 
                FROM 
                    "Role" r
                INNER JOIN 
                    "User" u ON u."roleId" = r."id"
                WHERE
                    u."id" = ${parent.id}
            `;

            return role[0];
        }
    }
};

export { userResolvers };
