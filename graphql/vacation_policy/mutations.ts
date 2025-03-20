import gql from "graphql-tag";

const vacationPolicyMutations = gql`
    type Mutation {
        updateVacationPolicy: VacationPolicy
    }
`;

export { vacationPolicyMutations };