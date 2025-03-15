import { gql } from "graphql-tag";

const requestedAbsenceQueries = gql`
  getAbsencesTimePeriod(start: DateTime!, end: DateTime!): [Absence]
`

export { requestedAbsenceQueries };