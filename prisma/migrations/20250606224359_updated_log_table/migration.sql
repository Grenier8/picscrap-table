/*
  Warnings:

  - You are about to drop the column `typeId` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the `LogType` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[executionId]` on the table `Log` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `executionId` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webpage` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_typeId_fkey";

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "typeId",
ADD COLUMN     "data" TEXT NOT NULL,
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "event" TEXT NOT NULL,
ADD COLUMN     "executionId" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD COLUMN     "webpage" TEXT NOT NULL;

-- DropTable
DROP TABLE "LogType";

-- CreateIndex
CREATE UNIQUE INDEX "Log_executionId_key" ON "Log"("executionId");
