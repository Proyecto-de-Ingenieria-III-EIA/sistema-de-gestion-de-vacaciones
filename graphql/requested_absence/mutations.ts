import gql from "graphql-tag";

const requestedAbsenceMutations = gql`
    input RequestedAbsenceCreationInput {
        colaboratorId: ID
        startDate: DateTime
        endDate: DateTime
        isVacation: Boolean

        description: String
        mediaUrl: String
    }

    type Mutation{
        # Place holder, so the API can run
        # TODO make a function to accept or deny a requested absence
        createRequestedAbsence(inputs: RequestedAbsenceCreationInput): CompleteSpontaneousAbsence
        makeDecisionRequestedAbsence(absenceId: String, decision: Enum_Requested_Absence_Status_Name): RequestedAbsence
    }
`;

export { requestedAbsenceMutations };