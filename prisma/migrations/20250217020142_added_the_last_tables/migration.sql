-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bossId" TEXT;

-- CreateTable
CREATE TABLE "Absence" (
    "db_id" TEXT NOT NULL,
    "colaboratorId" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Absence_pkey" PRIMARY KEY ("db_id")
);

-- CreateTable
CREATE TABLE "Requested_Absence" (
    "absence_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "aprover" TEXT NOT NULL,
    "decision_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requested_Absence_pkey" PRIMARY KEY ("absence_id")
);

-- CreateTable
CREATE TABLE "Vacation_Absence" (
    "absence_id" TEXT NOT NULL,
    "policy_under" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vacation_Absence_pkey" PRIMARY KEY ("absence_id")
);

-- CreateTable
CREATE TABLE "Informal_Absence" (
    "absence_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Informal_Absence_pkey" PRIMARY KEY ("absence_id")
);

-- CreateTable
CREATE TABLE "Spontaneous_Absence" (
    "absence_id" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spontaneous_Absence_pkey" PRIMARY KEY ("absence_id")
);

-- CreateTable
CREATE TABLE "Justification" (
    "absence_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "media" JSONB,
    "uploaded_at" TIMESTAMP(3) NOT NULL,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Justification_pkey" PRIMARY KEY ("absence_id")
);

-- CreateTable
CREATE TABLE "Request_Status" (
    "db_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_Status_pkey" PRIMARY KEY ("db_id")
);

-- CreateTable
CREATE TABLE "Vacation_Policy" (
    "vp_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "legal_req" INTEGER NOT NULL,
    "company_policy" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vacation_Policy_pkey" PRIMARY KEY ("vp_id")
);

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "absence_colaborator_fk" FOREIGN KEY ("colaboratorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requested_Absence" ADD CONSTRAINT "requested_absence_fk" FOREIGN KEY ("absence_id") REFERENCES "Absence"("db_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requested_Absence" ADD CONSTRAINT "requested_absence_status_fk" FOREIGN KEY ("status") REFERENCES "Request_Status"("db_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requested_Absence" ADD CONSTRAINT "requested_absence_aprover_fk" FOREIGN KEY ("aprover") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vacation_Absence" ADD CONSTRAINT "vacation_absence_fk" FOREIGN KEY ("absence_id") REFERENCES "Requested_Absence"("absence_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Informal_Absence" ADD CONSTRAINT "informal_absence_fk" FOREIGN KEY ("absence_id") REFERENCES "Requested_Absence"("absence_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spontaneous_Absence" ADD CONSTRAINT "spontaneous_absence_fk" FOREIGN KEY ("absence_id") REFERENCES "Absence"("db_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Justification" ADD CONSTRAINT "informal_absence_justification_fk" FOREIGN KEY ("absence_id") REFERENCES "Informal_Absence"("absence_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Justification" ADD CONSTRAINT "spontaneous_absence_justification_fk" FOREIGN KEY ("absence_id") REFERENCES "Spontaneous_Absence"("absence_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "employee_to_manager_fk" FOREIGN KEY ("bossId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
