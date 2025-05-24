import gql from "graphql-tag";

const spontaneousAbsenceTypes = gql`
    type SpontaneousAbsence {
        absenceId: ID
        comments: String
        statusId: ID

        createdAt: DateTime
        updatedAt: DateTime

        parentAbsence: Absence
        status: SpontaneousAbsenceStatus

        justification: Justification
    }

    type CompleteSpontaneousAbsence {
        dbId: ID
        colaboratorId: ID
        startDate: DateTime
        endDate: DateTime
        createdById: ID
        comments: String
        statusId: ID
        reviewer: ID

        colaborator: User
        createdBy: User
        absenceStatus: SpontaneousAbsenceStatus
        justification: Justification
        reviewerObject: User
    }
`;

export { spontaneousAbsenceTypes };