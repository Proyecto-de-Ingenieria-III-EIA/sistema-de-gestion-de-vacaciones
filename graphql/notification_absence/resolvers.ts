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
        setNotificationAsSeen: async (parent: null, input: { absenceId: string, forBoss: boolean }, { db }: OurContext) => {
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
        setNotificationAsUnseen: async (parent: null, input: { absenceId: string, forBoss: boolean }, { db }: OurContext) => {
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
            const result = await db.$queryRaw`
                SELECT
                    absence_notification."absence_id" as "absenceId",
                    absence_notification."is_for_boss" as "isForBoss",
                    absence_notification."is_for_worker" as "isForWorker",
                    absence_notification."message" as "message",
                    absence_notification."has_been_seen" as "hasBeenSeen"
                FROM
                    "Absence" as absence
                    INNER JOIN "Absence_Notification" as absence_notification
                        ON absence.db_id = absence_notification.absence_id
                WHERE
                    (absence."colaborator_id" = ${userId} AND absence_notification.is_for_worker)
                    OR (absence."reviewer" = ${userId} AND absence_notification.is_for_boss)
                ;
            `;

            return result;
        },
    },
    Notification_Absence: {
        absence: async (parent: NotificationAbsence, 
            args: null,
            context: OurContext
        ) => {
            return await context.db.absence.findFirst({
                where: {
                    dbId: parent.absenceId,
                }
            });
        }
    }
};

export { notificationAbsenceResolvers };