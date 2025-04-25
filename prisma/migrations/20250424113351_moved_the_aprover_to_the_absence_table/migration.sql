-- DropForeignKey
ALTER TABLE "Requested_Absence" DROP CONSTRAINT "requested_absence_aprover_fk";

-- AlterTable
ALTER TABLE "Absence" ADD COLUMN     "reviewer" TEXT NOT NULL DEFAULT 'null';

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "absence_reviewer_fk" FOREIGN KEY ("reviewer") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
