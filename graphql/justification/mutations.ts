import gql from "graphql-tag";

const justificationMutations = gql`
    type Mutation{
        # Place holder, so the API can run
        updateJustification: Justification
    }
`;

export { justificationMutations };