import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      #   department
    }
  }
`;

export const GET_ME = gql`
  query getCurrentUser {
    getCurrentUser {
      id
      name
      role {
        name
      }
    }
  }
`;

export const GET_ABSENCES_TIME_PERIOD_FOR_DASHBOARD = gql`
  query GetAbsencesTimePeriod($startDate: DateTime!, $endDate: DateTime!) {
    getAbsencesTimePeriod(startDate: $startDate, endDate: $endDate) {
      dbId
      startDate
      endDate
      type # ENUM: VACATION | INFORMAL | SPONTANEOUS
      colaborator {
        id
        # Si tu tipo User tiene 'department', añádelo:
        # department
      }
    }
  }
`;
