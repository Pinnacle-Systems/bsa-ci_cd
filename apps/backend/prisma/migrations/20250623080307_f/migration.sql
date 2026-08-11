/*
  Warnings:

  - Made the column `approval` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `approval` VARCHAR(191) NOT NULL DEFAULT 'hod';
