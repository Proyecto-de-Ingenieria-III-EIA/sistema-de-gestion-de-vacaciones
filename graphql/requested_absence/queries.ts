import { gql } from "graphql-tag";

const requestedAbsenceQueries = gql`
  type Query {
    getAbsencesTimePeriod(startDate: DateTime!, endDate: DateTime!): [WholeRequestedAbsence]
  }
`;

export { requestedAbsenceQueries };