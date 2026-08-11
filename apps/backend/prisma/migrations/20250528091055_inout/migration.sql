-- CreateTable
CREATE TABLE `onduty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `docid` VARCHAR(50) NOT NULL,
    `docdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idcard` VARCHAR(200) NOT NULL,
    `empname` VARCHAR(100) NOT NULL,
    `hod` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `createdOn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `group` VARCHAR(191) NOT NULL DEFAULT 'onduty',
    `inout` VARCHAR(191) NOT NULL DEFAULT 'IN',

    UNIQUE INDEX `onduty_docid_key`(`docid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `onduty` ADD CONSTRAINT `onduty_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`Idcard`) ON DELETE SET NULL ON UPDATE CASCADE;
