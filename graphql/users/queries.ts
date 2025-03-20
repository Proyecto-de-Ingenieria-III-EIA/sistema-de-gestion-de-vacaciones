import gql from "graphql-tag";

const userQueries = gql` 
  type Query {
    getUsers: [User]
    getUserByEmail (email: String!): User
    getCurrentUser: User
    getUserById (id: String!): User
  }
`

export { userQueries };