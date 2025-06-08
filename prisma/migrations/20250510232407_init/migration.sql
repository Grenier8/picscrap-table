/*
  Warnings:

  - You are about to drop the column `onStock` on the `BaseProduct` table. All the data in the column will be lost.
  - You are about to drop the column `onStock` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_baseProductId_fkey";

-- AlterTable
ALTER TABLE "BaseProduct" DROP COLUMN "onStock",
ADD COLUMN     "outOfStock" BOOLEAN;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "onStock",
ADD COLUMN     "outOfStock" BOOLEAN,
ALTER COLUMN "baseProductId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_baseProductId_fkey" FOREIGN KEY ("baseProductId") REFERENCES "BaseProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
