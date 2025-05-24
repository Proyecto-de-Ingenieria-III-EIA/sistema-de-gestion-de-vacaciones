import { gql } from "@apollo/client";

/**
 * Enum del schema: APROVED (con 1 "p")  |  REJECTED
 */
export const DECIDE_REQUESTED_ABSENCE = gql`
  mutation MakeDecisionRequestedAbsence(
    $absenceId: String!
    $decision: Enum_Requested_Absence_Status_Name!
  ) {
    makeDecisionRequestedAbsence(absenceId: $absenceId, decision: $decision) {
      absenceId            # nos basta para confirmar
    }
  }
`;
