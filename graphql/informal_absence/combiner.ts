import { informalAbsenceResolvers } from './resolvers';
import { informalAbsenceQueries } from './queries';
import { informalAbsenceMutations } from './mutations';
import { informalAbsenceTypes } from './types';

const combinerThings = [informalAbsenceMutations, informalAbsenceTypes, informalAbsenceQueries];

export { combinerThings, informalAbsenceResolvers };
