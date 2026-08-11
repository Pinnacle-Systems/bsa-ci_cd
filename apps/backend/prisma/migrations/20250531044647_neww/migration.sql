-- CreateTable
CREATE TABLE `OndutyMaster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `active` VARCHAR(191) NOT NULL,
    `COMPCODE` VARCHAR(191) NOT NULL DEFAULT 'null',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_onduty_Category` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_onduty_Category_AB_unique`(`A`, `B`),
    INDEX `_onduty_Category_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_onduty_Category` ADD CONSTRAINT `_onduty_Category_A_fkey` FOREIGN KEY (`A`) REFERENCES `OndutyMaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_onduty_Category` ADD CONSTRAINT `_onduty_Category_B_fkey` FOREIGN KEY (`B`) REFERENCES `onduty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
