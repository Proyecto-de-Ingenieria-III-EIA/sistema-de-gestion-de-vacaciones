import gql from "graphql-tag";

const justificationTypes = gql`
    type Justification {
        absenceId: ID
        description: String
        media: String
        comments: String

        createdAt: DateTime
        updatedAt: DateTime
        
        informalAbsence: InformalAbsence
        spontaneousAbsence: SpontaneousAbsence
    }
`
export { justificationTypes };