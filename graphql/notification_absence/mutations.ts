import gql from "graphql-tag";

const notificationAbsenceMutations = gql`
    type Mutation{
        updateNotificationAbsence(): Notification_Absence
        setAsSeen(absenceId: ID, forBoss: Boolean): bool
        setAsUnseen(absenceId: ID, forBoss: Boolean): bool
    }
`;

export { notificationAbsenceMutations };