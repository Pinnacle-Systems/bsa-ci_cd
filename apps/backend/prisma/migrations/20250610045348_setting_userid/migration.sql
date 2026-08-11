-- DropForeignKey
ALTER TABLE `settings` DROP FOREIGN KEY `settings_UserId_fkey`;

-- AlterTable
ALTER TABLE `settings` MODIFY `UserId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `settings` ADD CONSTRAINT `settings_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`Idcard`) ON DELETE RESTRICT ON UPDATE CASCADE;
