import gql from 'graphql-tag';

const absenceTypes = gql`
  enum AbsenceType {
    VACATION
    INFORMAL
    SPONTANEOUS
  }

  type Absence {
    dbId: ID
    colaboratorId: ID
    startDate: DateTime
    endDate: DateTime
    valid: Boolean
    reviewer: ID

    createdAt: DateTime
    updatedAt: DateTime

    colaborator: User
    reviewerObject: User

    requestedAbsence: RequestedAbsence
    spontaneousAbsence: SpontaneousAbsence
  }

  union AbsenceStatus = RequestStatus | SpontaneousAbsenceStatus

  type CompleteAbsence {
    dbId: ID
    startDate: DateTime
    endDate: DateTime
    decisionDate: DateTime

    colaborator: User
    status: AbsenceStatus
    reviewer: User
    type: AbsenceType
    justification: Justification

    createdAt: DateTime
    updatedAt: DateTime
  }
`;

export { absenceTypes };
