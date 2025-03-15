import { vacationAbsenceMutations } from './mutations';
import { vacationAbsenceTypes } from './types';
import { vacationAbsenceResolvers } from './resolvers';
import { vacationAbsenceQueries } from './queries';

const vacationAbsenceThings = [vacationAbsenceMutations, vacationAbsenceTypes, vacationAbsenceQueries];

export { vacationAbsenceThings, vacationAbsenceResolvers };