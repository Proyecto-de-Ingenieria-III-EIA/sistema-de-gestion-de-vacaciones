import { OurContext } from "../context";
import { RequestedAbsence, VacationAbsence, InformalAbsence, RequestStatus, User } from "@prisma/client";
import { NotSufficentCredentialsError } from "@/errors/NotSufficentCredentialsError";
import { Enum_RoleName } from "@prisma/client";

interface WholeRequestedAbsence {
    dbId: string;
    colaboratorId: string;
    startDate: Date;
    endDate: Date;
    decisionDate: Date;

    status: string;  // The status Id
    aprover: User;

    createdAt: Date;
    updatedAt: Date;

    vacationAbsence: VacationAbsence;
    informalAbsence: InformalAbsence;
}

const requestedAbsenceResolvers = {
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
                    absence."colaborator_id" as "colaboratorId",
                    absence."start_date" as "startDate",
                    absence."end_date" as "endDate",
                    request."decision_date" as "decisionDate",
                    request."status" as "status",
                    request."aprover" as "aprover",

                    CASE vacation."absence_id"
                        WHEN NULL THEN 'INFORMAL'
                        ELSE 'VACATION'
                    END as "type",

                    absence."created_at" as "createdAt",
                    absence."updated_at" as "updatedAt",

                    absence."db_id" as "vacationAbsence",
                    absence."db_id" as "informalAbsence"
                FROM
                    "Requested_Absence" as request
                    INNER JOIN "Absence" as absence ON absence."db_id" = request."absence_id"
                    LEFT JOIN "Vacation_Absence" as vacation ON vacation."absence_id" = absence."db_id"
                
                WHERE
                    absence."start_date" <= ${endDate} AND absence."end_date" >= ${startDate}
            `;
        },
    },
    WholeRequestedAbsence: {
        colaboratorId : async (parent: WholeRequestedAbsence, args: null, context: OurContext) => {
            return context.db.user.findFirst({
                where: {
                    id: parent.colaboratorId,
                }
            });
        },
        aprover : async (parent: WholeRequestedAbsence, args: null, context: OurContext) => {
            return context.db.user.findFirst({
                where: {
                    id: parent.colaboratorId,
                }
            });
        },
        status: async (parent: WholeRequestedAbsence, args: null, context: OurContext) => {
            return context.db.requestStatus.findFirst({
                where: {
                    dbId: parent.status,
                },
            });
        }
    }
};

export { requestedAbsenceResolvers };
