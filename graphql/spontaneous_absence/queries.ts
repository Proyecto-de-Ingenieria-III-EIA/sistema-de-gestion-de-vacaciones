import gql from "graphql-tag";

const spontaneousAbsenceQueries = gql`
    type Query {
        getAllSpontaneousAbsences: [SpontaneousAbsence]
    }
`;

export { spontaneousAbsenceQueries };