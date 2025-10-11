-- CreateTable
CREATE TABLE `_DiscountedProductToProduct` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_DiscountedProductToProduct_AB_unique`(`A`, `B`),
    INDEX `_DiscountedProductToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DiscountedProductToProduct` ADD CONSTRAINT `_DiscountedProductToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `DiscountedProduct`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiscountedProductToProduct` ADD CONSTRAINT `_DiscountedProductToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
