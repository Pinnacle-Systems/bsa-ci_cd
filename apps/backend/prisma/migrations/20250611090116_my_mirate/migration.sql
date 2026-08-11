/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `roleonpage` DROP FOREIGN KEY `RoleOnPage_roleId_fkey`;

-- DropIndex
DROP INDEX `RoleOnPage_roleId_fkey` ON `roleonpage`;

-- AlterTable
ALTER TABLE `roleonpage` ADD COLUMN `roleName` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Role_name_key` ON `Role`(`name`);

-- AddForeignKey
ALTER TABLE `RoleOnPage` ADD CONSTRAINT `RoleOnPage_roleName_fkey` FOREIGN KEY (`roleName`) REFERENCES `Role`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
