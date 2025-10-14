/*
  Warnings:

  - You are about to drop the column `code` on the `Province` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Province_code_key` ON `Province`;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `totalFee` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `Province` DROP COLUMN `code`;
