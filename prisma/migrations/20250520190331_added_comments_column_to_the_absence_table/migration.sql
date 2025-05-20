/*
  Warnings:

  - You are about to drop the column `comments` on the `Spontaneous_Absence` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Absence" ADD COLUMN     "comments" TEXT;

-- AlterTable
ALTER TABLE "Spontaneous_Absence" DROP COLUMN "comments";
