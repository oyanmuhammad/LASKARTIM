/*
  Warnings:

  - You are about to drop the column `citizenName` on the `Report` table. All the data in the column will be lost.
  - Added the required column `category` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Location" AS ENUM ('DUSUN_KARANG_BARU_TIMUR', 'DUSUN_TAMPATAN', 'DUSUN_PAOK_DANGKA');

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "citizenName",
ADD COLUMN     "category" VARCHAR(100) NOT NULL,
ADD COLUMN     "location" "Location" NOT NULL;
