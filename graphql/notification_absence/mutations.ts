import gql from "graphql-tag";

const notificationAbsenceMutations = gql`
    type Mutation{
        setAsSeen(absenceId: ID, forBoss: Boolean): Notification_Absence
        setAsUnseen(absenceId: ID, forBoss: Boolean): Notification_Absence
    }
`;

export { notificationAbsenceMutations };