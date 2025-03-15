import { vacationPolicyMutations } from './mutations';
import { vacationPolicyTypes } from './types';
import { vacationPolicyResolvers } from './resolvers';
import { vacationPolicyQueries } from './queries';

const vacationPolicyThings = [vacationPolicyMutations, vacationPolicyTypes, vacationPolicyQueries];

export { vacationPolicyThings, vacationPolicyResolvers };
