import gql from "graphql-tag";

const requestedAbsenceMutations = gql`
    type Mutation{
        # Place holder, so the API can run
        updateRequestedAbsence: RequestedAbsence
    }
`;

export { requestedAbsenceMutations };