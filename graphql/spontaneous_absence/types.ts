import gql from "graphql-tag";

const spontaneousAbsenceTypes = gql`
    type SpontaneousAbsence {
        absenceId: ID
        comments: String
        absenceStatus: String

        createdAt: DateTime
        updatedAt: DateTime

        parentAbsence: Absence
        status: SpontaneousAbsenceStatus

        justification: Justification
    }
`;

export { spontaneousAbsenceTypes };