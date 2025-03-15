import { absenceMutations } from './mutations';
import { absenceTypes } from './types';
import { absenceResolvers } from './resolvers';
import { absenceQueries } from './queries';

const absenceThings = [absenceMutations, absenceTypes, absenceQueries];

export { absenceThings, absenceResolvers };