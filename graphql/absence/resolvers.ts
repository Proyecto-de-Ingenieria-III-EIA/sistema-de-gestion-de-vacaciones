import { NotSufficentCredentialsError } from '@/errors/NotSufficentCredentialsError';
import { OurContext } from '@/graphql/context';
import { Enum_RoleName, User } from '@prisma/client';
import { Enum_Absence_Type } from './enum_absence_type';
import { isContext } from 'vm';

//Imports para tema del status
import {
  Enum_Requested_Absence_Status_Name as RS,
  Enum_Spotaneus_Absence_Status_Name as SS,
} from '@prisma/client';

interface CompleteAbsence {
  dbId: string;
  startDate: Date;
  endDate: Date;
  decisionDate: Date;

  colaboratorId: string;
  statusId: string;
  reviewer: string;
  type: Enum_Absence_Type;
  justificationId: string | null;

  createdAt: Date;
  updatedAt: Date;
}

interface Absence {
  dbId: string;
  colaboratorId: string;
  reviewer: string;
  startDate: Date;
  endDate: Date;
  valid: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const absenceResolvers = {
  Mutation: {
    addCommentToAbsence: async (
      parent: null,
      args: { absenceId: string; comments: string },
      context: OurContext
    ) => {
      if (context.authData.role !== Enum_RoleName.ADMIN)
        throw new NotSufficentCredentialsError();

      return context.db.absence.update({
        where: {
          dbId: args.absenceId,
        },
        data: {
          comments: args.comments,
        },
      });
    },
    setAbsenceAsSeen: async (
      parent: null,
      { absenceId }: { absenceId: string },
      context: OurContext
    ) => {
      if (context.authData.role !== Enum_RoleName.ADMIN)
        throw new NotSufficentCredentialsError();

      return context.db.absence.update({
        where: {
          dbId: absenceId,
        },
        data: {
          seen: true,
        },
      });
    },
    setAbsenceAsNotSeen: async (
      parent: null,
      { absenceId }: { absenceId: string },
      context: OurContext
    ) => {
      if (context.authData.role !== Enum_RoleName.ADMIN)
        throw new NotSufficentCredentialsError();

      return context.db.absence.update({
        where: {
          dbId: absenceId,
        },
        data: {
          seen: false,
        },
      });
    },
  },
  Query: {
    getAbsencesTimePeriod: async (
      parent: null,
      args: { startDate: string; endDate: string },
      context: OurContext
    ) => {
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
                        WHEN spontaneous."absence_id" IS NOT NULL THEN spontaneous."status"
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
    getUserAbsences: async (
      parent: null,
      { userId }: { userId: string },
      { db }: OurContext
    ) => {
      return db.absence.findMany({
        where: {
          colaboratorId: userId,
        },
      });
    },
  },
  CompleteAbsence: {
    colaborator: async (
      parent: CompleteAbsence,
      args: null,
      context: OurContext
    ) => {
      return await context.db.user.findUnique({
        where: {
          id: parent.colaboratorId,
        },
      });
    },
    status: async (
      parent: CompleteAbsence,
      _args: null,
      context: OurContext
    ) => {
      if (!parent.statusId) return null; //seguridad

      if (parent.type === Enum_Absence_Type.SPONTANEOUS) {
        return context.db.spontaneousAbsenceStatus.findUnique({
          where: { dbId: parent.statusId },
        });
      }

      return context.db.requestStatus.findUnique({
        where: { dbId: parent.statusId },
      });

      // if (parent.statusId === Enum_Absence_Type.INFORMAL || parent.statusId === Enum_Absence_Type.VACATION) {
      //     return await context.db.requestStatus.findUnique({
      //         where: {
      //             dbId: parent.statusId,
      //         },
      //     });
      // } else {
      //     return await context.db.spontaneousAbsenceStatus.findUnique({
      //         where: {
      //             dbId: parent.statusId,
      //         },
      //     });
      // }
    },
    reviewer: async (
      parent: CompleteAbsence,
      args: null,
      context: OurContext
    ) => {
      return await context.db.user.findUnique({
        where: {
          id: parent.reviewer,
        },
      });
    },
    justification: async (
      parent: CompleteAbsence,
      args: null,
      context: OurContext
    ) => {
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
    colaborator: async (parent: Absence, args: null, context: OurContext) => {
      return await context.db.user.findUnique({
        where: {
          id: parent.colaboratorId,
        },
      });
    },
    reviewer: async (parent: Absence, args: null, context: OurContext) => {
      return await context.db.user.findUnique({
        where: {
          id: parent.reviewer,
        },
      });
    },
    requestedAbsence: async (
      parent: Absence,
      args: null,
      context: OurContext
    ) => {
      return await context.db.requestedAbsence.findUnique({
        where: {
          absenceId: parent.dbId,
        },
      });
    },
    spontaneousAbsence: async (
      parent: Absence,
      args: null,
      context: OurContext
    ) => {
      return await context.db.spontaneousAbsence.findUnique({
        where: {
          absenceId: parent.dbId,
        },
      });
    },
    reviewerObject: async (
      parent: Absence,
      args: null,
      context: OurContext
    ) => {
      return await context.db.user.findUnique({
        where: {
          id: parent.reviewer,
        },
      });
    },
  },
  AbsenceStatus: {
    __resolveType(obj: any) {
      //Cuando viene RequestStatus
      if (obj.name && Object.values(RS).includes(obj.name as RS)) {
        return 'RequestStatus';
      }

      //Cuando viene SpontaneoursAbsenceStatus
      if (obj.name && Object.values(SS).includes(obj.name as SS)) {
        return 'SpontaneousAbsenceStatus';
      }

      return null; //fallback
    },
  },
};

export { absenceResolvers };
