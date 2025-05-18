/*
  Warnings:

  - You are about to drop the column `lastname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastname",
DROP COLUMN "name";
ALTER TABLE "User" ADD COLUMN "fullname" TEXT;
UPDATE "User" SET "fullname" = 'Default Name' WHERE "fullname" IS NULL;
ALTER TABLE "User" ALTER COLUMN "fullname" SET NOT NULL;
