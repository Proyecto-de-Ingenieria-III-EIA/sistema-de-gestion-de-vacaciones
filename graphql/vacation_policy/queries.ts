import gql from 'graphql-tag';

const vacationPolicyQueries = gql`
  type Query {
    getAllVacationPolicies: [VacationPolicy]
  }
`;

export { vacationPolicyQueries };
