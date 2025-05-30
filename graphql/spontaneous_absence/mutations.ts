import gql from 'graphql-tag';

const spontaneousAbsenceMutations = gql`
  input SpontaneousAbsenceCreationInput {
    colaboratorId: ID
    startDate: DateTime
    endDate: DateTime
    comments: String
  }

  type Mutation {
    # The creator of the absence is the user who is logged in
    createSpontaneousAbsence(
      inputs: SpontaneousAbsenceCreationInput
    ): CompleteSpontaneousAbsence
    # In case the boss added the absence when he didnt
    # see the colaborator, but he doesnt know when the colaborator will be back
    addEndDateToSpontaneousAbsence(
      absenceId: ID
      endDate: DateTime
    ): SpontaneousAbsence
    makeDecisionSpontaneousAbsence(
      absenceId: ID
      decision: Enum_Spotaneus_Absence_Status_Name
    ): SpontaneousAbsence
  }
`;

export { spontaneousAbsenceMutations };
