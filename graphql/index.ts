import gql from "graphql-tag";
import { userThings, userResolvers } from "./users/combiner";
import { sessionThings } from "./session/combiner";
import { roleThings } from "./role/combiner";

const defaultTypes = gql`
    scalar DateTime
`;

const types = [
    ...userThings,
    ...sessionThings,
    ...roleThings,
    defaultTypes, 
];

const resolvers = [
    userResolvers
];

export {
    types,
    resolvers
};