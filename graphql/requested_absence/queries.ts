import { gql } from "graphql-tag";

const requestedAbsenceQueries = gql`
  type Query {
    getAbsencesTimePeriod(startDate: DateTime!, endDate: DateTime!): [WholeRequestedAbsence]
    getPendingRequestedAbsences: [WholeRequestedAbsence]
  }
`;

export { requestedAbsenceQueries };