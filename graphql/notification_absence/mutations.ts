import gql from 'graphql-tag';

const notificationAbsenceMutations = gql`
  type Mutation {
    setNotificationAsSeen(absenceId: ID, forBoss: Boolean): Notification_Absence
    setNotificationAsUnseen(
      absenceId: ID
      forBoss: Boolean
    ): Notification_Absence
  }
`;

export { notificationAbsenceMutations };
