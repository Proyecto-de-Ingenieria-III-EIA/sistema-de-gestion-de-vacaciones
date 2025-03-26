import gql from "graphql-tag";

const spontaneousAbsenceMutations = gql`
    input SpontaneousAbsenceCreationInput {
        colaboratorId: ID
        startDate: DateTime
        endDate: DateTime
        comments: String
    }

    type Mutation {
        # The creator of the absence is the user who is logged in
        createSpontaneousAbsence(inputs: SpontaneousAbsenceCreationInput): CompleteSpontaneousAbsence
    }
`;

export { spontaneousAbsenceMutations };