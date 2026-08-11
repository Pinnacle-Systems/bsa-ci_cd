/*
  Warnings:

  - A unique constraint covering the columns `[docid]` on the table `trackers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `trackers` ADD COLUMN `docid` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `trackers_docid_key` ON `trackers`(`docid`);
