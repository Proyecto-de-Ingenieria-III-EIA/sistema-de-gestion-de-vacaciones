import gql from "graphql-tag";

const absenceMutations = gql`
    type Mutation{
        # Place holder, so the API can run
        # TODO  when creating an absence (in spontaneous and requested) create the 
        update: Absence
    }
`;

export { absenceMutations };