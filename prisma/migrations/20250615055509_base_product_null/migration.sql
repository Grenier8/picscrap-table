/*
  Warnings:

  - Made the column `baseProductId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_baseProductId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "baseProductId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_baseProductId_fkey" FOREIGN KEY ("baseProductId") REFERENCES "BaseProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
