/*
  Warnings:

  - You are about to drop the `Absence_Status` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `name` on the `Request_Status` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Enum_Requested_Absence_Status_Name" AS ENUM ('PENDING', 'APROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Enum_Spotaneus_Absence_Status_Name" AS ENUM ('PENDING', 'APROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Spontaneous_Absence" DROP CONSTRAINT "spontaneous_absence_status_fk";

-- AlterTable
ALTER TABLE "Request_Status" DROP COLUMN "name",
ADD COLUMN     "name" "Enum_Requested_Absence_Status_Name" NOT NULL;

-- DropTable
DROP TABLE "Absence_Status";

-- CreateTable
CREATE TABLE "Spontaneous_Absence_Status" (
    "db_id" TEXT NOT NULL,
    "name" "Enum_Spotaneus_Absence_Status_Name" NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spontaneous_Absence_Status_pkey" PRIMARY KEY ("db_id")
);

-- AddForeignKey
ALTER TABLE "Spontaneous_Absence" ADD CONSTRAINT "spontaneous_absence_status_fk" FOREIGN KEY ("absence_status") REFERENCES "Spontaneous_Absence_Status"("db_id") ON DELETE RESTRICT ON UPDATE CASCADE;
