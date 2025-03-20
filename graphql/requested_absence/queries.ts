import { gql } from "graphql-tag";

const requestedAbsenceQueries = gql`
  type Query {
    getAbsencesTimePeriod(start: DateTime!, end: DateTime!): [Absence]
  }
`

export { requestedAbsenceQueries };