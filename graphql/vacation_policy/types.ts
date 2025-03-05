import { gql } from 'graphql-tag';

const vacationPolicyTypes = gql`
    type VacationPolicy {
        dbId: ID
        year: Int
        legalRequirements: Int
        companyPolicy: Int
        active: Boolean

        createdAt: DateTime
        updatedAt: DateTime

        vacationAbsence: [VacationAbsence]
    }
`;

export { vacationPolicyTypes };