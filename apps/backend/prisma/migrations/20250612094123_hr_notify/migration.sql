-- AlterTable
ALTER TABLE `user` ADD COLUMN `hr` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `NotifyApprovalGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Idcard` VARCHAR(191) NULL,
    `COMPCODE` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_NotifyApprovalGroupToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_NotifyApprovalGroupToUser_AB_unique`(`A`, `B`),
    INDEX `_NotifyApprovalGroupToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_NotifyApprovalGroupToUser` ADD CONSTRAINT `_NotifyApprovalGroupToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `NotifyApprovalGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_NotifyApprovalGroupToUser` ADD CONSTRAINT `_NotifyApprovalGroupToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
