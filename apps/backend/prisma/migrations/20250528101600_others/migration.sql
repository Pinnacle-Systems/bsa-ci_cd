/*
  Warnings:

  - Added the required column `others` to the `onduty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `onduty` ADD COLUMN `others` VARCHAR(191) NOT NULL;
