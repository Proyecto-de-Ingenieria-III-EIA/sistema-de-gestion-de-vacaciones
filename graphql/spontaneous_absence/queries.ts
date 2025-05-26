import gql from "graphql-tag";

const spontaneousAbsenceQueries = gql`
    type Query {
        getAllSpontaneousAbsences: [SpontaneousAbsence],
        getPendingSpontaneousAbsences: [CompleteSpontaneousAbsence]
    }
`;

export { spontaneousAbsenceQueries };