import { requestedAbsenceMutations } from './mutations';
import { requestedAbsenceTypes } from './types';
import { requestedAbsenceResolvers } from './resolvers';
import { requestedAbsenceQueries } from './queries';

const requestedAbsenceThings = [
  requestedAbsenceMutations,
  requestedAbsenceTypes,
  requestedAbsenceQueries,
];

export { requestedAbsenceThings, requestedAbsenceResolvers };
