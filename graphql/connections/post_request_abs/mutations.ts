import { gql } from '@apollo/client';

// export const CREATE_REQUESTED_ABSENCE = gql`
//   mutation CreateRequestedAbsence($inputs: RequestedAbsenceCreationInput!) {
//     createRequestedAbsence(inputs: $inputs) {
//       dbId
//       colaboratorId
//       startDate
//       endDate
//       decisionDate
//       type
//       aprover
//       createdAt
//       updatedAt
//     }
//   }
// `

// export const CREATE_SPONTANEOUS_ABSENCE = gql`
//   mutation CreateSpontaneousAbsence($inputs: SpontaneousAbsenceCreation!) {
//     createSpontaneousAbsence(inputs: $inputs) {
//       dbId
//       colaboratorId
//       startDate
//       endDate
//       createdById
//       comments
//       statusId
//     }
//   }
// `

export const CREATE_REQUESTED_ABSENCE_FOR_POST = gql`
  mutation CreateRequestedAbsence($inputs: RequestedAbsenceCreationInput) {
    createRequestedAbsence(inputs: $inputs) {
      dbId
    }
  }
`;

export const CREATE_SPONTANEOUS_ABSENCE_FOR_POST = gql`
  mutation CreateSpontaneousAbsence($inputs: SpontaneousAbsenceCreationInput) {
    createSpontaneousAbsence(inputs: $inputs) {
      dbId
    }
  }
`;
