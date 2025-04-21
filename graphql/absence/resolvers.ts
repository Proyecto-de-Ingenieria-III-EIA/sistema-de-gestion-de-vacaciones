import { NotSufficentCredentialsError } from "@/errors/NotSufficentCredentialsError";
import { OurContext } from "@/graphql/context";
import { Enum_RoleName } from "@prisma/client";
import { Enum_Absence_Type } from "./enum_absence_type";

const absenceResolvers = {
    Query: {
        // TODO: make this to include spontaneous absences
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
                    absence."start_date" <= ${endDate} AND absence."end_date" >= ${startDate}
            `;
        },
    }
    
};

export { absenceResolvers };