import { gql } from "graphql-tag";

const absenceQueries = gql`
  type Query {
    getAbsencesTimePeriod(startDate: DateTime!, endDate: DateTime!): [CompleteAbsence]
    getAllAbsences: [Absence]
  }
`;

export { absenceQueries };