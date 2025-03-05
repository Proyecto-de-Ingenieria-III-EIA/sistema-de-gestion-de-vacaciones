import { gql } from 'graphql-tag';

const informalAbsenceTypes = gql`
    type InformalAbsence {
        absenceId: ID

        createdAt: DateTime
        updatedAt: DateTime

        requestedAbsence: RequestedAbsence

        justification: Justification
    }
`;

export { informalAbsenceTypes };
