import gql from "graphql-tag";

const justificationMutations = gql`
    input JustificationCreationInput {
        absenceId: String
        description: String
        media: String
    }

    type Mutation{
        createJustification(input: JustificationCreationInput): Justification
        updateJustification(input: JustificationCreationInput): Justification
        addCommentToJustification(absenceId: ID, comments: String): Justification
    }
`;

export { justificationMutations };