import { gql } from "graphql-tag";

const absenceQueries = gql`
  type Query {
    getAllAbsences: [Absence]
  }
`;

export { absenceQueries };