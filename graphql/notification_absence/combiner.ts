import { notificationAbsenceMutations } from './mutations';
import { notificationAbsenceTypes } from './types';
import { notificationAbsenceResolvers } from './resolvers';
import { notificationAbsenceQueries } from './queries';

const notificationAbsenceThings = [notificationAbsenceMutations, notificationAbsenceTypes, notificationAbsenceQueries];

export { notificationAbsenceThings, notificationAbsenceResolvers };