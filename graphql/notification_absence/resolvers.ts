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
                await db.absenceNotification.update({
                    where: {
                        absenceId: input.absenceId,
                    },
                    data: {
                        hasBeenSeen: true,
                        isForBoss: false,
                    },
                });

                return true;
            }
            
            await db.absenceNotification.update({
                    where: {
                        absenceId: input.absenceId,
                    },
                    data: {
                        hasBeenSeen: true,
                        isForWorker: false,
                    },
                });

            return true;
                
        }, 
        setAsUnseen: async (parent: null, input: { absenceId: string, forBoss: boolean }, { db }: OurContext) => {
            if ((await db.absence.count({ where: { dbId: input.absenceId }})) === 0)
                throw new AbsenceNotFoundError();

            if (input.forBoss) {
                await db.absenceNotification.update({
                    where: {
                        absenceId: input.absenceId,
                    },
                    data: {
                        hasBeenSeen: false,
                        isForBoss: true,
                    },
                });

                return true;
            }
            
            await db.absenceNotification.update({
                    where: {
                        absenceId: input.absenceId,
                    },
                    data: {
                        hasBeenSeen: true,
                        isForWorker: true,
                    },
                });

            return true;
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