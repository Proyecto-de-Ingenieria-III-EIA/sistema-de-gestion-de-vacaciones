import gql from 'graphql-tag';

const requestedAbsenceTypes = gql`
  type RequestedAbsence {
    absenceId: ID
    status: String
    aprover: ID
    decisionDate: DateTime

    createdAt: DateTime
    updatedAt: DateTime

    absence: Absence
    currentStatus: RequestStatus
    aproverUser: User

    vacationAbsence: VacationAbsence
    informalAbsence: InformalAbsence
  }

  type WholeRequestedAbsence {
    dbId: ID
    startDate: DateTime
    endDate: DateTime
    decisionDate: DateTime

    colaborator: User
    status: RequestStatus
    reviewer: User
    type: AbsenceType
    justification: Justification

    createdAt: DateTime
    updatedAt: DateTime
  }
`;

export { requestedAbsenceTypes };
