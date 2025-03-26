import { StatusNotFoundError } from "@/errors/StatusNotFoundError";
import { OurContext } from "../context";
import { Absence, SpontaneousAbsence, SpontaneousAbsenceStatus, Enum_Spotaneus_Absence_Status_Name } from "@prisma/client";

interface SpontaneousAbsenceCreation {
    colaboratorId: string;
    startDate: Date;
    endDate: Date;
    comments: string;
}

const spontaneousAbsenceResolvers = {
    Mutation: {
        createSpontaneousAbsence: async (parent: null, 
                            args: SpontaneousAbsenceCreation, 
                            context: OurContext) => {

            // TODO: make this work
            const result = await context.db.$transaction(async (tx) => {
                const absence = await tx.absence.create({
                    data: {
                        colaboratorId: args.colaboratorId,
                        startDate: args.startDate,
                        endDate: args.endDate,
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

                await tx.spontaneousAbsence.create({
                    data: {
                        absenceId: absence.dbId,
                        comments: args.comments,
                        absenceStatus: spontaneousAbsenceStatus.dbId,
                        updatedAt: new Date(),
                    }
                });
            })
            
            console.log(result);

            // return {
            //     dbId: SpontaneousAbsence.dbId,
            //     colaboratorId: SpontaneousAbsence.absenceId,
            //     startDate: absence.startDate,
            //     endDate: absence.endDate,
            //     createdById: absence.createdBy,
            //     comments: SpontaneousAbsence.comments,
            //     absenceStatusId: SpontaneousAbsence.absenceStatus,
            // }
        },
    },
    Absence: {

    },
    SpontaneousAbsenceStatus: {

    },
    Justification: {

    },
};

export { spontaneousAbsenceResolvers };