-- DropForeignKey
ALTER TABLE `advance_requests` DROP FOREIGN KEY `advance_requests_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `advance_requests` DROP FOREIGN KEY `advance_requests_modified_By_fkey`;

-- DropForeignKey
ALTER TABLE `advance_requests` DROP FOREIGN KEY `advance_requests_userId_fkey`;

-- DropForeignKey
ALTER TABLE `companycode` DROP FOREIGN KEY `CompanyCode_Idcard_fkey`;

-- DropForeignKey
ALTER TABLE `leaveentry` DROP FOREIGN KEY `LeaveEntry_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `leaveentry` DROP FOREIGN KEY `LeaveEntry_hod_fkey`;

-- DropForeignKey
ALTER TABLE `leaveentry` DROP FOREIGN KEY `LeaveEntry_modified_By_fkey`;

-- DropForeignKey
ALTER TABLE `leaveentry` DROP FOREIGN KEY `LeaveEntry_userId_fkey`;

-- DropForeignKey
ALTER TABLE `onduty` DROP FOREIGN KEY `onduty_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `onduty` DROP FOREIGN KEY `onduty_modified_By_fkey`;

-- DropForeignKey
ALTER TABLE `onduty` DROP FOREIGN KEY `onduty_userId_fkey`;

-- DropForeignKey
ALTER TABLE `permissionentry` DROP FOREIGN KEY `PermissionEntry_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `permissionentry` DROP FOREIGN KEY `PermissionEntry_hod_fkey`;

-- DropForeignKey
ALTER TABLE `permissionentry` DROP FOREIGN KEY `PermissionEntry_modified_By_fkey`;

-- DropForeignKey
ALTER TABLE `permissionentry` DROP FOREIGN KEY `PermissionEntry_userId_fkey`;

-- DropIndex
DROP INDEX `advance_requests_createdBy_fkey` ON `advance_requests`;

-- DropIndex
DROP INDEX `advance_requests_modified_By_fkey` ON `advance_requests`;

-- DropIndex
DROP INDEX `advance_requests_userId_fkey` ON `advance_requests`;

-- DropIndex
DROP INDEX `LeaveEntry_createdBy_fkey` ON `leaveentry`;

-- DropIndex
DROP INDEX `LeaveEntry_hod_fkey` ON `leaveentry`;

-- DropIndex
DROP INDEX `LeaveEntry_modified_By_fkey` ON `leaveentry`;

-- DropIndex
DROP INDEX `LeaveEntry_userId_fkey` ON `leaveentry`;

-- DropIndex
DROP INDEX `onduty_createdBy_fkey` ON `onduty`;

-- DropIndex
DROP INDEX `onduty_modified_By_fkey` ON `onduty`;

-- DropIndex
DROP INDEX `onduty_userId_fkey` ON `onduty`;

-- DropIndex
DROP INDEX `PermissionEntry_createdBy_fkey` ON `permissionentry`;

-- DropIndex
DROP INDEX `PermissionEntry_hod_fkey` ON `permissionentry`;

-- DropIndex
DROP INDEX `PermissionEntry_modified_By_fkey` ON `permissionentry`;

-- DropIndex
DROP INDEX `PermissionEntry_userId_fkey` ON `permissionentry`;

-- AddForeignKey
ALTER TABLE `onduty` ADD CONSTRAINT `onduty_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `onduty` ADD CONSTRAINT `onduty_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `onduty` ADD CONSTRAINT `onduty_modified_By_fkey` FOREIGN KEY (`modified_By`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `advance_requests` ADD CONSTRAINT `advance_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `advance_requests` ADD CONSTRAINT `advance_requests_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `advance_requests` ADD CONSTRAINT `advance_requests_modified_By_fkey` FOREIGN KEY (`modified_By`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyCode` ADD CONSTRAINT `CompanyCode_Idcard_fkey` FOREIGN KEY (`Idcard`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermissionEntry` ADD CONSTRAINT `PermissionEntry_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermissionEntry` ADD CONSTRAINT `PermissionEntry_modified_By_fkey` FOREIGN KEY (`modified_By`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermissionEntry` ADD CONSTRAINT `PermissionEntry_hod_fkey` FOREIGN KEY (`hod`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermissionEntry` ADD CONSTRAINT `PermissionEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveEntry` ADD CONSTRAINT `LeaveEntry_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveEntry` ADD CONSTRAINT `LeaveEntry_modified_By_fkey` FOREIGN KEY (`modified_By`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveEntry` ADD CONSTRAINT `LeaveEntry_hod_fkey` FOREIGN KEY (`hod`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveEntry` ADD CONSTRAINT `LeaveEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`Idcard`) ON DELETE CASCADE ON UPDATE CASCADE;
