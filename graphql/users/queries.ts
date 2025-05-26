import gql from 'graphql-tag';

const userQueries = gql`
  type Query {
    getUsers: [User]
    getUserByEmail(email: String!): User
    getCurrentUser: User
    getUserById(id: String!): User
    getSuborditesUser(userId: ID!): [User]
  }
`;

export { userQueries };
