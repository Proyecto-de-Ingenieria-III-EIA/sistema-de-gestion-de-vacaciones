import gql from "graphql-tag";

const absenceMutations = gql`
    type Mutation{
        addCommentToAbsence(absenceId: ID, comments: string): Absence
    }
`;

export { absenceMutations };