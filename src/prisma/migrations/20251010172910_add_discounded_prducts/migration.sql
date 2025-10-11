-- AlterTable
ALTER TABLE `CouponUsage` ADD COLUMN `expiresAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `DiscountedProduct` (
    `id` CHAR(36) NOT NULL,
    `productId` CHAR(36) NOT NULL,
    `originalPrice` DOUBLE NOT NULL,
    `discountPrice` DOUBLE NOT NULL,
    `couponId` CHAR(36) NOT NULL,
    `deviceId` VARCHAR(255) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DiscountedProduct_productId_couponId_deviceId_key`(`productId`, `couponId`, `deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CouponUsageToDiscountedProduct` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_CouponUsageToDiscountedProduct_AB_unique`(`A`, `B`),
    INDEX `_CouponUsageToDiscountedProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DiscountedProduct` ADD CONSTRAINT `DiscountedProduct_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouponUsageToDiscountedProduct` ADD CONSTRAINT `_CouponUsageToDiscountedProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `CouponUsage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouponUsageToDiscountedProduct` ADD CONSTRAINT `_CouponUsageToDiscountedProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `DiscountedProduct`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
