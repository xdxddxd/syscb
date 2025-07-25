/*
  Warnings:

  - You are about to drop the column `email` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `branches` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `branches` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `branches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact` to the `branches` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `address` on the `branches` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('REGULAR', 'OVERTIME', 'HOLIDAY', 'WEEKEND', 'NIGHT', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- AlterTable
ALTER TABLE "branches" DROP COLUMN "email",
DROP COLUMN "phone",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "contact" JSONB NOT NULL,
ADD COLUMN     "settings" JSONB,
DROP COLUMN "address",
ADD COLUMN     "address" JSONB NOT NULL,
ALTER COLUMN "managerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "branchId" TEXT;

-- CreateTable
CREATE TABLE "employee_schedules" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "shiftType" "ShiftType" NOT NULL DEFAULT 'REGULAR',
    "status" "ScheduleStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_schedules_employeeId_date_key" ON "employee_schedules"("employeeId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "branches_code_key" ON "branches"("code");

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_schedules" ADD CONSTRAINT "employee_schedules_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_schedules" ADD CONSTRAINT "employee_schedules_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
