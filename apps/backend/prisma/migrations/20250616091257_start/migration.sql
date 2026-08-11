/*
  Warnings:

  - You are about to drop the column `closingkm` on the `onduty` table. All the data in the column will be lost.
  - You are about to drop the column `openingkm` on the `onduty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `onduty` DROP COLUMN `closingkm`,
    DROP COLUMN `openingkm`,
    ADD COLUMN `km` VARCHAR(191) NULL;
