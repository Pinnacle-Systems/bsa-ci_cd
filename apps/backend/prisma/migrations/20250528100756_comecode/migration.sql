/*
  Warnings:

  - You are about to drop the column `comeCode` on the `onduty` table. All the data in the column will be lost.
  - Added the required column `compCode` to the `onduty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `onduty` DROP COLUMN `comeCode`,
    ADD COLUMN `compCode` VARCHAR(191) NOT NULL;
