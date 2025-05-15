import gql from "graphql-tag";

const notificationAbsenceMutations = gql`
    type Mutation{
        updateNotificationAbsence(): Notification_Absence
    }
`;

export { notificationAbsenceMutations };