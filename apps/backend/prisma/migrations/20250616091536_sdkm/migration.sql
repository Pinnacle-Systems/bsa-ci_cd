/*
  Warnings:

  - You are about to drop the column `km` on the `onduty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `onduty` DROP COLUMN `km`,
    ADD COLUMN `end_km` VARCHAR(191) NULL,
    ADD COLUMN `start_km` VARCHAR(191) NULL;
