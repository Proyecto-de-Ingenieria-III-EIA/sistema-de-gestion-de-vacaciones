import { gql } from "@apollo/client";

export const DECIDE_REQUESTED_ABSENCE = gql`
  mutation DecideRequestedAbsence($absenceId: String!, $decision: Enum_Requested_Absence_Status_Name!) {
    makeDecisionRequestedAbsence(absenceId: $absenceId, decision: $decision) {
      absenceId
    }
  }
`

export const DECIDE_SPONTANEOUS_ABSENCE = gql`
  mutation DecideSpontaneousAbsence($absenceId: ID!, $decision: Enum_Spotaneus_Absence_Status_Name!) {
    makeDecisionSpontaneousAbsence(absenceId: $absenceId, decision: $decision) {
      absenceId
    }
  }
`;


