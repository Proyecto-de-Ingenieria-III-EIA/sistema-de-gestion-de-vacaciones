import { OurContext } from "../context";
import { RequestedAbsence, VacationAbsence, InformalAbsence, RequestStatus, User, Enum_Requested_Absence_Status_Name } from "@prisma/client";
import { NotSufficentCredentialsError } from "@/errors/NotSufficentCredentialsError";
import { Enum_RoleName } from "@prisma/client";
import { UserNotFoundError } from "@/errors/UserNotFoundError";
import { StatusNotFoundError } from "@/errors/StatusNotFoundError";
import { Enum_Absence_Type } from "./../absence/enum_absence_type";

interface WholeRequestedAbsence {
    dbId: string;
    startDate: Date;
    endDate: Date;
    decisionDate: Date;
    
    colaboratorId: string;
    statusId: string;
    aproverId: string;
    typeId: string;

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
    comments?: string;
}

const requestedAbsenceResolvers = {
    Query: {
        getPendingRequestedAbsences: async (parent: null, args: null, context: OurContext) => {
            if (!context.authData || context.authData.role !== Enum_RoleName.ADMIN) {
                throw new NotSufficentCredentialsError();
            }

            const today = new Date();

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
                    request."aprover" as "aproverId",
                    CASE vacation."absence_id"
                        WHEN NULL THEN ${Enum_Absence_Type.INFORMAL}
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
                    AND absence.start_date >=  ${today}
                    AND request.aprover = ${context.authData.userId}
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

                const absence = await tx.absence.create({
                    data: {
                        colaboratorId: inputs.colaboratorId,
                        startDate: new Date(inputs.startDate),
                        endDate: new Date(inputs.endDate),
                        createdBy: context.authData.userId,
                        updatedAt: new Date(),
                    }
                });

                const requestStatus = await tx.requestStatus.findFirst({
                    where: {
                        name: Enum_Requested_Absence_Status_Name.PENDING,
                    }
                });

                if (!requestStatus) {
                    throw new StatusNotFoundError('Request Status not found');
                }

                const requestedAbsence = await tx.requestedAbsence.create({
                    data: {
                        absenceId: absence.dbId,
                        status: requestStatus.dbId,
                        aprover: bossId[0].bossId,
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
                    if (!inputs.description || !inputs.mediaUrl || !inputs.comments) {
                        throw new Error('Description, mediaUrl and comments are required for informal absence');
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
                            media: inputs.mediaUrl,
                            uploadedAt: new Date(),
                            comments: inputs.comments,
                            updatedAt: new Date(),
                        }
                    })
                }
                return {
                    dbId: absence.dbId,
                    colaboratorId: absence.colaboratorId,
                    startDate: absence.startDate,
                    endDate: absence.endDate,
                    decisionDate: requestedAbsence.decisionDate,
                    type: inputs.isVacation ? 'VACATION' : 'INFORMAL',
                    status: requestStatus.name,
                    aprover: requestedAbsence.aprover,
                    createdAt: absence.createdAt,
                    updatedAt: absence.updatedAt,
                }
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
        aprover : async (parent: WholeRequestedAbsence, args: null, context: OurContext) => {
            return context.db.user.findFirst({
                where: {
                    id: parent.aproverId,
                }
            });
        },
        justification: async (parent: WholeRequestedAbsence, args: null, context: OurContext) => {
            // TODO: add justification resolver for the informal absences
        }
    }
};

export { requestedAbsenceResolvers };
