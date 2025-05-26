import { gql } from "@apollo/client";

/* Solicitudes PENDIENTES que le llegan al jefe */
export const GET_PENDING_REQUESTED_ABSENCES = gql`
  query GetPendingRequestedAbsences {
    getPendingRequestedAbsences {
      dbId
      startDate
      endDate
      type                               # INFORMAL | SPONTANEOUS
      colaborator {
        id
        name
      }
      justification {                    # solo existe si es INFORMAL
        description
      }
    }
  }
`;

export const GET_PENDING_SPONT_ABSENCES = gql`
query GetPendingSpontaneousAbssences {
  getPendingSpontaneousAbsences {
    dbId
    startDate
    endDate
    comments
    colaborator {
      id
      name
    }
  }
}`
