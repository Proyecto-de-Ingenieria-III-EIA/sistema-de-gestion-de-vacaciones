import { NotSufficentCredentialsError } from "@/errors/NotSufficentCredentialsError";
import { OurContext } from "@/graphql/context";
import { Enum_RoleName, User } from "@prisma/client";
import { Enum_Absence_Type } from "./enum_absence_type";

interface CompleteAbsence {
    dbId: string;
    startDate: Date
    endDate: Date;
    decisionDate: Date;

    colaboratorId: string;
    statusId: string;
    reviewerId: string;
    type: Enum_Absence_Type;
    justificationId: string | null;

    createdAt: Date;
    updatedAt: Date;
}

const absenceResolvers = {
    Query: {
        getAbsencesTimePeriod: async (parent: null, args: { startDate: string, endDate: string}, context: OurContext) => {
            if (!context.authData || context.authData.role !== Enum_RoleName.ADMIN) {
                throw new NotSufficentCredentialsError();
            }

            const startDate = new Date(args.startDate);
            const endDate = new Date(args.endDate);

            return await context.db.$queryRaw`
                SELECT
                    absence."db_id" as "dbId",
                    absence."start_date" as "startDate",
                    absence."end_date" as "endDate",
                    request."decision_date" as "decisionDate",

                    absence."colaborator_id" as "colaboratorId",

                    CASE
                        WHEN spontaneous."absence_id" IS NULL THEN spontaneous."status"
                        ELSE request."status"
                    END as "statusId",

                    absence."reviewer" as "reviewerId",

                    CASE
                        WHEN request."absence_id" IS NULL THEN ${Enum_Absence_Type.SPONTANEOUS}
                        WHEN vacation."absence_id" IS NULL THEN ${Enum_Absence_Type.INFORMAL}
                        ELSE ${Enum_Absence_Type.VACATION}
                    END as "type",

                    CASE
                        WHEN vacation."absence_id" IS NOT NULL THEN NULL
                        ELSE absence."db_id"
                    END as "justificationId",

                    absence."created_at" as "createdAt",
                    absence."updated_at" as "updatedAt"
                FROM
                    "Absence" as absence
                    LEFT JOIN "Requested_Absence" as request ON absence."db_id" = request."absence_id"
                    LEFT JOIN "Spontaneous_Absence" as spontaneous ON spontaneous."absence_id" = absence."db_id"
                    LEFT JOIN "Vacation_Absence" as vacation ON vacation."absence_id" = absence."db_id"

                
                WHERE
                    absence."start_date" <= ${endDate} AND absence."end_date" >= ${startDate}
            `;
        },
    },
    CompleteAbsence: {
        colaborator: async (parent: CompleteAbsence, args: null, context: OurContext) => {
            return await context.db.user.findUnique({
                where: {
                    id: parent.colaboratorId,
                },
            });
        },
        status: async (parent: CompleteAbsence, args: null, context: OurContext) => {
            if (parent.statusId === Enum_Absence_Type.INFORMAL || parent.statusId === Enum_Absence_Type.VACATION) {
                return await context.db.requestStatus.findUnique({
                    where: {
                        dbId: parent.statusId,
                    },
                });
            } else {
                return await context.db.spontaneousAbsenceStatus.findUnique({
                    where: {
                        dbId: parent.statusId,
                    },
                });
            }
        },
        reviewer: async (parent: CompleteAbsence, args: null, context: OurContext) => {
            return await context.db.user.findUnique({
                where: {
                    id: parent.reviewerId,
                },
            });
        },
        justification: async (parent: CompleteAbsence, args: null, context: OurContext) => {
            if (!parent.justificationId) {
                return null;
            }

            return await context.db.justification.findUnique({
                where: {
                    absenceId: parent.justificationId,
                },
            });
        },
    },
    Absence: {
        colaborator: async (parent: { colaboratorId: string }, args: null, context: OurContext) => {
            return await context.db.user.findUnique({
                where: {
                    id: parent.colaboratorId,
                },
            });
        },
        requestedAbsence: async (parent: { dbId: string }, args: null, context: OurContext) => {
            return await context.db.requestedAbsence.findUnique({
                where: {
                    absenceId: parent.dbId,
                },
            });
        },
        spontaneousAbsence: async (parent: { dbId: string }, args: null, context: OurContext) => {
            return await context.db.spontaneousAbsence.findUnique({
                where: {
                    absenceId: parent.dbId,
                },
            });
        },
    }
    
};

export { absenceResolvers };