import gql from "graphql-tag";

const notificationAbsenceTypes = gql`
    # The notifications are created by a trigger in the database
    type Notification_Absence {
        absenceId: ID
        isForBoss: Boolean
        isForWorker: Boolean
        notificationMessage: String
        hasBeenSeen: Boolean

        absence: Absence 
    }
`;
export { notificationAbsenceTypes };