/*
  Warnings:

  - You are about to drop the column `createdOn` on the `onduty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `onduty` DROP COLUMN `createdOn`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
