import { StatusNotFoundError } from "@/errors/StatusNotFoundError";
import { OurContext } from "../context";
import { User, Justification, Absence, SpontaneousAbsenceStatus, Enum_Spotaneus_Absence_Status_Name, Enum_RoleName } from "@prisma/client";
import { ColaboratorNotFoundError } from "@/errors/ColaboratorNotFoundError";
import { DateError } from "@/errors/DateError";
import { AbsenceNotFoundError } from "@/errors/AbsenceNotFoundError";
import { NotSufficentCredentialsError } from "@/errors/NotSufficentCredentialsError";
import { Enum_Absence_Type } from "../absence/enum_absence_type";
import { IncorrectInputError } from "@/errors/IncorrectInputError";
import { messages } from "../notification_absence/messages";

interface SpontaneousAbsenceCreation {
    colaboratorId: string;
    startDate: Date;
    endDate: Date | null;// Null is in case the boss added the absence when he saw the colaborator wasnt there,
    //  but he doesnt know when the colaborator will be back
    comments: string | null;
}

interface CompleteSpontaneousAbsence {
    dbId: string;
    colaboratorId: string;
    startDate: Date;
    endDate: Date;
    createdById: string;
    comments: string;
    statusId: string;

    colaborator: User;
    createdBy: User;
    absenceStatus: SpontaneousAbsenceStatus;
    justification: Justification;
}

interface SpontaneousAbsence {
    absenceId: string;
    comments: string;
    statusId: string;

    createdAt: Date;
    updatedAt: Date;
}

const spontaneousAbsenceResolvers = {
    Mutation: {
        createSpontaneousAbsence: async (parent: null, 
                            { inputs }: { inputs: SpontaneousAbsenceCreation },
                            context: OurContext) => {
            return await context.db.$transaction(async (tx) => {
                const colaborator = await tx.user.findUnique({
                    where: {
                        id: inputs.colaboratorId,
                    }
                });

                if (!colaborator) {
                    throw new ColaboratorNotFoundError('Colaborator not found');
                }
                const startDate = new Date(inputs.startDate);
                const endDate = (inputs.endDate) ? new Date(inputs.endDate) : new Date(startDate.getTime() + 5 * 60 * 1000); // Default to 5 minutes later

                if (startDate > endDate) {
                    throw new DateError('Start date cannot be after end date');
                }

                const absence = await tx.absence.create({
                    data: {
                        colaboratorId: inputs.colaboratorId,
                        startDate: startDate,
                        endDate: endDate,
                        comments: inputs.comments,
                        createdBy: context.authData.userId,
                        updatedAt: new Date(),
                        reviewer: colaborator?.bossId || context.authData.userId,
                    }
                });

                const spontaneousAbsence = await tx.spontaneousAbsence.create({
                    data: {
                        absenceId: absence.dbId,
                        // by default, spontaneous_absence is PENDING (defined in the prisma)
                        updatedAt: new Date(),
                        endDateAdded: inputs.endDate ? true : false,
                    }
                });

                await tx.absenceNotification.update({
                    where: {
                        absenceId: absence.dbId
                    },
                    data: {
                        isForWorker: true,
                        hasBeenSeen: false,
                        message: messages.spontaneousAbsenceCreation,
                    }
                });

                return {
                    dbId: absence.dbId,
                    colaboratorId: absence.colaboratorId,
                    startDate: absence.startDate,
                    endDate: absence.endDate,
                    createdById: absence.createdBy,
                    comments: absence.comments,
                    statusId: spontaneousAbsence.status,
                }
            });
        },
        addEndDateToSpontaneousAbsence: async (parent: null, 
                                        { absenceId, endDate }: { absenceId: string, endDate: Date }, 
                                        context: OurContext) => {
            const absence = await context.db.absence.findUnique({
                where: {
                    dbId: absenceId,
                }
            });

            if (!absence) {
                throw new AbsenceNotFoundError('Absence not found');
            }
            
            if (absence.createdBy !== context.authData.userId) {
                throw new NotSufficentCredentialsError('You are not allowed to add an end date to this absence');
            }

            if (absence.startDate > endDate) {
                throw new DateError('Start date cannot be after end date');
            }

            const date = new Date(endDate);

            return await context.db.$transaction(async (tx) => {
                const absence = await tx.absence.update({
                    where: {
                        dbId: absenceId,
                    },
                    data: {
                        endDate: date
                    },
                });

                const spontaneousAbsence = await tx.spontaneousAbsence.update({
                    where: {
                        absenceId: absenceId,
                    },
                    data: {
                        endDateAdded: true,
                    },
                });

                await tx.absenceNotification.update({
                    where: {
                        absenceId,
                    },
                    data: {
                        isForWorker: true,
                        hasBeenSeen: false,
                        message: messages.spontaneousAbsenceAddedEndDate,
                    }
                });

                return {
                    absenceId: spontaneousAbsence.absenceId,
                    comments: absence.comments,
                    statusId: spontaneousAbsence.status,

                    createdAt: spontaneousAbsence.createdAt,
                    updatedAt: spontaneousAbsence.updatedAt,
                }
            });
        },
        makeDecisionSpontaneousAbsence: async (parent: null, 
            args: { absenceId: string, decision: Enum_Spotaneus_Absence_Status_Name }, 
            { db, authData }: OurContext) => {
                if (authData.role !== Enum_RoleName.ADMIN)
                    throw new NotSufficentCredentialsError();

                if ((await db.requestedAbsence.count({
                        where: {
                            absenceId: args.absenceId,
                        }
                    })) === 0)
                    throw new AbsenceNotFoundError();

                const spontAbsenceStatus = await db.spontaneousAbsenceStatus.findFirst({
                    where: {
                        name: args.decision,
                    }
                });

                if (!spontAbsenceStatus)
                    throw new IncorrectInputError("The status name provided is not valid");


                return db.$transaction(async (tx) => {
                        await tx.absenceNotification.update({
                            where: {
                                absenceId: args.absenceId,
                            },
                            data: {
                                isForWorker: true,
                                hasBeenSeen: false,
                                message: messages.spontaneousAbsenceDecisionMade,
                            }
                        });

                        return await tx.spontaneousAbsence.update({
                            where: {
                                absenceId: args.absenceId,
                            },
                            data: {
                                status: spontAbsenceStatus.dbId,
                            }
                        });
                });
        }
    },
    CompleteSpontaneousAbsence: {  
        colaborator: (parent: CompleteSpontaneousAbsence, args: null, context: OurContext) => {
            console.log(parent);
            return context.db.user.findUnique({
                where: {
                    id: parent.colaboratorId,
                }
            });
        },
        createdBy: (parent: CompleteSpontaneousAbsence, args: null, context: OurContext) => {
            return context.db.user.findUnique({
                where: {
                    id: parent.createdById,
                }
            });
        },
        absenceStatus: (parent: CompleteSpontaneousAbsence, args: null, context: OurContext) => {
            return context.db.spontaneousAbsenceStatus.findUnique({
                where: {
                    dbId: parent.statusId,
                }
            });
        },
        justification: (parent: CompleteSpontaneousAbsence, args: null, context: OurContext) => {
            return context.db.justification.findFirst({
                where: {
                    absenceId: parent.dbId,
                }
            });
        },
    },
    SpontaneousAbsence: {
        parentAbsence: async (parent: SpontaneousAbsence, args: null, context: OurContext) => {
            return await context.db.absence.findUnique({
                where: {
                    dbId: parent.absenceId,
                }
            });
        },
        status: async (parent: SpontaneousAbsence, args: null, context: OurContext) => {
            return await context.db.spontaneousAbsenceStatus.findUnique({
                where: {
                    dbId: parent.statusId,
                }
            });
        },
        justification: async (parent: SpontaneousAbsence, args: null, context: OurContext) => {
            return await context.db.justification.findFirst({
                where: {
                    absenceId: parent.absenceId,
                }
            });
        },
    }

};

export { spontaneousAbsenceResolvers };