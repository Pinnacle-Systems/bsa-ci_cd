/*
  Warnings:

  - A unique constraint covering the columns `[UserId]` on the table `trackers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `trackers_UserId_key` ON `trackers`(`UserId`);
