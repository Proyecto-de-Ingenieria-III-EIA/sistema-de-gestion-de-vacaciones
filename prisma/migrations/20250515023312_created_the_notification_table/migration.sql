-- CreateTable
CREATE TABLE "Absence_Notification" (
    "absence_id" TEXT NOT NULL,
    "notification_for_boss" BOOLEAN NOT NULL DEFAULT false,
    "notification_for_worker" BOOLEAN NOT NULL DEFAULT false,
    "notification_message" TEXT,

    CONSTRAINT "Absence_Notification_pkey" PRIMARY KEY ("absence_id")
);

-- AddForeignKey
ALTER TABLE "Absence_Notification" ADD CONSTRAINT "parent_absence_notification" FOREIGN KEY ("absence_id") REFERENCES "Absence"("db_id") ON DELETE RESTRICT ON UPDATE CASCADE;
