-- CreateTable
CREATE TABLE `settings` (
    `SettingId` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` INTEGER NOT NULL,
    `Notification` BOOLEAN NOT NULL,
    `BioMatrics` BOOLEAN NOT NULL,

    UNIQUE INDEX `settings_UserId_key`(`UserId`),
    PRIMARY KEY (`SettingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `settings` ADD CONSTRAINT `settings_UserId_fkey` FOREIGN KEY (`UserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
