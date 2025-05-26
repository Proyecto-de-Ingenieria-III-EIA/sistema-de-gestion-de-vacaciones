import { informalAbsenceResolvers } from './resolvers';
import { informalAbsenceQueries } from './queries';
import { informalAbsenceMutations } from './mutations';
import { informalAbsenceTypes } from './types';

const informalAbsenceThings = [
  informalAbsenceMutations,
  informalAbsenceTypes,
  informalAbsenceQueries,
];

export { informalAbsenceThings, informalAbsenceResolvers };
