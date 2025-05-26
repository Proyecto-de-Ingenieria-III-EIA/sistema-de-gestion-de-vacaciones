import gql from 'graphql-tag';

// Difine a graphQL schema
// We define the object we want o make queries or mutations on
// This should be the complete object that is in the database
// Inside we define the queries we want to make (the names)
// In here if we would execute the query named "getUsers", we will get that result "[User]" (list of users)
// The key of the object is the name of the operation (in this case, mutation), the value is what it returns

// In the resolvers we ought to have the functions that we define here (with the same name)

// With this the person that is going to consume the API, juts has to call the desired function, and in that function,
// specify the fields that he wants to get back. Therefore avoiding under or over fetching

// When we want our queries to receive parameters, we use the parenthesis and specify the type and name of the parameter
const userTypes = gql`
  type User {
    id: ID
    name: String
    email: String
    emailVerified: DateTime
    image: String
    role: Role

    absences: [Absence]
    sessions: [Session]
  }
`;

export { userTypes };
