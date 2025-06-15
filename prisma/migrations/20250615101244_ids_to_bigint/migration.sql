/*
  Warnings:

  - The primary key for the `BaseProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Brand` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Webpage` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "BaseProduct" DROP CONSTRAINT "BaseProduct_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_baseProductId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_webpageId_fkey";

-- AlterTable
ALTER TABLE "BaseProduct" DROP CONSTRAINT "BaseProduct_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGSERIAL,
ALTER COLUMN "brandId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "BaseProduct_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGSERIAL,
ADD CONSTRAINT "Brand_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGSERIAL,
ALTER COLUMN "brandId" SET DATA TYPE BIGINT,
ALTER COLUMN "webpageId" SET DATA TYPE BIGINT,
ALTER COLUMN "baseProductId" SET DATA TYPE BIGINT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Webpage" DROP CONSTRAINT "Webpage_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGSERIAL,
ADD CONSTRAINT "Webpage_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_webpageId_fkey" FOREIGN KEY ("webpageId") REFERENCES "Webpage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_baseProductId_fkey" FOREIGN KEY ("baseProductId") REFERENCES "BaseProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaseProduct" ADD CONSTRAINT "BaseProduct_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
