/*
  Warnings:

  - You are about to drop the column `createdAt` on the `job_application` table. All the data in the column will be lost.
  - You are about to drop the column `positionName` on the `job_application` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `job_application` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `job_application` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - Added the required column `position_name` to the `job_application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_id` to the `job_application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `job_application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "job_application" DROP CONSTRAINT "job_application_statusId_fkey";

-- DropForeignKey
ALTER TABLE "job_application" DROP CONSTRAINT "job_application_userId_fkey";

-- AlterTable
ALTER TABLE "job_application" DROP COLUMN "createdAt",
DROP COLUMN "positionName",
DROP COLUMN "statusId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "position_name" TEXT NOT NULL,
ADD COLUMN     "status_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "job_application" ADD CONSTRAINT "job_application_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "application_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_application" ADD CONSTRAINT "job_application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
