import { justificationMutations } from './mutations';
import { justificationTypes } from './types';
import { justificationResolvers } from './resolvers';
import { justificationQueries } from './queries';

const justificationThings = [justificationMutations, justificationTypes, justificationQueries];

export { justificationThings, justificationResolvers };