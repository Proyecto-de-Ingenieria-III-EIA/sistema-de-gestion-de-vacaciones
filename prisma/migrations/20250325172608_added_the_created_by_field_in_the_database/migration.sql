-- AlterTable
ALTER TABLE "Absence" ADD COLUMN     "created_by" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "absence_creator_fk" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
