import { notificationAbsenceMutations } from './mutations';
import { notificationAbsenceTypes } from './types';
import { notificationAbsenceResolvers } from './resolvers';
import { notificationAbsenceQueries } from './queries';

const justificationThings = [notificationAbsenceMutations, notificationAbsenceTypes, notificationAbsenceQueries];

export { justificationThings, notificationAbsenceResolvers };