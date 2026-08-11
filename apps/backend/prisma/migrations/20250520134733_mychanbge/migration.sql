/*
  Warnings:

  - Made the column `companyid` on table `companycode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `companycode` MODIFY `companyid` VARCHAR(191) NOT NULL;
