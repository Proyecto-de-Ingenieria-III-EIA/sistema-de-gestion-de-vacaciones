import gql from "graphql-tag";

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
    colaboratorId: ID
    startDate: DateTime
    endDate: DateTime
    decisionDate: DateTime

    status: RequestStatus
    aprover: User

    createdAt: DateTime
    updatedAt: DateTime

    vacationAbsence: VacationAbsence
    informalAbsence: InformalAbsence
  }
`;

export { requestedAbsenceTypes };