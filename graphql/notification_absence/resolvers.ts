import { AbsenceNotFoundError } from "@/errors/AbsenceNotFoundError";
import { OurContext } from "../context";

interface NotificationAbsence {
    absenceId: string;
    isForBoss: boolean;
    isForWorker: boolean;
    notificationMessage: string;
}

const notificationAbsenceResolvers = {
    Mutation: {
        setAsSeen: async (parent: null, input: { absenceId: string, forBoss: boolean }, { db }: OurContext) => {
            if ((await db.absence.count({ where: { dbId: input.absenceId }})) === 0)
                throw new AbsenceNotFoundError();

            if (input.forBoss) {
                return await db.absenceNotification.update({
                    where: {
                        absenceId: input.absenceId,
                    },
                    data: {
                        hasBeenSeen: true,
                        isForBoss: false,
                    },
                });
            }
            
            return await db.absenceNotification.update({
                    where: {
                        absenceId: input.absenceId,
                    },
                    data: {
                        hasBeenSeen: true,
                        isForWorker: false,
                    },
                });
        }, 
        setAsUnseen: async (parent: null, input: { absenceId: string, forBoss: boolean }, { db }: OurContext) => {
            if ((await db.absence.count({ where: { dbId: input.absenceId }})) === 0)
                throw new AbsenceNotFoundError();

            if (input.forBoss) {
                return await db.absenceNotification.update({
                    where: {
                        absenceId: input.absenceId,
                    },
                    data: {
                        hasBeenSeen: false,
                        isForBoss: true,
                    },
                });
            }
            
            return await db.absenceNotification.update({
                    where: {
                        absenceId: input.absenceId,
                    },
                    data: {
                        hasBeenSeen: true,
                        isForWorker: true,
                    },
                });
        }, 
    },
    Query: {
        getUserNotifications: async (
            parent: null,
            { userId }: { userId: String },
            { db }: OurContext
        ) => {
            return db.$queryRaw`
                SELECT
                    absence_notification.*
                FROM
                    "Absence" as absence
                    INNER JOIN "Absence_Notification" as absence_notification
                        ON absence.db_id = absence_notification.absence_id
                WHERE
                    absence."colaborator_id" = ${userId} OR absence."reviewer" = ${userId}
                ;
            `
        },
    },
    Notification_Absence: {
        absence: async (parent: NotificationAbsence, 
            args: null,
            context: OurContext
        ) => {
            return await context.db.absenceNotification.findFirst({
                where: {
                    absenceId: parent.absenceId,
                }
            });
        }
    }
};

export { notificationAbsenceResolvers };