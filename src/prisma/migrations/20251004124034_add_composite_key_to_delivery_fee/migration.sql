/*
  Warnings:

  - A unique constraint covering the columns `[provinceId,productId]` on the table `DeliveryFee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `DeliveryFee_provinceId_productId_key` ON `DeliveryFee`(`provinceId`, `productId`);
