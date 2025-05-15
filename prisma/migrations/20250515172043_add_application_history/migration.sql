/*
  Warnings:

  - The primary key for the `JobApplication` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_pkey",
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "id" DROP DEFAULT,
ADD CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id", "version");
DROP SEQUENCE "JobApplication_id_seq";
