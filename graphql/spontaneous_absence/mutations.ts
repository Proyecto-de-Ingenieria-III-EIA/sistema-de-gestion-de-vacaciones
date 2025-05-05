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
        # TODO: add a "addEndDate" to an absence, in case the boss added the absence when he didnt 
        # see the colaborator, but he doesnt know when the colaborator will be back
    }
`;

export { spontaneousAbsenceMutations };