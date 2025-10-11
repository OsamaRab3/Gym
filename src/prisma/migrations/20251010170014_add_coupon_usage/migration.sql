-- CreateTable
CREATE TABLE `CouponUsage` (
    `id` CHAR(36) NOT NULL,
    `couponId` CHAR(36) NOT NULL,
    `deviceId` VARCHAR(255) NOT NULL,
    `usedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CouponUsage_couponId_deviceId_key`(`couponId`, `deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CouponUsage` ADD CONSTRAINT `CouponUsage_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
