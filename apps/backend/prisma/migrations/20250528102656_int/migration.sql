/*
  Warnings:

  - You are about to alter the column `category` on the `onduty` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `onduty` MODIFY `category` INTEGER NULL;
