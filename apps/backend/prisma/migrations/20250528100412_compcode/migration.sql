/*
  Warnings:

  - Added the required column `comeCode` to the `onduty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedOn` to the `onduty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `onduty` ADD COLUMN `comeCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `in_latitude` VARCHAR(191) NULL,
    ADD COLUMN `in_location` VARCHAR(191) NULL,
    ADD COLUMN `in_longtiude` VARCHAR(191) NULL,
    ADD COLUMN `out_latitude` VARCHAR(191) NULL,
    ADD COLUMN `out_location` VARCHAR(191) NULL,
    ADD COLUMN `out_longtiude` VARCHAR(191) NULL,
    ADD COLUMN `updatedOn` DATETIME(3) NOT NULL;
