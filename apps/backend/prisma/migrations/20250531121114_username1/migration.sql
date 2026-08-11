/*
  Warnings:

  - You are about to drop the `_onduty_category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_onduty_category` DROP FOREIGN KEY `_onduty_Category_A_fkey`;

-- DropForeignKey
ALTER TABLE `_onduty_category` DROP FOREIGN KEY `_onduty_Category_B_fkey`;

-- AlterTable
ALTER TABLE `onduty` MODIFY `category` INTEGER NULL DEFAULT 1;

-- DropTable
DROP TABLE `_onduty_category`;

-- AddForeignKey
ALTER TABLE `onduty` ADD CONSTRAINT `onduty_category_fkey` FOREIGN KEY (`category`) REFERENCES `OndutyMaster`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
