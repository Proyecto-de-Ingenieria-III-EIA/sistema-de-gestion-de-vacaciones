import { OurContext } from "../context";
import { RequestedAbsence, VacationAbsence, InformalAbsence, RequestStatus, User } from "@prisma/client";

interface WholeRequestedAbsence {
    dbId: string;
    colaboratorId: string;
    startDate: Date;
    endDate: Date;
    decisionDate: Date;

    status: RequestStatus;
    aprover: User;

    createdAt: Date;
    updatedAt: Date;

    vacationAbsence: VacationAbsence;
    informalAbsence: InformalAbsence;
}

const requestedAbsenceResolvers = {
    Query: {
        getAbsencesTimePeriod: async (parent: null, args: { startDate: Date, endDate: Date}, context: OurContext) => {
            const requestedAbsences: [WholeRequestedAbsence] = await context.db.$queryRaw`
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
                    request."start_date" <= ${args.endDate} AND request."end_date" >= ${args.startDate}
            `;
            
            return requestedAbsences;
        },
    },

    WholeRequestedAbsence: {
        User: async (parent: WholeRequestedAbsence, args: null, context: OurContext) => {
            return context.db.user.findFirst({
                where: {
                    id: parent.colaboratorId,
                }
            });
        }
    }
};

export { requestedAbsenceResolvers };
