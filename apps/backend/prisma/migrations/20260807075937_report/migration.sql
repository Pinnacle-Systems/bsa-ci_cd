/*
  Warnings:

  - Made the column `sender` on table `chat` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `chat` DROP FOREIGN KEY `chat_sender_fkey`;

-- AlterTable
ALTER TABLE `chat` MODIFY `sender` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_sender_fkey` FOREIGN KEY (`sender`) REFERENCES `User`(`Idcard`) ON DELETE RESTRICT ON UPDATE CASCADE;
