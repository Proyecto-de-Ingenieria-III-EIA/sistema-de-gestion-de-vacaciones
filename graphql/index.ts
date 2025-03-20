import gql from "graphql-tag";
import { userThings, userResolvers } from "./users/combiner";
import { sessionThings } from "./session/combiner";
import { roleThings } from "./role/combiner";
import { absenceThings, absenceResolvers } from "./absence/combiner";
import { informalAbsenceThings, informalAbsenceResolvers } from "./informal_absence/combiner";
import { justificationThings, justificationResolvers } from "./justification/combiner";
import { requestStatusThings, requestStatusResolvers } from "./request_status/combiner";
import { spontaneousAbsenceThings, spontaneousAbsenceResolvers } from "./spontaneous_absence/combiner";
import { spontaneousAbsenceStatusThings, spontaneousAbsenceStatusResolvers } from "./spontaneous_absence_status/combiner";
import { vacationAbsenceThings, vacationAbsenceResolvers } from "./vacation_absence/combiner";
import { vacationPolicyThings, vacationPolicyResolvers } from "./vacation_policy/combiner";
import { requestedAbsenceThings, requestedAbsenceResolvers } from "./requested_absence/combiner";

const defaultTypes = gql`
    scalar DateTime
    scalar JSON
`;

const types = [
    ...userThings,
    ...sessionThings,
    ...roleThings,
    ...absenceThings,
    ...informalAbsenceThings,
    ...justificationThings,
    ...requestStatusThings,
    ...spontaneousAbsenceThings,
    ...spontaneousAbsenceStatusThings,
    ...vacationAbsenceThings,
    ...vacationPolicyThings,
    ...requestedAbsenceThings,
    defaultTypes, 
];

const resolvers = [
    userResolvers,
    absenceResolvers,
    informalAbsenceResolvers,
    justificationResolvers,
    requestStatusResolvers,
    spontaneousAbsenceResolvers,
    spontaneousAbsenceStatusResolvers,
    vacationAbsenceResolvers,
    vacationPolicyResolvers,
    requestedAbsenceResolvers,
];

export {
    types,
    resolvers
};