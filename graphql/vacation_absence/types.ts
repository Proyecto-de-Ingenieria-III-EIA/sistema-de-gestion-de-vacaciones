import { gql } from 'graphql-tag';

const vacationAbsenceTypes = gql`
  type VacationAbsence {
    absenceId: ID
    policyUnder: String
    createdAt: DateTime
    updatedAt: DateTime
    requestedAbsence: RequestedAbsence
    policy: VacationPolicy
  }
`;

export { vacationAbsenceTypes };
