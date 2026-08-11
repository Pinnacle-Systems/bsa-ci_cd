-- AlterTable
ALTER TABLE `onduty` ADD COLUMN `Evechilekm` VARCHAR(191) NULL,
    ADD COLUMN `Svechilekm` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `vechilekm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `VEHICLENO` VARCHAR(191) NULL,
    `km` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
