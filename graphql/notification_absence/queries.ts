import gql from "graphql-tag";

const notificationAbsenceQueries = gql`
    type Query {
        getUserNotifications(userId: ID): [Notification_Absence]
    }
`;

export { notificationAbsenceQueries };