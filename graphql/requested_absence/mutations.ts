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
        createRequestedAbsence(inputs: RequestedAbsenceCreationInput): CompleteSpontaneousAbsence
    }
`;

export { requestedAbsenceMutations };