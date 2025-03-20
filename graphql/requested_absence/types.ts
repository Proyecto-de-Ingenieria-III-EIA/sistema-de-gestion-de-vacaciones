import gql from "graphql-tag";

const requestedAbsenceTypes = gql`
  enum RequestedAbsenceType {
    VACATION
    INFORMAL
  }

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
    colaboratorId: User
    startDate: DateTime
    endDate: DateTime
    decisionDate: DateTime
    type: RequestedAbsenceType

    status: RequestStatus
    aprover: User

    createdAt: DateTime
    updatedAt: DateTime
  }
`;

export { requestedAbsenceTypes };