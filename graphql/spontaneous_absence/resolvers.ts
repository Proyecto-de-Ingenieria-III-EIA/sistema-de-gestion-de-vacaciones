import { StatusNotFoundError } from "@/errors/StatusNotFoundError";
import { OurContext } from "../context";
import { User, Justification, Absence, SpontaneousAbsence, SpontaneousAbsenceStatus, Enum_Spotaneus_Absence_Status_Name } from "@prisma/client";

interface SpontaneousAbsenceCreation {
    colaboratorId: string;
    startDate: Date;
    endDate: Date;
    comments: string;
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
                const absence = await tx.absence.create({
                    data: {
                        colaboratorId: inputs.colaboratorId,
                        startDate: new Date(inputs.startDate),
                        endDate: new Date(inputs.endDate),
                        createdBy: context.authData.userId,
                        updatedAt: new Date(),
                    }
                });

                const spontaneousAbsenceStatus = await tx.spontaneousAbsenceStatus.findFirst({
                    where: {
                        name: Enum_Spotaneus_Absence_Status_Name.PENDING,
                    }
                });
                
                if (!spontaneousAbsenceStatus) {
                    throw new StatusNotFoundError('Spontaneous Absence Status not found');
                }

                const spontaneousAbsence = await tx.spontaneousAbsence.create({
                    data: {
                        absenceId: absence.dbId,
                        comments: inputs.comments,
                        absenceStatus: spontaneousAbsenceStatus.dbId,
                        updatedAt: new Date(),
                    }
                });

                return {
                    dbId: absence.dbId,
                    colaboratorId: absence.colaboratorId,
                    startDate: absence.startDate,
                    endDate: absence.endDate,
                    createdById: absence.createdBy,
                    comments: spontaneousAbsence.comments,
                    absenceStatusId: spontaneousAbsence.absenceStatus,
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