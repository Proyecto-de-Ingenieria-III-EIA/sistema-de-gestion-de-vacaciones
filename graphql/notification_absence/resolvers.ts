import { OurContext } from "../context";

interface NotificationAbsence {
    absenceId: string;
    isForBoss: boolean;
    isForWorker: boolean;
    notificationMessage: string;
}

const notificationAbsenceResolvers = {
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