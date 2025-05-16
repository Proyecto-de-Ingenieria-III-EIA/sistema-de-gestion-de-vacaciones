import gql from "graphql-tag";

const absenceMutations = gql`
    type Mutation{
        # Place holder, so the API can run
        update: Absence
    }
`;

export { absenceMutations };