import { OurContext } from "../context";
import { VacationAbsence, InformalAbsence, RequestStatus, User, Enum_Requested_Absence_Status_Name } from "@prisma/client";
import { NotSufficentCredentialsError } from "@/errors/NotSufficentCredentialsError";
import { Enum_RoleName } from "@prisma/client";
import { UserNotFoundError } from "@/errors/UserNotFoundError";
import { StatusNotFoundError } from "@/errors/StatusNotFoundError";
import { Enum_Absence_Type } from "./../absence/enum_absence_type";
import { DateError } from "@/errors/DateError";
import { IncorrectInputError } from "@/errors/IncorrectInputError";
import { AbsenceNotFoundError } from "@/errors/AbsenceNotFoundError";
import { messages } from "../notification_absence/messages";

interface WholeRequestedAbsence {
    dbId: string;
    startDate: Date;
    endDate: Date;
    decisionDate: Date;
    
    colaboratorId: string;
    statusId: string;
    reviewerId: string;
    type: Enum_Absence_Type;

    createdAt: Date;
    updatedAt: Date;
}

interface RequestedAbsenceCreationInput {
    colaboratorId: string;
    startDate: Date;
    endDate: Date;
    isVacation: boolean;

    description?: string;
    mediaUrl?: string;
}

interface RequestedAbsence {
    absenceId: string;
    statusId: string;
    aproverId: string;
    decisionDate: Date | null;

    createdAt: Date;
    updatedAt: Date;
}


const requestedAbsenceResolvers = {
    Query: {
        getPendingRequestedAbsences: async (parent: null, args: null, context: OurContext) => {
            if (!context.authData || context.authData.role !== Enum_RoleName.ADMIN) {
                throw new NotSufficentCredentialsError();
            }

            const today = new Date();

            //Nuevo Prueba
            const oneMonthAgo = new Date(); // Nuevo
            oneMonthAgo.setMonth(today.getMonth() - 1); //Nuevo prueba

            const statusId: { dbId: string } | null = await context.db.requestStatus.findFirst({
                where: {
                    name: Enum_Requested_Absence_Status_Name.PENDING,
                },
                select: {
                    dbId: true,
                },
            });

            if (!statusId) {
                throw new StatusNotFoundError('Request Status not found');
            }

            return await context.db.$queryRaw`
                SELECT
                    absence."db_id" as "dbId",
                    absence."start_date" as "startDate",
                    absence."end_date" as "endDate",
                    request."decision_date" as "decisionDate",

                    absence."colaborator_id" as "colaboratorId",
                    request."status" as "statusId",
                    absence."reviewer" as "reviewerId",
                    --Cambio para que en front se identifique el Informal
                    CASE 
                        WHEN vacation."absence_id" IS NULL THEN ${Enum_Absence_Type.INFORMAL}
                        ELSE ${Enum_Absence_Type.VACATION}
                    END as "type",

                    absence."created_at" as "createdAt",
                    absence."updated_at" as "updatedAt"
                FROM
                    "Requested_Absence" as request
                    INNER JOIN "Absence" as absence ON absence."db_id" = request."absence_id"
                    LEFT JOIN "Vacation_Absence" as vacation ON vacation."absence_id" = absence."db_id"
                WHERE
                    request.status = ${statusId.dbId}
                    -- AND absence.start_date >=  ${today}
                    AND absence.reviewer = ${context.authData.userId}
                    AND absence.start_date >= ${oneMonthAgo}
                ORDER BY
                    absence.start_date ASC
            `;
        }
    },
    Mutation: {
        createRequestedAbsence: async (parent: null, { inputs }: { inputs: RequestedAbsenceCreationInput }, context: OurContext) => {
            return await context.db.$transaction(async (tx) => {
                const bossId: [{ bossId: string }] = await tx.$queryRaw<[{ bossId: string }]>`
                    SELECT 
                        u."bossId" as "bossId"
                    FROM
                        "User" u
                    WHERE   
                        u."id" = ${inputs.colaboratorId}
                `;

                if (bossId.length !== 1|| !bossId[0].bossId) {
                    throw new UserNotFoundError("Colaborator or their boss not found");
                }

                const startDate = new Date(inputs.startDate);
                const endDate = new Date(inputs.endDate)

                if (startDate > endDate) {
                    throw new DateError('Start date cannot be after end date');
                }

                const absence = await tx.absence.create({
                    data: {
                        colaboratorId: inputs.colaboratorId,
                        startDate: startDate,
                        endDate: endDate,
                        reviewer: bossId[0].bossId,
                        createdBy: context.authData.userId,
                        updatedAt: new Date(),
                    }
                });

                const requestedAbsence = await tx.requestedAbsence.create({
                    data: {
                        absenceId: absence.dbId,
                        // by default, absence is PENDING (defined in the prisma)
                        decisionDate: null,
                        updatedAt: new Date(),
                    }
                });
                
                if (inputs.isVacation) {
                    const policy = await tx.vacationPolicy.findFirst({
                        orderBy: {
                            createdAt: 'desc', // Get the latest policy by date
                        },
                        take: 1 // Ensure only the top entry is retrieved
                    });

                    if (!policy) {
                        throw new Error('There is no policy implemented yet');
                    }

                    await tx.vacationAbsence.create({
                        data: {
                            absenceId: absence.dbId,
                            policyUnder: policy.dbId,
                            updatedAt: new Date(),
                        }
                    });

                } else {
                    if (!inputs.description) {
                        throw new Error('Description is required for informal absence');
                    }
                    await tx.informalAbsence.create({
                        data: {
                            absenceId: absence.dbId,
                            updatedAt: new Date(),
                        }
                    });

                    await tx.justification.create({
                        data: {
                            absenceId: absence.dbId,
                            description: inputs.description,
                            media: inputs.mediaUrl || null,
                            comments: null,  // Comments are meant for the boss to fill in, not the colaborator in the request
                            updatedAt: new Date(),
                        }
                    })
                }

                await tx.absenceNotification.update({
                        where: {
                            absenceId: absence.dbId,
                        },
                        data: {
                            isForBoss: true,
                            hasBeenSeen: false,
                            message: (inputs.isVacation) ? messages.vacationAbsenceRequest : messages.informalAbsenceRequest,
                        },
                    });

                return {
                    dbId: absence.dbId,
                    colaboratorId: absence.colaboratorId,
                    startDate: absence.startDate,
                    endDate: absence.endDate,
                    decisionDate: requestedAbsence.decisionDate,
                    type: inputs.isVacation ? 'VACATION' : 'INFORMAL',
                    aprover: absence.reviewer,
                    createdAt: absence.createdAt,
                    updatedAt: absence.updatedAt,
                }
            });
        },
        makeDecisionRequestedAbsence: async (parent: null, 
            input : { absenceId: string, decision: Enum_Requested_Absence_Status_Name }, 
            { db, authData }: OurContext) => {
                if (authData.role !== Enum_RoleName.ADMIN)
                    throw new NotSufficentCredentialsError();

                if ((await db.requestedAbsence.count({
                        where: {
                            absenceId: input.absenceId,
                        }
                    })) === 0)
                    throw new AbsenceNotFoundError();

                const requestedAbsenceStatus = await db.requestStatus.findFirst({
                    where: {
                        name: input.decision,
                    },
                });

                if (!requestedAbsenceStatus)
                    throw new IncorrectInputError("The decision name is not valid");

                return db.$transaction(async (tx) => {
                    await tx.absenceNotification.update({
                        where: {
                            absenceId: input.absenceId,
                        },
                        data: {
                            isForWorker: true,
                            hasBeenSeen: false,
                            message: messages.requestDecisionMade,
                        },
                    });

                    await tx.requestedAbsence.update({
                        where: {
                            absenceId: input.absenceId,
                        },
                        data: {
                            status: requestedAbsenceStatus.dbId,
                            decisionDate: new Date(),
                        },
                    });
                });
                
        }
    },
    WholeRequestedAbsence: {
        colaborator : async (parent: WholeRequestedAbsence, args: null, context: OurContext) => {
            return context.db.user.findFirst({
                where: {
                    id: parent.colaboratorId,
                }
            });
        },
        status: async (parent: WholeRequestedAbsence, args: null, context: OurContext) => {
            return context.db.requestStatus.findFirst({
                where: {
                    dbId: parent.statusId,
                },
            });
        },
        reviewer : async (parent: WholeRequestedAbsence, args: null, context: OurContext) => {
            return context.db.user.findFirst({
                where: {
                    id: parent.reviewerId,
                }
            });
        },
        justification: async (parent: WholeRequestedAbsence, args: null, context: OurContext) => {
            return (parent.type !== Enum_Absence_Type.SPONTANEOUS) ? null : 
                context.db.justification.findFirst({
                    where: {
                        absenceId: parent.dbId,
                    }
                });
        }
    },
    RequestedAbsence: {
        absence: async (parent: RequestedAbsence, args: null, context: OurContext) => {
            return context.db.absence.findFirst({
                where: {
                    dbId: parent.absenceId,
                }
            });
        },
        currentStatus: async (parent: RequestedAbsence, args: null, context: OurContext) => {
            return context.db.requestStatus.findFirst({
                where: {
                    dbId: parent.statusId,
                }
            });
        },
        aproverUser: async (parent: RequestedAbsence, args: null, context: OurContext) => {
            return context.db.user.findFirst({
                where: {
                    id: parent.aproverId,
                }
            });
        },
        vacationAbsence: async (parent: RequestedAbsence, args: null, context: OurContext) => {
            return context.db.vacationAbsence.findFirst({
                where: {
                    absenceId: parent.absenceId,
                }
            });
        },
        informalAbsence: async (parent: RequestedAbsence, args: null, context: OurContext) => {
            return context.db.informalAbsence.findFirst({
                where: {
                    absenceId: parent.absenceId,
                }
            });
        },
    },
};

export { requestedAbsenceResolvers };
