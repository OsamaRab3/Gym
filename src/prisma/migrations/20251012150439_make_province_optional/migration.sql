-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_provinceId_fkey`;

-- DropIndex
DROP INDEX `Order_provinceId_fkey` ON `Order`;

-- AlterTable
ALTER TABLE `Order` MODIFY `provinceId` CHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Province`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
