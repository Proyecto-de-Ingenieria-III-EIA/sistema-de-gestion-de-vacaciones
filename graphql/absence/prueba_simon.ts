import { gql } from "@apollo/client"

export const GET_ABSENCES_TIME_PERIOD = gql`
  query GetAbsencesTimePeriod($startDate: DateTime!, $endDate: DateTime!) {
    getAbsencesTimePeriod(startDate: $startDate, endDate: $endDate) {
      colaborator {
        name
        id
      }
      startDate
      endDate
      type
    }
  }
`

// Tipos para TypeScript
export interface Collaborator {
  id: string
  name: string
}

export interface Absence {
  colaborator: Collaborator
  startDate: string
  endDate: string
  type: "VACATION" | "SPONTANEOUS" | "INFORMAL"
}

export interface GetAbsencesResponse {
  getAbsencesTimePeriod: Absence[]
}
