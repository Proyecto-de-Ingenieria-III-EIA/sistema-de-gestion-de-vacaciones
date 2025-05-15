/*
  Warnings:

  - You are about to drop the column `notification_for_boss` on the `Absence_Notification` table. All the data in the column will be lost.
  - You are about to drop the column `notification_for_worker` on the `Absence_Notification` table. All the data in the column will be lost.
  - You are about to drop the column `notification_message` on the `Absence_Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Absence_Notification" DROP COLUMN "notification_for_boss",
DROP COLUMN "notification_for_worker",
DROP COLUMN "notification_message",
ADD COLUMN     "is_for_boss" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_for_worker" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "message" TEXT;
