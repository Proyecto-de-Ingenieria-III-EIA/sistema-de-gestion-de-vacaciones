-- DropForeignKey
ALTER TABLE "Justification" DROP CONSTRAINT "informal_absence_justification_fk";

-- DropForeignKey
ALTER TABLE "Justification" DROP CONSTRAINT "spontaneous_absence_justification_fk";

-- AddForeignKey
ALTER TABLE "Justification" ADD CONSTRAINT "absence_justification_fk" FOREIGN KEY ("absence_id") REFERENCES "Absence"("db_id") ON DELETE RESTRICT ON UPDATE CASCADE;
