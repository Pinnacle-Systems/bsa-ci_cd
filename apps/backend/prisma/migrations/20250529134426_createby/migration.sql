-- AlterTable
ALTER TABLE `onduty` ADD COLUMN `createdBy` VARCHAR(191) NULL,
    ADD COLUMN `modified_By` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `onduty` ADD CONSTRAINT `onduty_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`Idcard`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `onduty` ADD CONSTRAINT `onduty_modified_By_fkey` FOREIGN KEY (`modified_By`) REFERENCES `User`(`Idcard`) ON DELETE SET NULL ON UPDATE CASCADE;
