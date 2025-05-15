import gql from "graphql-tag";

const notificationAbsenceTypes = gql`
    # The notifications are created by a trigger in the database
    type Notification_Absence {
        absenceId: String
        isForBoss: Boolean
        isForWorker: Boolean
        notificationMessage: String

        absence: Absence 
    }
`
export { notificationAbsenceTypes };