/*
  Warnings:

  - The `status` column on the `employees` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `budget` on table `departments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `department_id` on table `employees` required. This step will fail if there are existing NULL values in that column.
  - Made the column `job_title_id` on table `employees` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'TERMINATED');

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "budget" SET NOT NULL;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "role" SET DEFAULT 'USER',
ALTER COLUMN "department_id" SET NOT NULL,
ALTER COLUMN "job_title_id" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "job_titles" ALTER COLUMN "salary_range_max" DROP NOT NULL;

-- DropEnum
DROP TYPE "EmployeeStatus";
