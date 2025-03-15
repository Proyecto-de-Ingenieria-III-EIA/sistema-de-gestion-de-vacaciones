import { spontaneousAbsenceMutations } from './mutations';
import { spontaneousAbsenceTypes } from './types';
import { spontaneousAbsenceResolvers } from './resolvers';
import { spontaneousAbsenceQueries } from './queries';

const spontaneousAbsenceThings = [spontaneousAbsenceMutations, spontaneousAbsenceTypes, spontaneousAbsenceQueries];

export { spontaneousAbsenceThings, spontaneousAbsenceResolvers };
