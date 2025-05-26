import { gql } from 'graphql-tag';

const spontaneousAbsenceStatusTypes = gql`
  enum Enum_Spotaneus_Absence_Status_Name {
    PENDING
    APROVED
    REJECTED
  }

  type SpontaneousAbsenceStatus {
    dbId: ID
    name: Enum_Spotaneus_Absence_Status_Name
    description: String

    createdAt: DateTime
    updatedAt: DateTime

    spontaneousAbsence: [SpontaneousAbsence]
  }
`;

export { spontaneousAbsenceStatusTypes };
