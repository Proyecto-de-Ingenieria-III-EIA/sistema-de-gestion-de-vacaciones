import { userMutations } from "./mutations";
import { userTypes } from "./types";
import { userResolvers } from "./resolvers";
import { userQueries } from "./queries";

const userThings = [userMutations, userTypes, userQueries];

export { userThings, userResolvers };
