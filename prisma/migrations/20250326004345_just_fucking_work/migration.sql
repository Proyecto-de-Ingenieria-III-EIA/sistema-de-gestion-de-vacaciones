-- DropForeignKey
ALTER TABLE "Absence" DROP CONSTRAINT "absence_creator_fk";

-- AlterTable
ALTER TABLE "Absence" ALTER COLUMN "created_by" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "absence_creator_fk" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
