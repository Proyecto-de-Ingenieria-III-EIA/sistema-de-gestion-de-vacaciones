/*
  Warnings:

  - You are about to drop the column `created_at` on the `Absence` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Absence` table. All the data in the column will be lost.
  - You are about to drop the column `valid` on the `Absence` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Justification` table. All the data in the column will be lost.
  - The primary key for the `Vacation_Policy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `vp_id` on the `Vacation_Policy` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Absence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Justification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `absence_status` to the `Spontaneous_Absence` table without a default value. This is not possible if the table is not empty.
  - The required column `db_id` was added to the `Vacation_Policy` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Vacation_Absence" DROP CONSTRAINT "vacation_policy_fk";

-- AlterTable
ALTER TABLE "Absence" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
DROP COLUMN "valid",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Justification" DROP COLUMN "updated_at",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Spontaneous_Absence" ADD COLUMN     "absence_status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vacation_Policy" DROP CONSTRAINT "Vacation_Policy_pkey",
DROP COLUMN "vp_id",
ADD COLUMN     "db_id" TEXT NOT NULL,
ADD CONSTRAINT "Vacation_Policy_pkey" PRIMARY KEY ("db_id");

-- CreateTable
CREATE TABLE "Absence_Status" (
    "db_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Absence_Status_pkey" PRIMARY KEY ("db_id")
);

-- AddForeignKey
ALTER TABLE "Vacation_Absence" ADD CONSTRAINT "vacation_policy_fk" FOREIGN KEY ("policy_under") REFERENCES "Vacation_Policy"("db_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spontaneous_Absence" ADD CONSTRAINT "spontaneous_absence_status_fk" FOREIGN KEY ("absence_status") REFERENCES "Absence_Status"("db_id") ON DELETE RESTRICT ON UPDATE CASCADE;
