-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "nik" VARCHAR(16) NOT NULL,
    "citizenName" VARCHAR(100) NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NIKRecord" (
    "nik" VARCHAR(16) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NIKRecord_pkey" PRIMARY KEY ("nik")
);

-- CreateTable
CREATE TABLE "RateLimitRecord" (
    "ip" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "blockedUntil" TIMESTAMP(3),
    "lastAttempt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitRecord_pkey" PRIMARY KEY ("ip")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_report_nik_created" ON "Report"("nik", "createdAt");

-- CreateIndex
CREATE INDEX "idx_report_created" ON "Report"("createdAt");

-- CreateIndex
CREATE INDEX "idx_report_status" ON "Report"("status");

-- CreateIndex
CREATE INDEX "idx_nik_active" ON "NIKRecord"("isActive");

-- CreateIndex
CREATE INDEX "idx_ratelimit_blocked" ON "RateLimitRecord"("blockedUntil");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_nik_fkey" FOREIGN KEY ("nik") REFERENCES "NIKRecord"("nik") ON DELETE RESTRICT ON UPDATE CASCADE;
