import { gql } from "graphql-tag";

const requestedAbsenceQueries = gql`
  type Query {
    getPendingRequestedAbsences: [WholeRequestedAbsence]
  }
`;

export { requestedAbsenceQueries };