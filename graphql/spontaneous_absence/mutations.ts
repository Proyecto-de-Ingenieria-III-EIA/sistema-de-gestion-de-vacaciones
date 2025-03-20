import gql from "graphql-tag";

const spontaneousAbsenceMutations = gql`
    type Mutation {
        updateSpontaneousAbsence: SpontaneousAbsence
    }
`;

export { spontaneousAbsenceMutations };