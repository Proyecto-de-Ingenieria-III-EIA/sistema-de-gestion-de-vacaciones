import { gql } from "graphql-tag";

const requestedAbsenceQueries = gql`
  type Query {
    getAbsencesTimePeriod(start: DateTime!, end: DateTime!): [WholeRequestedAbsence]
  }
`;

export { requestedAbsenceQueries };