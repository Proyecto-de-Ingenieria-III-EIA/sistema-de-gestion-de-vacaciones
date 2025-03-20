import { gql } from "graphql-tag";

// TODO Add place holder for each mutation and query in all the entities.
// See the mutations file of absence to see an example of a place holder, this so the API can run
const absenceQueries = gql`
  type Query {
    getAllAbsences: [Absence]
  }
`;

export { absenceQueries };