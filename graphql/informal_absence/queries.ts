import gql from 'graphql-tag';

const informalAbsenceQueries = gql`
  type Query {
    getAllInformalAbsences: [InformalAbsence]
  }
`;

export { informalAbsenceQueries };
