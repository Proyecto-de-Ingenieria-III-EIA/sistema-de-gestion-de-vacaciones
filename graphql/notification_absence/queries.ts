import gql from "graphql-tag";

const notificationAbsenceQueries = gql`
    type Query {
        getAllNotifications: [Notification_Absence]
    }
`;

export { notificationAbsenceQueries };