import gql from "graphql-tag";

const notificationAbsenceQueries = gql`
    type Query {
        # TODO make a way for a user (boss or otherwise) to see all its notifications
        getUserNotifications(userId: ID): [Notification_Absence]
    }
`;

export { notificationAbsenceQueries };