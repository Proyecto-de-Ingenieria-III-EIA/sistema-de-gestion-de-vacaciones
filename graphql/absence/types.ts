import gql from "graphql-tag";

const absenceTypes = gql`
    type Absence {
        dbId: ID
        colaboratorId: ID
        startDate: DateTime
        endDate: DateTime
        valid: Boolean
        
        createdAt: DateTime
        updatedAt: DateTime

        colaborator: User

        requestedAbsence: RequestedAbsence
        spontaneousAbsence: SpontaneousAbsence
    }
`;

export { absenceTypes };