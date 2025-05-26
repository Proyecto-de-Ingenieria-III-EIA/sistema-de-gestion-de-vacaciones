import gql from 'graphql-tag';

const requestedAbsenceMutations = gql`
  input RequestedAbsenceCreationInput {
    colaboratorId: ID
    startDate: DateTime
    endDate: DateTime
    isVacation: Boolean

    description: String
    mediaUrl: String
  }

  type Mutation {
    createRequestedAbsence(
      inputs: RequestedAbsenceCreationInput
    ): WholeRequestedAbsence
    makeDecisionRequestedAbsence(
      absenceId: String
      decision: Enum_Requested_Absence_Status_Name
    ): RequestedAbsence
  }
`;

export { requestedAbsenceMutations };
