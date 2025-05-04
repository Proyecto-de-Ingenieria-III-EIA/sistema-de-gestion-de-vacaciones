/*
  Warnings:

  - You are about to drop the column `absence_status` on the `Spontaneous_Absence` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Spontaneous_Absence" DROP CONSTRAINT "spontaneous_absence_status_fk";

-- AlterTable
ALTER TABLE "Spontaneous_Absence" DROP COLUMN "absence_status",
ALTER COLUMN "status" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Spontaneous_Absence" ADD CONSTRAINT "spontaneous_absence_status_fk" FOREIGN KEY ("status") REFERENCES "Spontaneous_Absence_Status"("db_id") ON DELETE RESTRICT ON UPDATE CASCADE;
