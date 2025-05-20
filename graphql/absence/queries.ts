import { gql } from "graphql-tag";

const absenceQueries = gql`
  type Query {
    getAbsencesTimePeriod(startDate: DateTime!, endDate: DateTime!): [CompleteAbsence]
    getAllAbsences: [Absence]
    getUserAbsences(userId: ID): [Absence]
  }
`;

export { absenceQueries };