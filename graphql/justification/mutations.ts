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
        # Place holder, so the API can run
        # TODO: add a create justification mutation
        # TODO: add an "addComment" mutation, for the boss to be able to comment on the justification
        createJustification(input: JustificationCreationInput): Justification
        updateJustification(input: JustificationCreationInput): Justification
        addCommentToJustification: Justification
    }
`;

export { justificationMutations };