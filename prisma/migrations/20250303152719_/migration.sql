/*
  Warnings:

  - You are about to drop the column `colaboratorId` on the `Absence` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Absence` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Absence` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Request_Status` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Request_Status` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Requested_Absence` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Requested_Absence` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Vacation_Policy` table. All the data in the column will be lost.
  - You are about to drop the column `legal_req` on the `Vacation_Policy` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Vacation_Policy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `colaborator_id` to the `Absence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Absence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Request_Status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Requested_Absence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legal_requirements` to the `Vacation_Policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Vacation_Policy` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Absence" DROP CONSTRAINT "absence_colaborator_fk";

-- AlterTable
ALTER TABLE "Absence" DROP COLUMN "colaboratorId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "colaborator_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Informal_Absence" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Request_Status" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Requested_Absence" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Spontaneous_Absence" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Vacation_Policy" DROP COLUMN "createdAt",
DROP COLUMN "legal_req",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "legal_requirements" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "absence_colaborator_fk" FOREIGN KEY ("colaborator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
