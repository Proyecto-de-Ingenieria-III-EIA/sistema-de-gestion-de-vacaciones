import gql from "graphql-tag";

const sessionTypes = gql`
  type Session {
    sessionToken: String
    userId: ID
    expires: DateTime
    UpdatedAt: DateTime
    user: User
  }
`

export { sessionTypes };