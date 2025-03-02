import gql from "graphql-tag";
import { userResolvers } from "./queries/users/resolvers";
import { userTypes } from "./queries/users/types";
import { sessionTypes } from "./queries/session/types";

const defaultTypes = gql`
    scalar DateTime
`;

const types = [defaultTypes, userTypes, sessionTypes];

const resolvers = [userResolvers];

export {
    types,
    resolvers
};