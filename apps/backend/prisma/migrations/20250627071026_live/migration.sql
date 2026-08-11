-- CreateTable
CREATE TABLE `trackers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `UserId` VARCHAR(191) NULL,
    `isLive` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
