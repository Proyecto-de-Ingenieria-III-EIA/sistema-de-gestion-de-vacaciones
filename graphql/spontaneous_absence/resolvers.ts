import { StatusNotFoundError } from "@/errors/StatusNotFoundError";
import { OurContext } from "../context";
import { User, Justification, Absence, SpontaneousAbsence, SpontaneousAbsenceStatus, Enum_Spotaneus_Absence_Status_Name } from "@prisma/client";
import { ColaboratorNotFoundError } from "@/errors/ColaboratorNotFoundError";
import { DateError } from "@/errors/DateError";

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
    absenceStatusId: string;

    colaborator: User;
    createdBy: User;
    absenceStatus: SpontaneousAbsenceStatus;
    justification: Justification;
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
                        createdBy: context.authData.userId,
                        updatedAt: new Date(),
                        reviewer: colaborator?.bossId || context.authData.userId,
                    }
                });

                const spontaneousAbsence = await tx.spontaneousAbsence.create({
                    data: {
                        absenceId: absence.dbId,
                        comments: inputs.comments,
                        // by default, absence is PENDING (defined in the prisma)
                        updatedAt: new Date(),
                        endDateAdded: inputs.endDate ? true : false,
                    }
                });

                return {
                    dbId: absence.dbId,
                    colaboratorId: absence.colaboratorId,
                    startDate: absence.startDate,
                    endDate: absence.endDate,
                    createdById: absence.createdBy,
                    comments: spontaneousAbsence.comments,
                    absenceStatusId: spontaneousAbsence.status,
                }
            });
        },
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
                    dbId: parent.absenceStatusId,
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
    }
};

export { spontaneousAbsenceResolvers };