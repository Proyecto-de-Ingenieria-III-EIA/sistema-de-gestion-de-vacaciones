import gql from "graphql-tag";

const justificationQueries = gql`
    type Query {
        getAllJustifications: [Justification]
    }
`;

export { justificationQueries };