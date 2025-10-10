/*
  Warnings:

  - You are about to drop the `_DiscountedProductToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_DiscountedProductToProduct` DROP FOREIGN KEY `_DiscountedProductToProduct_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DiscountedProductToProduct` DROP FOREIGN KEY `_DiscountedProductToProduct_B_fkey`;

-- DropTable
DROP TABLE `_DiscountedProductToProduct`;

-- AddForeignKey
ALTER TABLE `DiscountedProduct` ADD CONSTRAINT `DiscountedProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
