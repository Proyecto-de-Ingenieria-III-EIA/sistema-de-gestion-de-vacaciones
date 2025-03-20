import gql from "graphql-tag";

const informalAbsenceMutations = gql`
    type Mutation{
        # Place holder, so the API can run
        updateInformalAbsence: InformalAbsence
    }
`;

export { informalAbsenceMutations };