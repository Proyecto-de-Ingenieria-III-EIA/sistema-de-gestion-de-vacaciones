import gql from "graphql-tag";

const requestStatusMutations = gql`
    type Mutation{
        # Place holder, so the API can run
        updateRequestStatus: RequestStatus
    }
`;

export { requestStatusMutations };