import gql from 'graphql-tag';

const vacationAbsenceQueries = gql`
  type Query {
    getAllVacationAbsences: [VacationAbsence]
  }
`;

export { vacationAbsenceQueries };
