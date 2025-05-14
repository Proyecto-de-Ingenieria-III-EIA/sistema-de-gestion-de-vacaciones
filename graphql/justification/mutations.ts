import gql from "graphql-tag";

const justificationMutations = gql`
    input JustificationCreationInput {
        absenceId: String
        description: String
        media: String
        comments: String  # Technically, when creating the comments should always be null or empty, since
            # Is the boss after reviewing the one who adds them
    }

    type Mutation{
        createJustification(input: JustificationCreationInput): Justification
        updateJustification(input: JustificationCreationInput): Justification
    }
`;

export { justificationMutations };