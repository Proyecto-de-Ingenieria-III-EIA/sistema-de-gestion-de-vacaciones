import gql from "graphql-tag";

const absenceMutations = gql`
    type Mutation{
        addCommentToAbsence(absenceId: ID, comments: String): Absence
        setAbsenceAsSeen(absenceId: ID): Absence
        setAbsenceAsNotSeen(absenceId: ID): Absence
    }
`;

export { absenceMutations };