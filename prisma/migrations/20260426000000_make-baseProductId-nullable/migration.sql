-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_baseProductId_fkey";

-- DropIndex
DROP INDEX "Product_sku_webpageId_baseProductId_key";

-- AlterTable
ALTER TABLE "BaseProduct" ADD COLUMN     "stockAmount" INTEGER;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stockAmount" INTEGER,
ALTER COLUMN "baseProductId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_webpageId_key" ON "Product"("sku", "webpageId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_baseProductId_fkey" FOREIGN KEY ("baseProductId") REFERENCES "BaseProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
