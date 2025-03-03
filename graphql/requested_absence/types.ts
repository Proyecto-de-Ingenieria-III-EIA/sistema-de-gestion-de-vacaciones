import gql from "graphql-tag";

const requestedAbsenceType = gql`
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

        vacationAbsence: vacationAbsence
        informalAbsence: informalAbsence
    }
`;

export { requestedAbsenceType };