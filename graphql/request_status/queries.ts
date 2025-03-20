import gql from "graphql-tag";

const requestStatusQueries = gql`
    type Query {
        getAllRequestStatuses: [RequestStatus]
    }
`;

export { requestStatusQueries };