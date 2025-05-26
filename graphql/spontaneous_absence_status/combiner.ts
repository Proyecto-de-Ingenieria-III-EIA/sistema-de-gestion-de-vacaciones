import { spontaneousAbsenceStatusMutations } from './mutations';
import { spontaneousAbsenceStatusTypes } from './types';
import { spontaneousAbsenceStatusResolvers } from './resolvers';
import { spontaneousAbsenceStatusQueries } from './queries';

const spontaneousAbsenceStatusThings = [
  spontaneousAbsenceStatusMutations,
  spontaneousAbsenceStatusTypes,
  spontaneousAbsenceStatusQueries,
];

export { spontaneousAbsenceStatusThings, spontaneousAbsenceStatusResolvers };
