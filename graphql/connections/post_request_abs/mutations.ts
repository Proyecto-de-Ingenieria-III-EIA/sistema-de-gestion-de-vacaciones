import { gql } from "@apollo/client"

export const CREATE_REQUESTED_ABSENCE = gql`
  mutation CreateRequestedAbsence($inputs: RequestedAbsenceCreationInput!) {
    createRequestedAbsence(inputs: $inputs) {
      dbId
      colaboratorId
      startDate
      endDate
      decisionDate
      type
      aprover
      createdAt
      updatedAt
    }
  }
`

export const CREATE_SPONTANEOUS_ABSENCE = gql`
  mutation CreateSpontaneousAbsence($inputs: SpontaneousAbsenceCreation!) {
    createSpontaneousAbsence(inputs: $inputs) {
      dbId
      colaboratorId
      startDate
      endDate
      createdById
      comments
      statusId
    }
  }
`
