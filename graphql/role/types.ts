import gql from 'graphql-tag';

const roleTypes = gql`
  enum RoleName {
    ADMIN
    USER
  }

  type Role {
    id: String
    name: RoleName
    users: [User]
    createdAt: DateTime
    updatedAt: DateTime
  }
`;

export { roleTypes };
