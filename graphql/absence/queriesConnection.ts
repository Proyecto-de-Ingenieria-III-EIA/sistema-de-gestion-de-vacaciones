import { gql } from '@apollo/client';

/*  NUEVA query  */
export const GET_ABSENCES_TIME_PERIOD = gql`
  query GetAbsencesTimePeriod($startDate: DateTime!, $endDate: DateTime!) {
    getAbsencesTimePeriod(startDate: $startDate, endDate: $endDate) {
      colaborator {
        id
        name
      }
      startDate
      endDate
      type
      status {
        __typename
        ... on RequestStatus {
          reqName: name
        }
        ... on SpontaneousAbsenceStatus {
          spontName: name
        }
      }
    }
  }
`;

export const GET_ABSENCES_TIME_PERIOD_FOR_DASHBOARD = gql`
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
`;

/* ------------------------------------------------------------------ */
/* Nuevos tipos TypeScript   */
/* ------------------------------------------------------------------ */
export interface Collaborator {
  id: string;
  name: string | null;
}

export type StatusName = 'PENDING' | 'APROVED' | 'REJECTED';

export interface Absence {
  colaborator: { id: string; name: string | null };
  startDate: string;
  endDate: string;
  type: 'VACATION' | 'SPONTANEOUS' | 'INFORMAL';
  status: {
    __typename: 'RequestStatus' | 'SpontaneousAbsenceStatus';
    reqName?: StatusName;
    spontName?: StatusName;
  };
}

export interface GetAbsencesResponse {
  getAbsencesTimePeriod: Absence[];
}
