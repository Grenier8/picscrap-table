/*
  Warnings:

  - A unique constraint covering the columns `[sku,webpageId,baseProductId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_sku_webpageId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_webpageId_baseProductId_key" ON "Product"("sku", "webpageId", "baseProductId");
