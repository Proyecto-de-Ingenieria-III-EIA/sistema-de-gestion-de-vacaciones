import gql from "graphql-tag";

const justificationTypes = gql`
    type Justification {
        absenceId: ID
        description: String
        media: String
        uploadedAt: DateTime
        comments: String

        createdAt: DateTime
        updatedAt: DateTime
        
        # TODO add this resolvers
        informalAbsence: InformalAbsence
        spontaneousAbsence: SpontaneousAbsence
    }
`
export { justificationTypes };