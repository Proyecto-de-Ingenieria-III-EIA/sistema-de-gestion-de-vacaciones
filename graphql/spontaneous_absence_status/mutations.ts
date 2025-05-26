import gql from 'graphql-tag';

const spontaneousAbsenceStatusMutations = gql`
  type Mutation {
    updateSpontaneousAbsenceStatus: SpontaneousAbsenceStatus
  }
`;

export { spontaneousAbsenceStatusMutations };
