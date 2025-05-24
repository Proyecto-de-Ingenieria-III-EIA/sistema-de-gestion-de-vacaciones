import { gql } from "@apollo/client";

/* Solicitudes PENDIENTES que le llegan al jefe */
export const GET_PENDING_REQUESTED_ABSENCES = gql`
  query GetPendingRequestedAbsences {
    getPendingRequestedAbsences {
      dbId
      startDate
      endDate
      type                               # VACATION | INFORMAL | SPONTANEOUS
      colaborator {
        id
        name
        # department                       # asegúrate de exponerlo en tu type User
      }
      justification {                    # solo existe si es INFORMAL
        description
      }
    }
  }
`;
