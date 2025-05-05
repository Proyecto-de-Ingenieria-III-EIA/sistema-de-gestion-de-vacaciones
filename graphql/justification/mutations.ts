import gql from "graphql-tag";

const justificationMutations = gql`
    type Mutation{
        # Place holder, so the API can run
        # TODO: add a create justification mutation
        # TODO: add an "addComment" mutation, for the boss to be able to comment on the justification
        updateJustification: Justification
    }
`;

export { justificationMutations };