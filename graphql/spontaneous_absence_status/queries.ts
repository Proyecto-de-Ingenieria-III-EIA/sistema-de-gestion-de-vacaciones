import gql from 'graphql-tag';

const spontaneousAbsenceStatusQueries = gql`
  type Query {
    getAllSpontaneousAbsenceStatuses: [SpontaneousAbsenceStatus]
  }
`;

export { spontaneousAbsenceStatusQueries };
