import gql from 'graphql-tag';

const vacationAbsenceMutations = gql`
  type Mutation {
    updateVacationAbsence: VacationAbsence
  }
`;

export { vacationAbsenceMutations };
