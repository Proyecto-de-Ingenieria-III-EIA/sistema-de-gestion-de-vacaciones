import gql from "graphql-tag";

const requestStatusTypes = gql`
    enum Enum_Requested_Absence_Status_Name {
        PENDING
        APPROVED
        REJECTED
    }

    type RequestStatus {
        dbId: ID
        name: Enum_Requested_Absence_Status_Name
        description: String
        
        createdAt: DateTime
        updatedAt: DateTime

        requestedAbsence: [RequestedAbsence]
    }
`;

export { requestStatusTypes };