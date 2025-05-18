/*
  Warnings:

  - You are about to drop the column `brand` on the `BaseProduct` table. All the data in the column will be lost.
  - Added the required column `brandId` to the `BaseProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BaseProduct" DROP COLUMN "brand",
ADD COLUMN     "brandId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "BaseProduct" ADD CONSTRAINT "BaseProduct_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
