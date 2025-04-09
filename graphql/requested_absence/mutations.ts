import gql from "graphql-tag";

const requestedAbsenceMutations = gql`
    input RequestedAbsenceCreationInput {
        colaboratorId: ID
        startDate: DateTime
        endDate: DateTime
        comments: String
        isVacation: Boolean
    }

    type Mutation{
        # Place holder, so the API can run
        createRequestedAbsence(inputs: RequestedAbsenceCreationInput): RequestedAbsence
    }
`;

export { requestedAbsenceMutations };