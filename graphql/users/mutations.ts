import gql from "graphql-tag";

const userMutations = gql` 
  type Mutation{
    updateUserRole(userId: String, roleName: String): User
    updateUser: User
  }
`;

export { userMutations };