/*
  Warnings:

  - You are about to drop the column `COMPCODE` on the `userlog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `userlog` DROP COLUMN `COMPCODE`,
    ADD COLUMN `Idcard` VARCHAR(191) NULL;
