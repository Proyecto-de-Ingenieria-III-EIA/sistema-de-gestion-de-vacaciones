import { requestStatusMutations } from './mutations';
import { requestStatusTypes } from './types';
import { requestStatusResolvers } from './resolvers';
import { requestStatusQueries } from './queries';

const requestStatusThings = [
  requestStatusMutations,
  requestStatusTypes,
  requestStatusQueries,
];

export { requestStatusThings, requestStatusResolvers };
